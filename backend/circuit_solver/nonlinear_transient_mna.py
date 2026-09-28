"""
SmartBreadboard 3D — Non-Linear Semiconductor & BJT Transient MNA Solver (Phase 31)
Solves dynamic time-domain electrical circuits containing non-linear semiconductor devices
(PN junction diodes, LEDs, power rectifiers, bridge rectifiers, and NPN/PNP BJT transistors)
using Damped Newton-Raphson linearized companion models integrated into Modified Nodal Analysis (MNA).

Scientific Integrity:
- source: "nonlinear_transient_mna_simulation"
- is_measured: False
- PHYSICAL_VALIDATION_STATUS: "NOT_PERFORMED"
"""

import numpy as np
from typing import Dict, Any, List, Tuple, Optional

try:
    from backend.cv.value_parser import format_si_value
except ImportError:
    from cv.value_parser import format_si_value

from .component_models import Component, Node, ComponentMeasurement, SolverResult
from .netlist_parser import parse_circuit_netlist
from .validation import validate_circuit_netlist
from .transient_mna import TransientSource
from .semiconductor_registry import get_semiconductor_definition, compute_thermal_voltage
from .bjt_registry import get_bjt_definition


def _pnjlim(v_new: float, v_old: float, vt: float, vcrit: float = 0.6) -> float:
    """
    SPICE pnjlim algorithm for non-linear PN junction / BJT voltage limiting.
    Limits junction voltage step to avoid numerical overflow and rapid switching oscillations.
    """
    if v_new > vcrit and abs(v_new - v_old) > 2.0 * vt:
        if v_old > 0.0:
            arg = 1.0 + (v_new - v_old) / max(vt, 1e-6)
            if arg > 0.0:
                return float(v_old + vt * np.log(arg))
            else:
                return float(vcrit)
        else:
            return float(vcrit)
    elif v_new < 0.0:
        if v_old > 0.0:
            return float(max(v_new, -2.0 * vt))
        else:
            return float(v_new)
    else:
        return float(v_new)


class DiodeNonlinearModel:
    """Shockley diode model with numerical overflow safeguards and dynamic capacitance."""
    def __init__(
        self,
        comp: Any = "D1",
        anode_node: Optional[str] = None,
        cathode_node: Optional[str] = None,
        model_name: Optional[str] = None,
        custom_params: Optional[Dict[str, Any]] = None,
        dynamic_cap: bool = True,
        device_id: Optional[str] = None,
        **kwargs
    ):
        if hasattr(comp, "id"):
            self.id = comp.id
            self.node_anode = comp.node1
            self.node_cathode = comp.node2
            ctype = comp.type.lower()
            m_name = getattr(comp, "model", ctype)
        elif isinstance(comp, dict):
            self.id = comp.get("id", device_id or "D1")
            self.node_anode = comp.get("node1", anode_node or "NODE_1")
            self.node_cathode = comp.get("node2", cathode_node or "GND")
            m_name = comp.get("model", model_name or comp.get("type", "1N4148"))
        else:
            self.id = str(device_id or comp)
            self.node_anode = anode_node or "NODE_1"
            self.node_cathode = cathode_node or "GND"
            m_name = model_name or "1N4148"

        # Load registry baseline for model / component type
        reg = get_semiconductor_definition(m_name)
        params = dict(reg.get("parameters", {}))
        
        if custom_params:
            params.update(custom_params)

        self.Is = float(params.get("Is", params.get("is_sat", 1.0e-14)))
        self.is_sat = self.Is
        self.n = float(params.get("n", 1.0))
        self.temp_k = float(params.get("temperature_k", params.get("temperature", 300.0)))
        self.Rs = float(params.get("Rs", 0.0))
        self.Cj0 = float(params.get("Cj0", params.get("c_j0", 2.0e-12)))
        self.c_j0 = self.Cj0
        self.V0 = float(params.get("V0", 0.7))
        self.M = float(params.get("M", 0.5))
        self.tau_t = float(params.get("tau_t", 1.0e-9))
        self.enable_dynamic_capacitance = dynamic_cap

        self.Vt = compute_thermal_voltage(self.temp_k)
        self.nVt = max(self.n * self.Vt, 1e-6)

        # Numerical overflow limit (x_max = 40 => exp(40) ~ 2.35e17)
        self.v_limit = 40.0 * self.nVt

        # State tracking
        self.v_d = 0.0
        self.i_d = 0.0
        self.g_d = 1e-12
        self.c_d = self.Cj0
        self.prev_vd = 0.0
        self.prev_ic_cap = 0.0

    def evaluate_current(self, vd: float) -> float:
        """Evaluates diode current I_D(V_D)."""
        return self.evaluate_iv(vd)[0]

    def evaluate_conductance(self, vd: float) -> float:
        """Evaluates diode small-signal conductance g_D = dI_D/dV_D."""
        return self.evaluate_iv(vd)[1]

    def evaluate_iv(self, vd: float) -> Tuple[float, float]:
        """
        Evaluates Shockley current I_D(V_D) and small-signal conductance g_D = dI_D / dV_D
        with smooth linear continuation above v_limit to guarantee overflow protection.
        """
        if vd <= self.v_limit:
            if vd < -10.0 * self.nVt:
                # Deep reverse bias: constant saturation current
                i_d = -self.Is
                g_d = 1e-12
            else:
                exp_term = np.exp(vd / self.nVt)
                i_d = self.Is * (exp_term - 1.0)
                g_d = (self.Is / self.nVt) * exp_term + 1e-12
        else:
            # Linear continuation above v_limit
            exp_max = np.exp(40.0)
            i_limit = self.Is * (exp_max - 1.0)
            g_limit = (self.Is / self.nVt) * exp_max
            i_d = i_limit + g_limit * (vd - self.v_limit)
            g_d = g_limit

        return float(i_d), float(g_d)

    def evaluate_capacitance(self, vd: float, g_d: float) -> float:
        """Evaluates combined depletion and diffusion capacitance."""
        if not self.enable_dynamic_capacitance:
            return 0.0
        # Depletion capacitance with forward voltage clamp at 0.5 * V0
        vd_clamped = min(vd, 0.5 * self.V0)
        c_dep = self.Cj0 * ((1.0 - vd_clamped / max(self.V0, 0.1)) ** (-self.M))
        # Diffusion capacitance proportional to forward conductance
        c_diff = self.tau_t * max(g_d, 0.0)
        return float(c_dep + c_diff)


