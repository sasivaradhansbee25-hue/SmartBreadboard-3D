import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Cpu, 
  Home, 
  Scan, 
  Activity, 
  Box, 
  Calculator, 
  FileCheck2, 
  GraduationCap 
} from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/scanner', label: 'Scanner', icon: Scan },
    { path: '/analysis', label: 'Analysis', icon: Activity },
    { path: '/simulator', label: 'Simulator', icon: Box },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/results', label: 'Results', icon: FileCheck2 },
    { path: '/learn', label: 'Learn', icon: GraduationCap }
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="brand-logo">
          <div className="logo-icon">
            <Cpu size={22} />
          </div>
          <div>
            <span>SmartBreadboard</span>
            <span style={{ color: 'var(--accent-cyan)' }}> 3D</span>
            <span className="status-dot" title="System Online"></span>
          </div>
        </NavLink>

        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item-link ${isActive ? 'active' : ''}`
                    }
                    end={item.path === '/'}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <span className="version-badge">Phase 1 v0.1.0</span>
        </div>
      </div>
    </header>
  );
}
