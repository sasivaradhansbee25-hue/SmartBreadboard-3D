import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { holeTo3DPos } from '../utils/breadboard3DCoords';

export default function Breadboard3DCanvas({ circuit }) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const [selectedComp, setSelectedComp] = useState(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    const width = container.clientWidth || 900;
    const height = 520;

    // =========================================================
    // SCENE
    // =========================================================

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040711);

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );

    camera.position.set(0, 25, 25);
    camera.lookAt(0, 0, 0);

    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(renderer.domElement);

    // =========================================================
    // ORBIT CONTROLS
    // =========================================================

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.minDistance = 8;
    controls.maxDistance = 55;

    controls.maxPolarAngle = Math.PI / 2 - 0.03;

    controls.target.set(0, 0, 0);

    controlsRef.current = controls;

    // =========================================================
    // LIGHTING
    // =========================================================

    scene.add(
      new THREE.AmbientLight(
        0xffffff,
        0.9
      )
    );

    const keyLight =
      new THREE.DirectionalLight(
        0xffffff,
        1.4
      );

    keyLight.position.set(
      8,
      25,
      12
    );

    keyLight.castShadow = true;

    scene.add(keyLight);

    const fillLight =
      new THREE.DirectionalLight(
        0x88aaff,
        0.6
      );

    fillLight.position.set(
      -15,
      12,
      -10
    );

    scene.add(fillLight);

    // =========================================================
    // BREADBOARD
    // =========================================================

    const boardGroup =
      new THREE.Group();

    // Main body

    const boardGeometry =
      new THREE.BoxGeometry(
        26,
        1.2,
        10
      );

    const boardMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.42,
        metalness: 0.05
      });

    const board =
      new THREE.Mesh(
        boardGeometry,
        boardMaterial
      );

    board.position.y = 0;

    board.receiveShadow = true;

    boardGroup.add(board);

    // =========================================================
    // CENTER CHANNEL
    // =========================================================

    const channelGeometry =
      new THREE.BoxGeometry(
        25.6,
        0.16,
        1.1
      );

    const channelMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.8
      });

    const channel =
      new THREE.Mesh(
        channelGeometry,
        channelMaterial
      );

    channel.position.set(
      0,
      0.62,
      0
    );

    boardGroup.add(channel);

    // =========================================================
    // POWER RAILS
    // =========================================================

    const redMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xef4444
      });

    const blueMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x2563eb
      });

    const railGeometry =
      new THREE.BoxGeometry(
        25,
        0.05,
        0.12
      );

    const redTop =
      new THREE.Mesh(
        railGeometry,
        redMaterial
      );

    redTop.position.set(
      0,
      0.63,
      -4.2
    );

    const blueTop =
      new THREE.Mesh(
        railGeometry,
        blueMaterial
      );

    blueTop.position.set(
      0,
      0.63,
      -3.8
    );

    const redBottom =
      new THREE.Mesh(
        railGeometry,
        redMaterial
      );

    redBottom.position.set(
      0,
      0.63,
      4.2
    );

    const blueBottom =
      new THREE.Mesh(
        railGeometry,
        blueMaterial
      );

    blueBottom.position.set(
      0,
      0.63,
      3.8
    );

    boardGroup.add(
      redTop,
      blueTop,
      redBottom,
      blueBottom
    );

    // =========================================================
    // 830 HOLES
    // =========================================================

    const holeGeometry =
      new THREE.CylinderGeometry(
        0.075,
        0.075,
        0.08,
        12
      );

    const holeMaterial =
      new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.9
      });

    // Main 63 x 10 grid

    for (let col = 1; col <= 63; col++) {

      const x =
        -12.4 +
        (col - 1) * 0.4;

      for (
        let rowIndex = 0;
        rowIndex < 10;
        rowIndex++
      ) {

        const row =
          String.fromCharCode(
            65 + rowIndex
          );

        const zMap = {
          A: -2.8,
          B: -2.3,
          C: -1.8,
          D: -1.3,
          E: -0.8,
          F: 0.8,
          G: 1.3,
          H: 1.8,
          I: 2.3,
          J: 2.8
        };

        const hole =
          new THREE.Mesh(
            holeGeometry,
            holeMaterial
          );

        hole.position.set(
          x,
          0.63,
          zMap[row]
        );

        boardGroup.add(hole);
      }
    }

    // Power rail holes

    for (let col = 1; col <= 50; col++) {

      const x =
        -12.4 +
        (col - 1) * 0.48;

      const positions = [
        -4.2,
        -3.8,
        3.8,
        4.2
      ];

      positions.forEach((z) => {

        const hole =
          new THREE.Mesh(
            holeGeometry,
            holeMaterial
          );

        hole.position.set(
          x,
          0.63,
          z
        );

        boardGroup.add(hole);
      });
    }

    scene.add(boardGroup);

    // =========================================================
    // COMPONENT CLICKABLE OBJECTS
    // =========================================================

    const clickableObjects = [];

    // =========================================================
    // MATERIAL HELPERS
    // =========================================================

    const metalMaterial =
      new THREE.MeshStandardMaterial({
        color: 0xb8c2cc,
        metalness: 0.85,
        roughness: 0.25
      });

    // =========================================================
    // RESISTOR
    // =========================================================

    function createResistor(
      component,
      p1,
      p2
    ) {

      const group =
        new THREE.Group();

      const body =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.42,
            0.42,
            1.8,
            24
          ),
          new THREE.MeshStandardMaterial({
            color: 0xd6a06d,
            roughness: 0.45
          })
        );

      body.rotation.z =
        Math.PI / 2;

      body.castShadow = true;

      group.add(body);

      // Color bands

      const bandColors = [
        0x78350f,
        0x000000,
        0xdc2626,
        0xeab308
      ];

      [-0.6, -0.2, 0.2, 0.6]
        .forEach((pos, index) => {

          const band =
            new THREE.Mesh(
              new THREE.CylinderGeometry(
                0.44,
                0.44,
                0.14,
                24
              ),
              new THREE.MeshBasicMaterial({
                color:
                  bandColors[index]
              })
            );

          band.rotation.z =
            Math.PI / 2;

          band.position.x = pos;

          group.add(band);
        });

      // Leads

      const leadLength = 1.0;

      const lead1 =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.055,
            0.055,
            leadLength,
            10
          ),
          metalMaterial
        );

      const lead2 =
        lead1.clone();

      lead1.position.x = -1.35;
      lead2.position.x = 1.35;

      group.add(
        lead1,
        lead2
      );

      positionComponent(
        group,
        p1,
        p2
      );

      body.userData = {
        name:
          component.designator ||
          component.id ||
          'Resistor',
        type: 'resistor',
        value:
          component.user_override_value ||
          component.detected_value ||
          component.value ||
          'Unknown'
      };

      clickableObjects.push(body);

      scene.add(group);
    }

    // =========================================================
    // LED
    // =========================================================

    function createLED(
      component,
      p1,
      p2
    ) {

      const group =
        new THREE.Group();

      const color =
        getLEDColor(
          component
        );

      const body =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.45,
            0.38,
            0.65,
            24
          ),
          new THREE.MeshPhysicalMaterial({
            color,
            transparent: true,
            opacity: 0.88,
            roughness: 0.12,
            transmission: 0.25
          })
        );

      body.position.y = 0.4;

      group.add(body);

      const dome =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            0.45,
            24,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
          ),
          body.material
        );

      dome.position.y = 0.72;

      group.add(dome);

      // LED glow

      const glow =
        new THREE.PointLight(
          color,
          2.2,
          4
        );

      glow.position.y = 0.6;

      group.add(glow);

      // Leads

      const lead1 =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.05,
            0.05,
            1.2,
            10
          ),
          metalMaterial
        );

      const lead2 =
        lead1.clone();

      lead1.position.x = -0.16;
      lead2.position.x = 0.16;

      lead1.position.y = -0.45;
      lead2.position.y = -0.45;

      group.add(
        lead1,
        lead2
      );

      positionComponent(
        group,
        p1,
        p2
      );

      body.userData = {
        name:
          component.designator ||
          component.id ||
          'LED',
        type: 'led',
        value:
          component.value ||
          component.detected_value ||
          'LED'
      };

      clickableObjects.push(body);

      scene.add(group);
    }

    // =========================================================
    // CAPACITOR
    // =========================================================

    function createCapacitor(
      component,
      p1,
      p2
    ) {

      const group =
        new THREE.Group();

      const body =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.48,
            0.48,
            1.15,
            24
          ),
          new THREE.MeshStandardMaterial({
            color: 0x1e3a8a,
            roughness: 0.35
          })
        );

      body.position.y = 0.7;

      group.add(body);

      // Stripe

      const stripe =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.08,
            1.0,
            0.98
          ),
          new THREE.MeshBasicMaterial({
            color: 0xe5e7eb
          })
        );

      stripe.position.set(
        -0.28,
        0.7,
        0
      );

      group.add(stripe);

      // Leads

      const lead1 =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.055,
            0.055,
            1.1,
            10
          ),
          metalMaterial
        );

      const lead2 =
        lead1.clone();

      lead1.position.x = -0.18;
      lead2.position.x = 0.18;

      lead1.position.y = -0.35;
      lead2.position.y = -0.35;

      group.add(
        lead1,
        lead2
      );

      positionComponent(
        group,
        p1,
        p2
      );

      body.userData = {
        name:
          component.designator ||
          component.id ||
          'Capacitor',
        type: 'capacitor',
        value:
          component.user_override_value ||
          component.detected_value ||
          component.value ||
          'Unknown'
      };

      clickableObjects.push(body);

      scene.add(group);
    }

    // =========================================================
    // DIODE
    // =========================================================

    function createDiode(
      component,
      p1,
      p2
    ) {

      const group =
        new THREE.Group();

      const body =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.22,
            0.22,
            1.45,
            20
          ),
          new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.3
          })
        );

      body.rotation.z =
        Math.PI / 2;

      group.add(body);

      // Cathode band

      const band =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.24,
            0.24,
            0.16,
            20
          ),
          new THREE.MeshBasicMaterial({
            color: 0xf8fafc
          })
        );

      band.rotation.z =
        Math.PI / 2;

      band.position.x = 0.45;

      group.add(band);

      const lead1 =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.045,
            0.045,
            0.9,
            8
          ),
          metalMaterial
        );

      const lead2 =
        lead1.clone();

      lead1.position.x = -1.05;
      lead2.position.x = 1.05;

      group.add(
        lead1,
        lead2
      );

      positionComponent(
        group,
        p1,
        p2
      );

      body.userData = {
        name:
          component.designator ||
          component.id ||
          'Diode',
        type: 'diode_rectifier',
        value:
          component.value ||
          'Diode'
      };

      clickableObjects.push(body);

      scene.add(group);
    }

    // =========================================================
    // IC CHIP
    // =========================================================

    function createIC(
      component,
      p1,
      p2
    ) {

      const group =
        new THREE.Group();

      const body =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            1.7,
            0.45,
            1.1
          ),
          new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.3
          })
        );

      body.position.y = 0.75;

      group.add(body);

      // IC notch

      const notch =
        new THREE.Mesh(
          new THREE.TorusGeometry(
            0.16,
            0.05,
            8,
            16,
            Math.PI
          ),
          new THREE.MeshBasicMaterial({
            color: 0x64748b
          })
        );

      notch.rotation.x =
        Math.PI / 2;

      notch.position.set(
        0,
        0.99,
        -0.55
      );

      group.add(notch);

      // Pins

      for (
        let i = 0;
        i < 4;
        i++
      ) {

        const pin1 =
          new THREE.Mesh(
            new THREE.BoxGeometry(
              0.08,
              0.5,
              0.08
            ),
            metalMaterial
          );

        const pin2 =
          pin1.clone();

        pin1.position.set(
          -0.55 + i * 0.36,
          0.25,
          -0.72
        );

        pin2.position.set(
          -0.55 + i * 0.36,
          0.25,
          0.72
        );

        group.add(
          pin1,
          pin2
        );
      }

      positionComponent(
        group,
        p1,
        p2
      );

      body.userData = {
        name:
          component.designator ||
          component.id ||
          'IC',
        type: 'ic_chip',
        value:
          component.value ||
          'IC'
      };

      clickableObjects.push(body);

      scene.add(group);
    }

    // =========================================================
    // JUMPER WIRE
    // =========================================================

    function createWire(
      component,
      p1,
      p2
    ) {

      const start =
        new THREE.Vector3(
          p1.x,
          0.72,
          p1.z
        );

      const end =
        new THREE.Vector3(
          p2.x,
          0.72,
          p2.z
        );

      const midpoint =
        new THREE.Vector3(
          (start.x + end.x) / 2,
          2.0,
          (start.z + end.z) / 2
        );

      const curve =
        new THREE.QuadraticBezierCurve3(
          start,
          midpoint,
          end
        );

      const geometry =
        new THREE.TubeGeometry(
          curve,
          24,
          0.09,
          8,
          false
        );

      const material =
        new THREE.MeshStandardMaterial({
          color:
            getWireColor(component),
          roughness: 0.35
        });

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        );

      mesh.castShadow = true;

      mesh.userData = {
        name:
          component.designator ||
          component.id ||
          'Wire',
        type: 'wire',
        value: 'wire'
      };

      clickableObjects.push(mesh);

      scene.add(mesh);
    }

    // =========================================================
    // POSITION COMPONENT
    // =========================================================

    function positionComponent(
      group,
      p1,
      p2
    ) {

      const midpoint =
        new THREE.Vector3(
          (p1.x + p2.x) / 2,
          1.2,
          (p1.z + p2.z) / 2
        );

      group.position.copy(
        midpoint
      );

      const dx =
        p2.x - p1.x;

      const dz =
        p2.z - p1.z;

      group.rotation.y =
        Math.atan2(dz, dx);
    }

    // =========================================================
    // COLOR HELPERS
    // =========================================================

    function getLEDColor(component) {

      const text =
        JSON.stringify(component)
          .toLowerCase();

      if (text.includes('green')) {
        return 0x22c55e;
      }

      if (text.includes('blue')) {
        return 0x3b82f6;
      }

      if (text.includes('yellow')) {
        return 0xfacc15;
      }

      return 0xef4444;
    }

    function getWireColor(component) {

      const text =
        JSON.stringify(component)
          .toLowerCase();

      if (text.includes('black')) {
        return 0x111827;
      }

      if (text.includes('blue')) {
        return 0x2563eb;
      }

      if (text.includes('green')) {
        return 0x16a34a;
      }

      if (text.includes('yellow')) {
        return 0xfacc15;
      }

      return 0xef4444;
    }

    // =========================================================
    // COMPONENT DATA NORMALIZATION
    // =========================================================

    function getHolePair(component) {

      const hole1 =
        component.hole1 ||
        component.node1_hole ||
        component.lead1_hole ||
        component.start_hole ||
        component.from_hole ||
        component.node1?.hole;

      const hole2 =
        component.hole2 ||
        component.node2_hole ||
        component.lead2_hole ||
        component.end_hole ||
        component.to_hole ||
        component.node2?.hole;

      return {
        hole1,
        hole2
      };
    }

    // =========================================================
    // RENDER ACTUAL CIRCUIT COMPONENTS
    // =========================================================

    const components =
      Array.isArray(circuit?.components)
        ? circuit.components
        : [];

    console.log(
      '[3D] Circuit:',
      circuit
    );

    console.log(
      '[3D] Components:',
      components
    );

    components.forEach(
      (component, index) => {

        const {
          hole1,
          hole2
        } =
          getHolePair(component);

        if (!hole1 || !hole2) {

          console.warn(
            `[3D] Component ${index} has no hole mapping`,
            component
          );

          return;
        }

        const p1 =
          holeTo3DPos(hole1);

        const p2 =
          holeTo3DPos(hole2);

        const type =
          String(
            component.type ||
            component.class ||
            component.name ||
            ''
          )
            .toLowerCase();

        console.log(
          `[3D] Rendering ${type}`,
          hole1,
          hole2,
          p1,
          p2
        );

        if (
          type.includes('resistor')
        ) {

          createResistor(
            component,
            p1,
            p2
          );

        } else if (
          type.includes('led')
        ) {

          createLED(
            component,
            p1,
            p2
          );

        } else if (
          type.includes('capacitor')
        ) {

          createCapacitor(
            component,
            p1,
            p2
          );

        } else if (
          type.includes('diode')
        ) {

          createDiode(
            component,
            p1,
            p2
          );

        } else if (
          type.includes('ic')
        ) {

          createIC(
            component,
            p1,
            p2
          );

        } else if (
          type.includes('wire') ||
          type.includes('jumper')
        ) {

          createWire(
            component,
            p1,
            p2
          );

        } else {

          console.warn(
            '[3D] Unknown component type:',
            component.type
          );
        }
      }
    );

    // =========================================================
    // RAYCASTING
    // =========================================================

    const raycaster =
      new THREE.Raycaster();

    const mouse =
      new THREE.Vector2();

    const handlePointerDown =
      (event) => {

        const rect =
          renderer.domElement
            .getBoundingClientRect();

        mouse.x =
          ((event.clientX - rect.left) /
            rect.width) *
          2 -
          1;

        mouse.y =
          -(
            (event.clientY - rect.top) /
            rect.height
          ) *
          2 +
          1;

        raycaster.setFromCamera(
          mouse,
          camera
        );

        const intersects =
          raycaster.intersectObjects(
            clickableObjects,
            true
          );

        if (
          intersects.length > 0
        ) {

          setSelectedComp(
            intersects[0].object.userData
          );
        }
      };

    renderer.domElement.addEventListener(
      'pointerdown',
      handlePointerDown
    );

    // =========================================================
    // ANIMATION
    // =========================================================

    let animationFrameId;

    const animate = () => {

      animationFrameId =
        requestAnimationFrame(
          animate
        );

      controls.update();

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // =========================================================
    // RESIZE
    // =========================================================

    const handleResize = () => {

      const newWidth =
        container.clientWidth ||
        900;

      camera.aspect =
        newWidth / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        newWidth,
        height
      );
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {

      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        'resize',
        handleResize
      );

      renderer.domElement
        .removeEventListener(
          'pointerdown',
          handlePointerDown
        );

      controls.dispose();

      scene.traverse(
        (object) => {

          if (object.geometry) {
            object.geometry.dispose();
          }

          if (object.material) {

            if (
              Array.isArray(
                object.material
              )
            ) {

              object.material.forEach(
                (material) =>
                  material.dispose()
              );

            } else {

              object.material.dispose();
            }
          }
        }
      );

      renderer.dispose();
    };

  }, [circuit]);

  // ===========================================================
  // CAMERA PRESETS
  // ===========================================================

  const setCameraPreset =
    (type) => {

      if (
        !cameraRef.current ||
        !controlsRef.current
      ) {
        return;
      }

      const camera =
        cameraRef.current;

      const controls =
        controlsRef.current;

      if (type === 'top') {

        camera.position.set(
          0,
          28,
          0.01
        );

      } else if (type === 'iso') {

        camera.position.set(
          0,
          25,
          25
        );

      } else if (type === 'side') {

        camera.position.set(
          26,
          8,
          0
        );
      }

      controls.target.set(
        0,
        0,
        0
      );

      controls.update();
    };

  // ===========================================================
  // UI
  // ===========================================================

  const componentCount =
    Array.isArray(circuit?.components)
      ? circuit.components.length
      : 0;

  return (
    <div
      style={{
        position: 'relative',
        background: '#040711',
        borderRadius: '12px',
        border:
          '1px solid var(--border-color)',
        overflow: 'hidden'
      }}
    >

      {/* Toolbar */}

      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 10,
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >

        <div
          style={{
            display: 'flex',
            gap: '8px',
            pointerEvents: 'auto'
          }}
        >

          <span className="mock-badge">
            source:{' '}
            {circuit?.source ||
              'mock'}
          </span>

          <span className="code-pill">
            3D Components:{' '}
            {componentCount}
          </span>

        </div>

        <div
          style={{
            display: 'flex',
            gap: '6px',
            pointerEvents: 'auto'
          }}
        >

          <button
            onClick={() =>
              setCameraPreset(
                'top'
              )
            }
            className="btn btn-secondary"
          >
            Top 2D
          </button>

          <button
            onClick={() =>
              setCameraPreset(
                'iso'
              )
            }
            className="btn btn-secondary"
          >
            Isometric 3D
          </button>

          <button
            onClick={() =>
              setCameraPreset(
                'side'
              )
            }
            className="btn btn-secondary"
          >
            Side View
          </button>

        </div>

      </div>

      {/* WebGL */}

      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '520px',
          cursor: 'grab'
        }}
      />

      {/* Inspector */}

      <div
        style={{
          padding:
            '0.75rem 1rem',
          background:
            'rgba(8,12,20,0.95)',
          borderTop:
            '1px solid var(--border-color)',
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center'
        }}
      >

        <div>

          {selectedComp ? (

            <span
              style={{
                fontSize:
                  '0.85rem',
                fontWeight: '700',
                color:
                  'var(--accent-cyan)'
              }}
            >
              {selectedComp.name}
              {' — '}
              {selectedComp.type}
              {' — '}
              {selectedComp.value}
            </span>

          ) : (

            <span
              style={{
                fontSize:
                  '0.8rem',
                color:
                  'var(--text-muted)'
              }}
            >
              Click a component
              to inspect it.
            </span>

          )}

        </div>

        <span className="code-pill">
          Drag: Rotate |
          Scroll: Zoom
        </span>

      </div>

    </div>
  );
}