class BJTNonlinearModel:
    """
    Non-linear Bipolar Junction Transistor (NPN / PNP) model based on
    Ebers-Moll transport formulation with Early effect, exact Jacobian derivatives,
    and dynamic junction capacitances.
    
    Current Sign Convention:
    Positive currents are defined as flowing INTO the respective terminal:
    - Base: IB (into base)
    - Collector: IC (into collector)
    - Emitter: IE (into emitter)
    Strictly satisfies KCL: IB + IC + IE = 0 at all operating points.
    """
    def __init__(
        self,
        comp: Any = "Q1",
        collector_node: Optional[str] = None,
        base_node: Optional[str] = None,
        emitter_node: Optional[str] = None,
        model_name: Optional[str] = None,
        polarity: Optional[str] = None,
        custom_params: Optional[Dict[str, Any]] = None,
        dynamic_cap: bool = True,
        device_id: Optional[str] = None,
        **kwargs
    ):
        if hasattr(comp, "id"):
            self.id = comp.id
            props = getattr(comp, "properties", {})
            self.node_collector = props.get("collector") or props.get("node_c") or props.get("node_collector") or comp.node1
            self.node_base = props.get("base") or props.get("node_b") or props.get("node_base") or comp.node2
            self.node_emitter = getattr(comp, "node3", None) or props.get("emitter") or props.get("node_e") or props.get("node_emitter") or props.get("node3") or "GND"
            m_name = getattr(comp, "model", None) or props.get("model") or comp.type
            pol = getattr(comp, "polarity", None) or props.get("polarity")
        elif isinstance(comp, dict):
            self.id = comp.get("id", device_id or "Q1")
            props = comp.get("properties", {})
            self.node_collector = comp.get("collector") or comp.get("node_c") or comp.get("node_collector") or comp.get("node1") or collector_node or "NODE_C"
            self.node_base = comp.get("base") or comp.get("node_b") or comp.get("node_base") or comp.get("node2") or base_node or "NODE_B"
            self.node_emitter = comp.get("node3") or comp.get("emitter") or comp.get("node_e") or comp.get("node_emitter") or emitter_node or "GND"
            m_name = comp.get("model") or props.get("model") or model_name or comp.get("type", "NPN_GENERIC")
            pol = comp.get("polarity") or props.get("polarity") or polarity

        else:
            self.id = str(device_id or comp)
            self.node_collector = collector_node or "NODE_C"
            self.node_base = base_node or "NODE_B"
            self.node_emitter = emitter_node or "GND"
            m_name = model_name or "NPN_GENERIC"
            pol = polarity

        reg = get_bjt_definition(m_name)
        self.polarity = (pol or reg.get("polarity", "NPN")).upper()
        params = dict(reg.get("parameters", {}))
        if custom_params:
            params.update(custom_params)

        self.Is = float(params.get("Is", params.get("is_sat", 1.0e-14)))
        self.beta_f = float(params.get("beta_f", params.get("beta", 100.0)))
        self.beta_r = float(params.get("beta_r", 2.0))
        self.n_f = float(params.get("n_f", 1.0))
        self.n_r = float(params.get("n_r", 1.0))
        self.temp_k = float(params.get("temperature_k", params.get("temperature", 300.0)))
        self.v_af = float(params.get("v_af", 100.0))
        self.c_je0 = float(params.get("c_je0", 4.0e-12))
        self.c_jc0 = float(params.get("c_jc0", 3.0e-12))
        self.v_0e = float(params.get("v_0e", 0.75))
        self.v_0c = float(params.get("v_0c", 0.70))
        self.m_e = float(params.get("m_e", 0.33))
        self.m_c = float(params.get("m_c", 0.33))
        self.tau_f = float(params.get("tau_f", 0.3e-9))
        self.tau_r = float(params.get("tau_r", 10.0e-9))
        self.enable_dynamic_capacitance = dynamic_cap

        self.Vt = compute_thermal_voltage(self.temp_k)
        self.nVt_f = max(self.n_f * self.Vt, 1e-6)
        self.nVt_r = max(self.n_r * self.Vt, 1e-6)
        self.v_limit_f = 40.0 * self.nVt_f
        self.v_limit_r = 40.0 * self.nVt_r

        # State tracking
        self.v_be = 0.0
        self.v_bc = 0.0
        self.v_ce = 0.0
        self.i_b = 0.0
        self.i_c = 0.0
        self.i_e = 0.0
        self.region = "CUTOFF"
        self.prev_vbe = 0.0
        self.prev_vbc = 0.0
        self.prev_ic_be_cap = 0.0
        self.prev_ic_bc_cap = 0.0

    def _evaluate_junction(self, v_j: float, is_fwd: bool = True) -> Tuple[float, float]:
        """Evaluates non-linear junction current and small-signal derivative with safe continuation."""
        nVt = self.nVt_f if is_fwd else self.nVt_r
        v_lim = self.v_limit_f if is_fwd else self.v_limit_r
        if v_j <= v_lim:
            if v_j < -10.0 * nVt:
                i_j = -self.Is
                g_j = 1e-12
            else:
                exp_term = np.exp(v_j / nVt)
                i_j = self.Is * (exp_term - 1.0)
                g_j = (self.Is / nVt) * exp_term + 1e-12
        else:
            exp_max = np.exp(40.0)
            i_lim = self.Is * (exp_max - 1.0)
            g_lim = (self.Is / nVt) * exp_max
            i_j = i_lim + g_lim * (v_j - v_lim)
            g_j = g_lim
        return float(i_j), float(g_j)

    def evaluate_terminals(
        self,
        v_b: float,
        v_c: float,
        v_e: float
    ) -> Tuple[Dict[str, float], Dict[Tuple[str, str], float], str]:
        """
        Computes terminal currents (IB, IC, IE) and exact Jacobian matrix dI_k / dV_j
        for terminals (B, C, E).
        
        Returns:
            currents: {"IB": ib, "IC": ic, "IE": ie}
            jacobian: {(term_k, term_j): dIk/dVj}
            region: "CUTOFF" | "FORWARD_ACTIVE" | "SATURATION"
        """
        if self.polarity == "NPN":
            v_be = v_b - v_e
            v_bc = v_b - v_c
            v_ce = v_c - v_e

            i_f, g_f = self._evaluate_junction(v_be, is_fwd=True)
            i_r, g_r = self._evaluate_junction(v_bc, is_fwd=False)

            # Early Effect (active when VCE > 0)
            if v_ce > 0.0 and self.v_af > 0.0:
                f_early = 1.0 + v_ce / self.v_af
                df_early = 1.0 / self.v_af
            else:
                f_early = 1.0
                df_early = 0.0

            i_b = (i_f / self.beta_f) + (i_r / self.beta_r)
            i_c = (i_f - i_r) * f_early - (i_r / self.beta_r)
            i_e = -(i_b + i_c)

            # Jacobian Conductances: dI / dV
            dIb_dVb = (g_f / self.beta_f) + (g_r / self.beta_r)
            dIb_dVc = -(g_r / self.beta_r)
            dIb_dVe = -(g_f / self.beta_f)

            dIc_dVb = (g_f - g_r) * f_early - (g_r / self.beta_r)
            dIc_dVc = g_r * f_early + (g_r / self.beta_r) + (i_f - i_r) * df_early
            dIc_dVe = -g_f * f_early - (i_f - i_r) * df_early

            dIe_dVb = -(dIb_dVb + dIc_dVb)
            dIe_dVc = -(dIb_dVc + dIc_dVc)
            dIe_dVe = -(dIb_dVe + dIc_dVe)

            # Region Classification
            if v_be < 0.45 or i_b < 1e-7:
                region = "CUTOFF"
            elif v_bc < 0.40 and v_ce > 0.30:
                region = "FORWARD_ACTIVE"
            else:
                region = "SATURATION"

        else:  # PNP Polarity
            v_eb = v_e - v_b
            v_cb = v_c - v_b
            v_ec = v_e - v_c

            i_f, g_f = self._evaluate_junction(v_eb, is_fwd=True)
            i_r, g_r = self._evaluate_junction(v_cb, is_fwd=False)

            if v_ec > 0.0 and self.v_af > 0.0:
                f_early = 1.0 + v_ec / self.v_af
                df_early = 1.0 / self.v_af
            else:
                f_early = 1.0
                df_early = 0.0

            i_b = -((i_f / self.beta_f) + (i_r / self.beta_r))
            i_c = -((i_f - i_r) * f_early - (i_r / self.beta_r))
            i_e = -(i_b + i_c)

            # Jacobian
            dIb_dVb = -((g_f / self.beta_f) * (-1.0) + (g_r / self.beta_r) * (-1.0))
            dIb_dVc = -((g_r / self.beta_r) * (1.0))
            dIb_dVe = -((g_f / self.beta_f) * (1.0))

            dIc_dVb = -((g_f - g_r) * (-1.0) * f_early - (g_r / self.beta_r) * (-1.0))
            dIc_dVc = -((-g_r * 1.0) * f_early - (g_r / self.beta_r) * 1.0 + (i_f - i_r) * (-df_early))
            dIc_dVe = -((g_f * 1.0) * f_early + (i_f - i_r) * (df_early))

            dIe_dVb = -(dIb_dVb + dIc_dVb)
            dIe_dVc = -(dIb_dVc + dIc_dVc)
            dIe_dVe = -(dIb_dVe + dIc_dVe)

            if v_eb < 0.45 or i_b > -1e-7:
                region = "CUTOFF"
            elif v_cb < 0.40 and v_ec > 0.30:
                region = "FORWARD_ACTIVE"
            else:
                region = "SATURATION"

        currents = {"IB": float(i_b), "IC": float(i_c), "IE": float(i_e)}
        jacobian = {
            ("B", "B"): float(dIb_dVb), ("B", "C"): float(dIb_dVc), ("B", "E"): float(dIb_dVe),
            ("C", "B"): float(dIc_dVb), ("C", "C"): float(dIc_dVc), ("C", "E"): float(dIc_dVe),
            ("E", "B"): float(dIe_dVb), ("E", "C"): float(dIe_dVc), ("E", "E"): float(dIe_dVe),
        }
        return currents, jacobian, region

    def evaluate_capacitances(self, v_b: float, v_c: float, v_e: float) -> Tuple[float, float]:
        """Evaluates dynamic base-emitter and base-collector junction capacitances."""
        if not self.enable_dynamic_capacitance:
            return 0.0, 0.0
        if self.polarity == "NPN":
            v_be = v_b - v_e
            v_bc = v_b - v_c
        else:
            v_be = v_e - v_b
            v_bc = v_c - v_b

        vbe_c = min(v_be, 0.5 * self.v_0e)
        vbc_c = min(v_bc, 0.5 * self.v_0c)
        c_be = self.c_je0 * ((1.0 - vbe_c / max(self.v_0e, 0.1)) ** (-self.m_e))
        c_bc = self.c_jc0 * ((1.0 - vbc_c / max(self.v_0c, 0.1)) ** (-self.m_c))
        return float(c_be), float(c_bc)


