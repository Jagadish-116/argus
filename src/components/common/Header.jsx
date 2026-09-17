import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  ChevronDown, 
  BarChart2, 
  Home, 
  Building2, 
  Layers, 
  EyeOff, 
  GitMerge, 
  FileCheck, 
  ShieldAlert, 
  CheckCircle2,
  Radio,
  Check
} from 'lucide-react';
import { FEATURE_DEFINITIONS, ENTITY_NAMES, ENTITY_SECTORS } from '../../constants/rules';

const ICON_MAP = {
  ShieldAlert,
  EyeOff,
  GitMerge,
  Layers,
  BarChart3: BarChart2,
  FileCheck,
};

export const Header = ({
  activeView,
  selectedEntity,
  onNavigate,
  onSelectEntity,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [entityMenuOpen, setEntityMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const entityMenuRef = useRef(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (entityMenuRef.current && !entityMenuRef.current.contains(e.target)) {
        setEntityMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setEntityMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isFeatureActive = FEATURE_DEFINITIONS.some(f => f.id === activeView);

  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-white/[0.08] shadow-2xl backdrop-blur-xl bg-[#090E1A]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* BRANDING */}
          <div 
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
            title="Return to ARGUS Command Center"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-700/35 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-extrabold text-sm tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
                A
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090E1A] status-dot-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent group-hover:to-cyan-200 transition-colors">
                  ARGUS
                </span>
                <span className="text-slate-600 font-light hidden sm:inline">|</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest hidden sm:inline">
                  SOC Behavioural Assurance
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans tracking-tight hidden lg:block">
                Supervisory Governance & Operational Audit Platform
              </div>
            </div>
          </div>

          {/* TASKBAR NAVIGATION CONTROLS */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* FEATURES DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center space-x-1.5 shadow-sm ${
                  dropdownOpen || isFeatureActive
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "bg-[#111827]/80 hover:bg-[#1A243B] text-slate-300 hover:text-white border-white/[0.08]"
                }`}
                aria-expanded={dropdownOpen}
              >
                <Layers size={13} className={isFeatureActive ? "text-cyan-400" : "text-slate-400"} />
                <span>Features</span>
                <ChevronDown size={12} className={`transform transition-transform duration-200 text-slate-400 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 glass-panel border border-white/[0.12] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 bg-[#0E1626]/95">
                  <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.08] flex items-center justify-between">
                    <span>Six Core Capabilities</span>
                    <span className="text-[9px] text-cyan-400 font-bold">ASSURANCE</span>
                  </div>
                  <div className="py-1">
                    {FEATURE_DEFINITIONS.map((feature) => {
                      const isActive = activeView === feature.id;
                      const FeatIcon = ICON_MAP[feature.iconName] || Shield;
                      return (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => {
                            onNavigate(feature.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-950/80 to-transparent text-cyan-300 font-semibold border-l-2 border-cyan-400"
                              : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                              isActive 
                                ? "bg-cyan-900/50 border-cyan-500/50 text-cyan-300" 
                                : "bg-slate-800/60 border-slate-700 text-slate-400"
                            }`}>
                              <FeatIcon size={12} />
                            </div>
                            <div className="truncate">
                              <div className="font-semibold text-xs leading-tight">{feature.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{feature.tagline}</div>
                            </div>
                          </div>
                          {isActive && (
                            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-700/60 ml-2">
                              ACTIVE
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ASSESSMENT GRAPH BUTTON */}
            <button
              type="button"
              onClick={() => onNavigate("assessment-graph")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center space-x-1.5 shadow-sm ${
                activeView === "assessment-graph"
                  ? "bg-cyan-950/90 text-cyan-300 border-cyan-500/70 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-[#111827]/80 hover:bg-[#1A243B] text-slate-300 hover:text-white border-white/[0.08]"
              }`}
              title="Visual overview of evidence-backed supervisory indicators"
            >
              <BarChart2 size={13} className={activeView === "assessment-graph" ? "text-cyan-400" : "text-slate-400"} />
              <span>Assessment Graph</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* HOME BUTTON (when not on home) */}
            {activeView !== "home" && (
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#111827]/80 hover:bg-[#1A243B] text-slate-300 hover:text-white border border-white/[0.08] transition-all flex items-center space-x-1 shadow-sm"
                title="Return to Home Command Center"
              >
                <Home size={12} />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
          </nav>

          {/* RIGHT: CUSTOM SLEEK ENTITY SELECTOR & AIR-GAPPED STATUS */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            
            {/* SLEEK CUSTOM ENTITY DROPDOWN (Replaces ugly browser select) */}
            <div className="relative" ref={entityMenuRef}>
              <button
                type="button"
                onClick={() => setEntityMenuOpen(!entityMenuOpen)}
                className="bg-[#111827] hover:bg-[#172238] border border-white/[0.12] hover:border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs font-semibold text-white flex items-center space-x-2 transition-all shadow-sm"
                title="Select Monitored Critical Sector Entity"
              >
                <Building2 size={13} className="text-cyan-400" />
                <span className="font-mono text-cyan-300 font-bold">{selectedEntity}</span>
                <span className="hidden md:inline text-slate-400 text-[11px] font-normal font-sans">
                  ({ENTITY_NAMES[selectedEntity]})
                </span>
                <ChevronDown size={11} className={`text-slate-400 transition-transform duration-150 ${entityMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {entityMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 glass-panel border border-white/[0.14] rounded-xl shadow-2xl py-1.5 z-50 bg-[#0D1525]/98 animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
                    Monitored Sector Entities
                  </div>
                  {[
                    { id: "CSE-ALPHA", name: "CSE Alpha", sector: "Power Grid / Critical Infra" },
                    { id: "CSE-BETA", name: "CSE Beta", sector: "Grid Transmission & Dispatch" },
                    { id: "CSE-GAMMA", name: "CSE Gamma", sector: "Nuclear Control & Safety" },
                  ].map((ent) => {
                    const isSelected = selectedEntity === ent.id;
                    return (
                      <button
                        key={ent.id}
                        type="button"
                        onClick={() => {
                          onSelectEntity(ent.id);
                          setEntityMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-cyan-950/60 text-cyan-300 font-semibold border-l-2 border-cyan-400"
                            : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center space-x-2">
                            <span>{ent.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 font-normal">({ent.id})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{ent.sector}</div>
                        </div>
                        {isSelected && <Check size={14} className="text-cyan-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AIR-GAPPED SLEEK STATUS PILL */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#111827] border border-white/[0.08] text-[10px] font-mono text-emerald-400 shadow-inner" title="100% Offline Air-Gapped Operation">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot-pulse" />
              <span className="tracking-wide">AIR-GAPPED</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