def solve_nonlinear_transient_mna(
    netlist: Dict[str, Any],
    t_start: float = 0.0,
    t_stop: float = 0.01,
    dt: float = 0.0001,
    method: str = "backward_euler",
    source_config: Optional[Dict[str, Any]] = None,
    initial_conditions: Optional[Dict[str, Any]] = None,
    nonlinear_config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Executes multi-timestep Non-Linear Transient MNA using Damped Newton-Raphson iterations
    and dynamic companion models for semiconductor devices (diodes, LEDs, rectifiers, BJTs),
    capacitors, and inductors.
    """
    # 1. Parameter Validation & Safeguards
    if dt <= 0:
        return {
            "status": "ERROR",
            "error_code": "INVALID_TIMESTEP",
            "message": f"Time step dt must be strictly positive (got {dt}).",
            "source": "nonlinear_transient_mna_simulation",
            "is_measured": False,
            "physical_validation_status": "NOT_PERFORMED"
        }
    if t_stop <= t_start:
        return {
            "status": "ERROR",
            "error_code": "INVALID_TIME_INTERVAL",
            "message": f"t_stop ({t_stop}) must be greater than t_start ({t_start}).",
            "source": "nonlinear_transient_mna_simulation",
            "is_measured": False,
            "physical_validation_status": "NOT_PERFORMED"
        }

    num_steps = int(round((t_stop - t_start) / dt))
    MAX_POINTS = 50000
    if num_steps + 1 > MAX_POINTS:
        return {
            "status": "ERROR",
            "error_code": "EXCESSIVE_SIMULATION_POINTS",
            "message": f"Simulation point count ({num_steps+1}) exceeds maximum allowed ({MAX_POINTS}).",
            "source": "nonlinear_transient_mna_simulation",
            "is_measured": False,
            "physical_validation_status": "NOT_PERFORMED"
        }

    nl_cfg = nonlinear_config or {}
    max_newton_iter = int(nl_cfg.get("max_iterations", 60))
    v_tol = float(nl_cfg.get("voltage_tolerance", 1e-6))
    damping_factor = float(nl_cfg.get("damping_factor", 0.65))
    enable_dynamic_cap = bool(nl_cfg.get("dynamic_capacitance", True))

    # 2. Netlist & Device Parsing
    components, sources, nodes_dict = parse_circuit_netlist(netlist)

    sources_to_validate = [dict(source_config)] if source_config else sources
    comp_dicts = [
        {"id": c.id, "type": c.type, "node1": c.node1, "node2": c.node2, "value": c.value}
        if hasattr(c, "id") else c
        for c in components
    ]
    is_valid, err_dict, warnings = validate_circuit_netlist(comp_dicts, sources_to_validate)
    if not is_valid and err_dict and err_dict.get("code") == "EMPTY_CIRCUIT":
        return {
            "status": "ERROR",
            "error_code": "INVALID_TOPOLOGY",
            "message": f"Circuit topology invalid: {err_dict.get('message')}",
            "source": "nonlinear_transient_mna_simulation",
            "is_measured": False
        }


    # Ground Node Identification
    ground_node_id = None
    if sources_to_validate:
        ground_node_id = sources_to_validate[0].get("negative_node") or sources_to_validate[0].get("node_neg")
    if not ground_node_id or ground_node_id not in nodes_dict:
        for nid, node in nodes_dict.items():
            if getattr(node, "is_ground", False) or "GND" in str(nid).upper() or "GROUND" in str(nid).upper():
                ground_node_id = nid
                break
    if not ground_node_id and nodes_dict:
        ground_node_id = list(nodes_dict.keys())[-1]

    # Partition Components
    resistors: List[Component] = []
    capacitors: List[Component] = []
    inductors: List[Component] = []
    diodes: List[DiodeNonlinearModel] = []
    bjts: List[BJTNonlinearModel] = []

    for comp in components:
        ctype = comp.type.lower()
        if ctype in ["resistor", "res", "wire", "jumper"]:
            resistors.append(comp)
        elif ctype in ["capacitor", "cap"]:
            capacitors.append(comp)
        elif ctype in ["inductor", "ind"]:
            inductors.append(comp)
        elif ctype in ["diode", "led", "rectifier", "diode_rectifier"]:
            d_model = DiodeNonlinearModel(comp, custom_params=nl_cfg.get("device_overrides", {}).get(comp.id))
            d_model.enable_dynamic_capacitance = enable_dynamic_cap
            diodes.append(d_model)
        elif ctype in ["bjt", "transistor", "npn", "pnp", "bjt_npn", "bjt_pnp"]:
            q_model = BJTNonlinearModel(comp, custom_params=nl_cfg.get("device_overrides", {}).get(comp.id))
            q_model.enable_dynamic_capacitance = enable_dynamic_cap
            bjts.append(q_model)
        else:
            resistors.append(comp)

    # Collect Active Nodes
    active_nodes = set()
    for comp in components:
        active_nodes.add(comp.node1)
        active_nodes.add(comp.node2)
        if hasattr(comp, "node3") and comp.node3:
            active_nodes.add(comp.node3)
    for q in bjts:
        active_nodes.add(q.node_collector)
        active_nodes.add(q.node_base)
        active_nodes.add(q.node_emitter)
    for s in sources_to_validate:
        pn = s.get("positive_node") or s.get("node_pos")
        nn = s.get("negative_node") or s.get("node_neg")
        if pn: active_nodes.add(pn)
        if nn: active_nodes.add(nn)

    node_list = [nid for nid in sorted(list(active_nodes)) if nid != ground_node_id]
    node_to_idx = {nid: idx for idx, nid in enumerate(node_list)}
    num_nodes = len(node_list)

    if num_nodes == 0:
        return {
            "status": "ERROR",
            "error_code": "NO_ACTIVE_NODES",
            "message": "Circuit contains no active non-ground nodes to solve.",
            "source": "nonlinear_transient_mna_simulation",
            "is_measured": False
        }

    # Transient Voltage Sources
    transient_v_sources: List[TransientSource] = []
    if source_config:
        src_dict = dict(source_config)
        pos = src_dict.get("positive_node") or src_dict.get("node_pos")
        neg = src_dict.get("negative_node") or src_dict.get("node_neg")
        if not pos and sources:
            pos = sources[0].get("positive_node") or sources[0].get("node_pos")
        if not neg and sources:
            neg = sources[0].get("negative_node") or sources[0].get("node_neg")
        src_dict["positive_node"] = pos
        src_dict["negative_node"] = neg
        transient_v_sources.append(TransientSource(src_dict))

        # Also preserve any DC power rail supplies connecting to different nodes
        for s in sources:
            s_pos = s.get("positive_node") or s.get("node_pos")
            s_neg = s.get("negative_node") or s.get("node_neg")
            if s_pos != pos or s_neg != neg:
                transient_v_sources.append(TransientSource(s))
    elif sources:
        for s in sources:
            transient_v_sources.append(TransientSource(s))
    elif not initial_conditions:
        default_pos = node_list[0] if node_list else "node_1"
        transient_v_sources.append(TransientSource({
            "id": "V1", "type": "step", "positive_node": default_pos, "negative_node": ground_node_id,
            "initial_value": 0.0, "final_value": 5.0, "step_time": 0.0
        }))

    num_vsrc = len(transient_v_sources)
    matrix_size = num_nodes + num_vsrc

    # Linear Conductance Base Assembly
    G_linear = np.zeros((matrix_size, matrix_size), dtype=np.float64)

    for r in resistors:
        ctype = r.type.lower()
        g = 1e3 if ctype in ["wire", "jumper"] else 1.0 / max(float(r.value), 1e-9)
        i1 = node_to_idx.get(r.node1, -1)
        i2 = node_to_idx.get(r.node2, -1)
        if i1 >= 0: G_linear[i1, i1] += g
        if i2 >= 0: G_linear[i2, i2] += g
        if i1 >= 0 and i2 >= 0:
            G_linear[i1, i2] -= g
            G_linear[i2, i1] -= g

    integration_method = method.lower()
    if integration_method not in ["backward_euler", "trapezoidal"]:
        integration_method = "backward_euler"

    cap_g: Dict[str, float] = {}
    for c in capacitors:
        c_val = float(c.value)
        g_c = (c_val / dt) if integration_method == "backward_euler" else (2.0 * c_val / dt)
        cap_g[c.id] = g_c
        i1 = node_to_idx.get(c.node1, -1)
        i2 = node_to_idx.get(c.node2, -1)
        if i1 >= 0: G_linear[i1, i1] += g_c
        if i2 >= 0: G_linear[i2, i2] += g_c
        if i1 >= 0 and i2 >= 0:
            G_linear[i1, i2] -= g_c
            G_linear[i2, i1] -= g_c

    ind_g: Dict[str, float] = {}
    for l in inductors:
        l_val = float(l.value)
        g_l = (dt / l_val) if integration_method == "backward_euler" else (dt / (2.0 * l_val))
        ind_g[l.id] = g_l
        i1 = node_to_idx.get(l.node1, -1)
        i2 = node_to_idx.get(l.node2, -1)
        if i1 >= 0: G_linear[i1, i1] += g_l
        if i2 >= 0: G_linear[i2, i2] += g_l
        if i1 >= 0 and i2 >= 0:
            G_linear[i1, i2] -= g_l
            G_linear[i2, i1] -= g_l

    # Voltage Source B Stamps
    for v_idx, vsrc in enumerate(transient_v_sources):
        row = num_nodes + v_idx
        i_pos = node_to_idx.get(vsrc.positive_node, -1)
        i_neg = node_to_idx.get(vsrc.negative_node, -1)
        if i_pos >= 0:
            G_linear[i_pos, row] += 1.0
            G_linear[row, i_pos] += 1.0
        if i_neg >= 0:
            G_linear[i_neg, row] -= 1.0
            G_linear[row, i_neg] -= 1.0

    # Initial Condition States
    init_conds = initial_conditions or {}
    cap_vc: Dict[str, float] = {c.id: float(init_conds.get(c.id, 0.0)) for c in capacitors}
    cap_ic: Dict[str, float] = {c.id: 0.0 for c in capacitors}
    ind_il: Dict[str, float] = {l.id: float(init_conds.get(l.id, 0.0)) for l in inductors}
    ind_vl: Dict[str, float] = {l.id: 0.0 for l in inductors}

    # Time points
    time_points = [t_start + i * dt for i in range(num_steps + 1)]

    node_voltage_trajectories: Dict[str, List[float]] = {nid: [] for nid in node_list}
    node_voltage_trajectories[ground_node_id] = []

    diode_v_trajectories: Dict[str, List[float]] = {d.id: [] for d in diodes}
    diode_i_trajectories: Dict[str, List[float]] = {d.id: [] for d in diodes}
    diode_g_trajectories: Dict[str, List[float]] = {d.id: [] for d in diodes}
    diode_state_trajectories: Dict[str, List[str]] = {d.id: [] for d in diodes}

    bjt_vbe_trajectories: Dict[str, List[float]] = {q.id: [] for q in bjts}
    bjt_vbc_trajectories: Dict[str, List[float]] = {q.id: [] for q in bjts}
    bjt_vce_trajectories: Dict[str, List[float]] = {q.id: [] for q in bjts}
    bjt_ib_trajectories: Dict[str, List[float]] = {q.id: [] for q in bjts}
    bjt_ic_trajectories: Dict[str, List[float]] = {q.id: [] for q in bjts}
    bjt_ie_trajectories: Dict[str, List[float]] = {q.id: [] for q in bjts}
    bjt_region_trajectories: Dict[str, List[str]] = {q.id: [] for q in bjts}

    cap_voltage_trajectories: Dict[str, List[float]] = {c.id: [] for c in capacitors}
    cap_current_trajectories: Dict[str, List[float]] = {c.id: [] for c in capacitors}
    ind_voltage_trajectories: Dict[str, List[float]] = {l.id: [] for l in inductors}
    ind_current_trajectories: Dict[str, List[float]] = {l.id: [] for l in inductors}
    res_voltage_trajectories: Dict[str, List[float]] = {r.id: [] for r in resistors}
    res_current_trajectories: Dict[str, List[float]] = {r.id: [] for r in resistors}

    total_newton_iterations = 0
    max_iter_observed = 0

    # Operating point cache across time steps
    vd_iter = {d.id: 0.0 for d in diodes}
    bjt_v_iter = {q.id: {"B": 0.0, "C": 0.0, "E": 0.0} for q in bjts}

    # 3. Main Multi-Step Time Marching Loop
    for step_idx, t in enumerate(time_points):
        Z_base = np.zeros((matrix_size, 1), dtype=np.float64)

        for c in capacitors:
            prev_vc = cap_vc[c.id]
            prev_ic = cap_ic[c.id]
            g_c = cap_g[c.id]
            i_eq = g_c * prev_vc if integration_method == "backward_euler" else (g_c * prev_vc + prev_ic)
            i1 = node_to_idx.get(c.node1, -1)
            i2 = node_to_idx.get(c.node2, -1)
            if i1 >= 0: Z_base[i1, 0] += i_eq
            if i2 >= 0: Z_base[i2, 0] -= i_eq

        for l in inductors:
            prev_il = ind_il[l.id]
            prev_vl = ind_vl[l.id]
            g_l = ind_g[l.id]
            i_eq = prev_il if integration_method == "backward_euler" else (prev_il + g_l * prev_vl)
            i1 = node_to_idx.get(l.node1, -1)
            i2 = node_to_idx.get(l.node2, -1)
            if i1 >= 0: Z_base[i1, 0] -= i_eq
            if i2 >= 0: Z_base[i2, 0] += i_eq

        for v_idx, vsrc in enumerate(transient_v_sources):
            row = num_nodes + v_idx
            Z_base[row, 0] = vsrc.evaluate(t)

        # 4. Damped Newton-Raphson Iteration Loop
        converged = False
        step_iterations = 0
        X_solved = None

        for n_iter in range(max_newton_iter):
            step_iterations += 1
            total_newton_iterations += 1

            A = np.copy(G_linear)
            Z = np.copy(Z_base)

            # Stamp Diodes
            for d in diodes:
                vd_k = vd_iter[d.id]
                i_d_k, g_d_k = d.evaluate_iv(vd_k)
                c_d_k = d.evaluate_capacitance(vd_k, g_d_k)
                
                if d.enable_dynamic_capacitance:
                    g_cap = (c_d_k / dt) if integration_method == "backward_euler" else (2.0 * c_d_k / dt)
                    i_eq_cap = g_cap * d.prev_vd if integration_method == "backward_euler" else (g_cap * d.prev_vd + d.prev_ic_cap)
                else:
                    g_cap = 0.0
                    i_eq_cap = 0.0

                g_total = g_d_k + g_cap
                i_eq_norton = (g_d_k * vd_k - i_d_k) + i_eq_cap

                ia = node_to_idx.get(d.node_anode, -1)
                ik = node_to_idx.get(d.node_cathode, -1)
                if ia >= 0: A[ia, ia] += g_total
                if ik >= 0: A[ik, ik] += g_total
                if ia >= 0 and ik >= 0:
                    A[ia, ik] -= g_total
                    A[ik, ia] -= g_total

                if ia >= 0: Z[ia, 0] += i_eq_norton
                if ik >= 0: Z[ik, 0] -= i_eq_norton

            # Stamp BJTs (Ebers-Moll Norton Companion Stamps)
            for q in bjts:
                vb_k = bjt_v_iter[q.id]["B"]
                vc_k = bjt_v_iter[q.id]["C"]
                ve_k = bjt_v_iter[q.id]["E"]

                currents, jacobian, reg = q.evaluate_terminals(vb_k, vc_k, ve_k)
                c_be, c_bc = q.evaluate_capacitances(vb_k, vc_k, ve_k)

                # Dynamic junction caps
                if q.enable_dynamic_capacitance:
                    g_be_cap = (c_be / dt) if integration_method == "backward_euler" else (2.0 * c_be / dt)
                    g_bc_cap = (c_bc / dt) if integration_method == "backward_euler" else (2.0 * c_bc / dt)
                    i_eq_be_cap = g_be_cap * q.prev_vbe if integration_method == "backward_euler" else (g_be_cap * q.prev_vbe + q.prev_ic_be_cap)
                    i_eq_bc_cap = g_bc_cap * q.prev_vbc if integration_method == "backward_euler" else (g_bc_cap * q.prev_vbc + q.prev_ic_bc_cap)
                else:
                    g_be_cap = 0.0
                    g_bc_cap = 0.0
                    i_eq_be_cap = 0.0
                    i_eq_bc_cap = 0.0

                ib = currents["IB"]
                ic = currents["IC"]
                ie = currents["IE"]

                v_vec = {"B": vb_k, "C": vc_k, "E": ve_k}
                i_vec = {"B": ib, "C": ic, "E": ie}

                node_map = {
                    "B": node_to_idx.get(q.node_base, -1),
                    "C": node_to_idx.get(q.node_collector, -1),
                    "E": node_to_idx.get(q.node_emitter, -1)
                }

                # Stamp conductances into A
                for t1 in ["B", "C", "E"]:
                    idx1 = node_map[t1]
                    if idx1 < 0:
                        continue
                    for t2 in ["B", "C", "E"]:
                        idx2 = node_map[t2]
                        if idx2 >= 0:
                            A[idx1, idx2] += jacobian[(t1, t2)]

                    # Norton current stamped into RHS Z
                    i_eq_t1 = sum(jacobian[(t1, t2)] * v_vec[t2] for t2 in ["B", "C", "E"]) - i_vec[t1]
                    Z[idx1, 0] += i_eq_t1

                # Stamp dynamic companion caps across B-E and B-C
                ib_idx = node_map["B"]
                ie_idx = node_map["E"]
                ic_idx = node_map["C"]

                if g_be_cap > 0:
                    if ib_idx >= 0: A[ib_idx, ib_idx] += g_be_cap
                    if ie_idx >= 0: A[ie_idx, ie_idx] += g_be_cap
                    if ib_idx >= 0 and ie_idx >= 0:
                        A[ib_idx, ie_idx] -= g_be_cap
                        A[ie_idx, ib_idx] -= g_be_cap
                    if ib_idx >= 0: Z[ib_idx, 0] += i_eq_be_cap
                    if ie_idx >= 0: Z[ie_idx, 0] -= i_eq_be_cap

                if g_bc_cap > 0:
                    if ib_idx >= 0: A[ib_idx, ib_idx] += g_bc_cap
                    if ic_idx >= 0: A[ic_idx, ic_idx] += g_bc_cap
                    if ib_idx >= 0 and ic_idx >= 0:
                        A[ib_idx, ic_idx] -= g_bc_cap
                        A[ic_idx, ib_idx] -= g_bc_cap
                    if ib_idx >= 0: Z[ib_idx, 0] += i_eq_bc_cap
                    if ic_idx >= 0: Z[ic_idx, 0] -= i_eq_bc_cap

            # Solve Linear System A * X = Z
            try:
                X_next = np.linalg.solve(A, Z)
            except np.linalg.LinAlgError:
                return {
                    "status": "ERROR",
                    "error_code": "NONLINEAR_MATRIX_SINGULAR",
                    "message": f"Nonlinear MNA Jacobian matrix is singular at timestep t={t}s, iteration {n_iter}.",
                    "source": "nonlinear_transient_mna_simulation",
                    "is_measured": False
                }

            if np.any(np.isnan(X_next)) or np.any(np.isinf(X_next)):
                return {
                    "status": "ERROR",
                    "error_code": "NUMERICAL_INSTABILITY",
                    "message": f"Newton-Raphson encountered NaN/Inf at timestep t={t}s.",
                    "source": "nonlinear_transient_mna_simulation",
                    "is_measured": False
                }

            # Check Diode Voltage Corrections with pnjlim and damping
            max_v_err = 0.0
            for d in diodes:
                ia = node_to_idx.get(d.node_anode, -1)
                ik = node_to_idx.get(d.node_cathode, -1)
                va = float(X_next[ia, 0]) if ia >= 0 else 0.0
                vk = float(X_next[ik, 0]) if ik >= 0 else 0.0
                vd_solved = va - vk
                
                vd_old = vd_iter[d.id]
                vd_lim = _pnjlim(vd_solved, vd_old, d.nVt)
                max_v_err = max(max_v_err, abs(vd_solved - vd_old))
                vd_iter[d.id] = vd_old + damping_factor * (vd_lim - vd_old)

            # Check BJT Voltage Corrections with pnjlim and damping
            for q in bjts:
                ib_idx = node_to_idx.get(q.node_base, -1)
                ic_idx = node_to_idx.get(q.node_collector, -1)
                ie_idx = node_to_idx.get(q.node_emitter, -1)

                vb_solved = float(X_next[ib_idx, 0]) if ib_idx >= 0 else 0.0
                vc_solved = float(X_next[ic_idx, 0]) if ic_idx >= 0 else 0.0
                ve_solved = float(X_next[ie_idx, 0]) if ie_idx >= 0 else 0.0

                vb_old = bjt_v_iter[q.id]["B"]
                vc_old = bjt_v_iter[q.id]["C"]
                ve_old = bjt_v_iter[q.id]["E"]

                if q.polarity == "NPN":
                    vbe_old = vb_old - ve_old
                    vbc_old = vb_old - vc_old
                    vbe_new = vb_solved - ve_solved
                    vbc_new = vb_solved - vc_solved

                    vbe_lim = _pnjlim(vbe_new, vbe_old, q.nVt_f)
                    vbc_lim = _pnjlim(vbc_new, vbc_old, q.nVt_r)

                    max_v_err = max(max_v_err, abs(vb_solved - vb_old), abs(vc_solved - vc_old), abs(ve_solved - ve_old))

                    ve_next = ve_solved
                    vb_next = ve_next + vbe_lim
                    vc_next = vb_next - vbc_lim
                else:
                    veb_old = ve_old - vb_old
                    vcb_old = vc_old - vb_old
                    veb_new = ve_solved - vb_solved
                    vcb_new = vc_solved - vb_solved

                    veb_lim = _pnjlim(veb_new, veb_old, q.nVt_f)
                    vcb_lim = _pnjlim(vcb_new, vcb_old, q.nVt_r)

                    max_v_err = max(max_v_err, abs(vb_solved - vb_old), abs(vc_solved - vc_old), abs(ve_solved - ve_old))

                    ve_next = ve_solved
                    vb_next = ve_next - veb_lim
                    vc_next = vb_next + vcb_lim

                bjt_v_iter[q.id]["B"] = vb_old + damping_factor * (vb_next - vb_old)
                bjt_v_iter[q.id]["C"] = vc_old + damping_factor * (vc_next - vc_old)
                bjt_v_iter[q.id]["E"] = ve_old + damping_factor * (ve_next - ve_old)

            X_solved = X_next
            if max_v_err <= v_tol:
                converged = True
                break

        max_iter_observed = max(max_iter_observed, step_iterations)

        if not converged:
            return {
                "status": "ERROR",
                "error_code": "NONLINEAR_CONVERGENCE_FAILED",
                "message": f"Newton-Raphson failed to converge within {max_newton_iter} iterations at t={t}s (max voltage error = {max_v_err:.6e} V).",
                "iteration_count": step_iterations,
                "voltage_error": max_v_err,
                "solver": {
                    "method": integration_method,
                    "converged": False,
                    "max_iterations_used": step_iterations
                },
                "source": "nonlinear_transient_mna_simulation",
                "is_measured": False,
                "physical_validation_status": "NOT_PERFORMED"
            }

        # 5. Commit Solved State at Timestep t
        current_node_voltages: Dict[str, float] = {ground_node_id: 0.0}
        for nid, idx in node_to_idx.items():
            current_node_voltages[nid] = float(X_solved[idx, 0])

        for nid in node_list:
            node_voltage_trajectories[nid].append(current_node_voltages[nid])
        node_voltage_trajectories[ground_node_id].append(0.0)

        # Update Diodes
        for d in diodes:
            va = current_node_voltages.get(d.node_anode, 0.0)
            vk = current_node_voltages.get(d.node_cathode, 0.0)
            vd_now = va - vk
            vd_iter[d.id] = vd_now
            i_d_now, g_d_now = d.evaluate_iv(vd_now)
            c_d_now = d.evaluate_capacitance(vd_now, g_d_now)
            
            if d.enable_dynamic_capacitance:
                g_cap = (c_d_now / dt) if integration_method == "backward_euler" else (2.0 * c_d_now / dt)
                i_cap = g_cap * (vd_now - d.prev_vd) if integration_method == "backward_euler" else (g_cap * (vd_now - d.prev_vd) - d.prev_ic_cap)
            else:
                i_cap = 0.0

            d.prev_vd = vd_now
            d.prev_ic_cap = i_cap
            d.v_d = vd_now
            d.i_d = i_d_now + i_cap
            d.g_d = g_d_now

            if vd_now > 0.4 and d.i_d > 1e-4:
                d_state = "FORWARD_CONDUCTING"
            elif vd_now < -0.05:
                d_state = "REVERSE_BIASED"
            else:
                d_state = "OFF"

            diode_v_trajectories[d.id].append(vd_now)
            diode_i_trajectories[d.id].append(d.i_d)
            diode_g_trajectories[d.id].append(g_d_now)
            diode_state_trajectories[d.id].append(d_state)

        # Update BJTs
        for q in bjts:
            vb = current_node_voltages.get(q.node_base, 0.0)
            vc = current_node_voltages.get(q.node_collector, 0.0)
            ve = current_node_voltages.get(q.node_emitter, 0.0)

            bjt_v_iter[q.id]["B"] = vb
            bjt_v_iter[q.id]["C"] = vc
            bjt_v_iter[q.id]["E"] = ve

            currents, _, region = q.evaluate_terminals(vb, vc, ve)
            c_be, c_bc = q.evaluate_capacitances(vb, vc, ve)

            vbe_now = vb - ve
            vbc_now = vb - vc
            vce_now = vc - ve

            if q.enable_dynamic_capacitance:
                g_be_cap = (c_be / dt) if integration_method == "backward_euler" else (2.0 * c_be / dt)
                g_bc_cap = (c_bc / dt) if integration_method == "backward_euler" else (2.0 * c_bc / dt)
                i_be_cap = g_be_cap * (vbe_now - q.prev_vbe) if integration_method == "backward_euler" else (g_be_cap * (vbe_now - q.prev_vbe) - q.prev_ic_be_cap)
                i_bc_cap = g_bc_cap * (vbc_now - q.prev_vbc) if integration_method == "backward_euler" else (g_bc_cap * (vbc_now - q.prev_vbc) - q.prev_ic_bc_cap)
            else:
                i_be_cap = 0.0
                i_bc_cap = 0.0

            q.prev_vbe = vbe_now
            q.prev_vbc = vbc_now
            q.prev_ic_be_cap = i_be_cap
            q.prev_ic_bc_cap = i_bc_cap

            q.v_be = vbe_now
            q.v_bc = vbc_now
            q.v_ce = vce_now
            q.i_b = currents["IB"] + i_be_cap + i_bc_cap
            q.i_c = currents["IC"] - i_bc_cap
            q.i_e = currents["IE"] - i_be_cap
            q.region = region

            bjt_vbe_trajectories[q.id].append(vbe_now)
            bjt_vbc_trajectories[q.id].append(vbc_now)
            bjt_vce_trajectories[q.id].append(vce_now)
            bjt_ib_trajectories[q.id].append(q.i_b)
            bjt_ic_trajectories[q.id].append(q.i_c)
            bjt_ie_trajectories[q.id].append(q.i_e)
            bjt_region_trajectories[q.id].append(region)

        # Update Capacitors
        for c in capacitors:
            v1 = current_node_voltages.get(c.node1, 0.0)
            v2 = current_node_voltages.get(c.node2, 0.0)
            vc_now = v1 - v2
            g_c = cap_g[c.id]
            prev_vc = cap_vc[c.id]
            prev_ic = cap_ic[c.id]
            ic_now = g_c * (vc_now - prev_vc) if integration_method == "backward_euler" else (g_c * (vc_now - prev_vc) - prev_ic)
            cap_vc[c.id] = vc_now
            cap_ic[c.id] = ic_now
            cap_voltage_trajectories[c.id].append(vc_now)
            cap_current_trajectories[c.id].append(ic_now)

        # Update Inductors
        for l in inductors:
            v1 = current_node_voltages.get(l.node1, 0.0)
            v2 = current_node_voltages.get(l.node2, 0.0)
            vl_now = v1 - v2
            g_l = ind_g[l.id]
            prev_il = ind_il[l.id]
            prev_vl = ind_vl[l.id]
            il_now = prev_il + g_l * vl_now if integration_method == "backward_euler" else (prev_il + g_l * (vl_now + prev_vl))
            ind_vl[l.id] = vl_now
            ind_il[l.id] = il_now
            ind_voltage_trajectories[l.id].append(vl_now)
            ind_current_trajectories[l.id].append(il_now)

        # Update Resistors
        for r in resistors:
            v1 = current_node_voltages.get(r.node1, 0.0)
            v2 = current_node_voltages.get(r.node2, 0.0)
            vr_now = v1 - v2
            r_val = max(float(r.value), 1e-6) if r.type.lower() not in ["wire", "jumper"] else 1e-3
            res_voltage_trajectories[r.id].append(vr_now)
            res_current_trajectories[r.id].append(vr_now / r_val)

    # 6. Format Structured Signals Response
    signals: List[Dict[str, Any]] = []

    # Node voltages
    for nid in sorted(node_voltage_trajectories.keys()):
        signals.append({
            "name": f"V({nid})",
            "component_id": nid,
            "type": "voltage",
            "unit": "V",
            "values": [round(val, 6) for val in node_voltage_trajectories[nid]]
        })

    # Diode signals
    for d in diodes:
        signals.append({
            "name": f"V({d.id})", "component_id": d.id, "type": "voltage", "unit": "V",
            "values": [round(val, 6) for val in diode_v_trajectories[d.id]]
        })
        signals.append({
            "name": f"I({d.id})", "component_id": d.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in diode_i_trajectories[d.id]]
        })

    # BJT signals
    for q in bjts:
        signals.append({
            "name": f"V_BE({q.id})", "component_id": q.id, "type": "voltage", "unit": "V",
            "values": [round(val, 6) for val in bjt_vbe_trajectories[q.id]]
        })
        signals.append({
            "name": f"V_CE({q.id})", "component_id": q.id, "type": "voltage", "unit": "V",
            "values": [round(val, 6) for val in bjt_vce_trajectories[q.id]]
        })
        signals.append({
            "name": f"I_B({q.id})", "component_id": q.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in bjt_ib_trajectories[q.id]]
        })
        signals.append({
            "name": f"I_C({q.id})", "component_id": q.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in bjt_ic_trajectories[q.id]]
        })
        signals.append({
            "name": f"I_E({q.id})", "component_id": q.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in bjt_ie_trajectories[q.id]]
        })

    # Capacitor signals
    for c in capacitors:
        signals.append({
            "name": f"V({c.id})", "component_id": c.id, "type": "voltage", "unit": "V",
            "values": [round(val, 6) for val in cap_voltage_trajectories[c.id]]
        })
        signals.append({
            "name": f"I({c.id})", "component_id": c.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in cap_current_trajectories[c.id]]
        })

    # Inductor signals
    for l in inductors:
        signals.append({
            "name": f"I({l.id})", "component_id": l.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in ind_current_trajectories[l.id]]
        })

    # Resistor signals
    for r in resistors:
        signals.append({
            "name": f"V({r.id})", "component_id": r.id, "type": "voltage", "unit": "V",
            "values": [round(val, 6) for val in res_voltage_trajectories[r.id]]
        })
        signals.append({
            "name": f"I({r.id})", "component_id": r.id, "type": "current", "unit": "A",
            "values": [round(val, 8) for val in res_current_trajectories[r.id]]
        })

    # Device States Summary
    device_states = []
    for d in diodes:
        final_state = diode_state_trajectories[d.id][-1]
        device_states.append({
            "device_id": d.id,
            "model": d.id,
            "voltage": round(d.v_d, 6),
            "current": round(d.i_d, 8),
            "conductance": round(d.g_d, 6),
            "dynamic_resistance": round(1.0 / max(d.g_d, 1e-9), 2),
            "state": final_state,
            "states_timeline": diode_state_trajectories[d.id]
        })

    bjt_states = []
    for q in bjts:
        final_reg = bjt_region_trajectories[q.id][-1]
        bjt_states.append({
            "device_id": q.id,
            "polarity": q.polarity,
            "vbe": round(q.v_be, 6),
            "vbc": round(q.v_bc, 6),
            "vce": round(q.v_ce, 6),
            "ib": round(q.i_b, 8),
            "ic": round(q.i_c, 8),
            "ie": round(q.i_e, 8),
            "beta_forced": round(abs(q.i_c) / max(abs(q.i_b), 1e-12), 2),
            "region": final_reg,
            "regions_timeline": bjt_region_trajectories[q.id]
        })

    return {
        "status": "VERIFIED",
        "time": time_points,
        "signals": signals,
        "device_states": device_states + bjt_states,
        "bjt_states": bjt_states,
        "node_voltages": {k: [round(v, 6) for v in vals] for k, vals in node_voltage_trajectories.items()},
        "solver": {
            "method": f"newton_raphson_{integration_method}",
            "t_start": t_start,
            "t_stop": t_stop,
            "dt": dt,
            "num_points": len(time_points),
            "total_newton_iterations": total_newton_iterations,
            "max_iterations_used": max_iter_observed,
            "converged": True
        },
        "source": "nonlinear_transient_mna_simulation",
        "is_measured": False,
        "physical_validation_status": "NOT_PERFORMED"
    }
