// src/components/IncidentDecisionGraph.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  GitBranch, 
  Layers, 
  Terminal, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Network, 
  SlidersHorizontal,
  Flame,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye
} from 'lucide-react';

export function IncidentDecisionGraph({ activeCase }) {
  const [viewMode, setViewMode] = useState('GRAPH'); // 'GRAPH' | 'PIPELINE'
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Graph Canvas Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  if (!activeCase || !activeCase.graphNodes) {
    return (
      <div className="bg-[#0b0f1a] rounded-xl border border-slate-800 p-8 text-center text-slate-500">
        Select a case to inspect its Incident Decision Graph.
      </div>
    );
  }

  const rawNodes = activeCase.graphNodes;
  const rawEdges = activeCase.graphEdges || [];

  // Compute Topological DAG Layout for the Graph View
  const { layoutNodes, layoutEdges, canvasWidth, canvasHeight } = useMemo(() => {
    // 1. Build adjacency and in-degree map
    const inDegree = {};
    const adj = {};
    rawNodes.forEach(n => {
      inDegree[n.id] = 0;
      adj[n.id] = [];
    });

    rawEdges.forEach(e => {
      if (adj[e.from]) adj[e.from].push(e.to);
      if (inDegree[e.to] !== undefined) {
        inDegree[e.to] = (inDegree[e.to] || 0) + 1;
      }
    });

    // 2. Assign depth level to each node
    const depths = {};
    const queue = [];

    // Root nodes (in-degree 0) start at depth 0
    rawNodes.forEach(n => {
      if (inDegree[n.id] === 0) {
        depths[n.id] = 0;
        queue.push(n.id);
      }
    });

    // If all nodes have cycles or no root, fallback to first node
    if (queue.length === 0 && rawNodes.length > 0) {
      depths[rawNodes[0].id] = 0;
      queue.push(rawNodes[0].id);
    }

    // BFS / Relaxation for longest path depth
    while (queue.length > 0) {
      const u = queue.shift();
      const currentDepth = depths[u] || 0;
      const neighbors = adj[u] || [];
      neighbors.forEach(v => {
        if (depths[v] === undefined || depths[v] < currentDepth + 1) {
          depths[v] = currentDepth + 1;
          queue.push(v);
        }
      });
    }

    // Assign fallback depth for any unreached node
    rawNodes.forEach((n, idx) => {
      if (depths[n.id] === undefined) {
        depths[n.id] = idx;
      }
    });

    // 3. Group nodes by level (column)
    const columns = {};
    let maxLevel = 0;
    rawNodes.forEach(n => {
      const lvl = depths[n.id] || 0;
      if (!columns[lvl]) columns[lvl] = [];
      columns[lvl].push(n);
      if (lvl > maxLevel) maxLevel = lvl;
    });

    // 4. Calculate spatial coordinates (x, y)
    const nodeWidth = 240;
    const nodeHeight = 110;
    const colSpacing = 360;
    const rowSpacing = 160;

    let maxColHeight = 0;
    const positions = {};

    Object.keys(columns).forEach(lvlStr => {
      const lvl = parseInt(lvlStr, 10);
      const colNodes = columns[lvl];
      const totalColHeight = colNodes.length * rowSpacing;
      if (totalColHeight > maxColHeight) maxColHeight = totalColHeight;

      colNodes.forEach((node, rowIdx) => {
        // Vertical centering offset
        const yOffset = (rowIdx - (colNodes.length - 1) / 2) * rowSpacing + 220;
        positions[node.id] = {
          ...node,
          x: lvl * colSpacing + 60,
          y: Math.max(40, yOffset),
          width: nodeWidth,
          height: nodeHeight,
          level: lvl
        };
      });
    });

    // 5. Build rich edges with coordinates
    const computedEdges = rawEdges.map((e, idx) => {
      const source = positions[e.from];
      const target = positions[e.to];
      if (!source || !target) return null;

      const sx = source.x + source.width;
      const sy = source.y + source.height / 2;
      const tx = target.x;
      const ty = target.y + target.height / 2;

      // Cubic bezier control points
      const dx = Math.max(60, (tx - sx) / 2);
      const pathData = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;

      return {
        id: `e-${idx}`,
        from: e.from,
        to: e.to,
        label: e.label,
        style: e.style || 'solid_cyan',
        pathData,
        midX,
        midY
      };
    }).filter(Boolean);

    const totalWidth = Math.max(850, (maxLevel + 1) * colSpacing + 100);
    const totalHeight = Math.max(460, maxColHeight + 120);

    return {
      layoutNodes: Object.values(positions),
      layoutEdges: computedEdges,
      canvasWidth: totalWidth,
      canvasHeight: totalHeight
    };
  }, [rawNodes, rawEdges]);

  // Pan interaction handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.node-card')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 30 });
  };

  return (
    <div className="bg-[#0b0f1a] rounded-xl border border-slate-800 p-4 lg:p-5 flex flex-col h-full space-y-4">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              Incident Decision Graph (DAG)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {activeCase.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Directed Acyclic Graph reconstruction of operational decisions, branches, and omitted negative space.
          </p>
        </div>

        {/* View Mode Toggle & Canvas Controls */}
        <div className="flex items-center gap-2">
          
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('GRAPH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'GRAPH'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Interactive 2D Topology Graph View"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph View</span>
            </button>

            <button
              onClick={() => setViewMode('PIPELINE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'PIPELINE'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sequential Timeline View"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Pipeline View</span>
            </button>
          </div>

          {/* Graph Zoom Controls (visible in Graph View) */}
          {viewMode === 'GRAPH' && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs text-slate-400">
              <button
                onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-slate-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="p-1 hover:text-white ml-1 border-l border-slate-800 pl-1.5"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono px-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            Alert / Ingress
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            Analyst Action
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            Omitted Negative Space Fork
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Containment / Resolution
          </span>
        </div>

        <span className="text-slate-500 text-[10px]">
          {viewMode === 'GRAPH' ? 'Tip: Drag canvas to pan, click nodes to inspect' : 'Showing sequential flow'}
        </span>
      </div>

      {/* VIEW MODE 1: INTERACTIVE 2D TOPOLOGY GRAPH VIEW */}
      {viewMode === 'GRAPH' ? (
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full h-[420px] bg-[#06080f] rounded-lg border border-slate-800/80 overflow-hidden select-none cursor-grab ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
        >
          {/* Cyber Grid Background */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" 
          />

          {/* Scalable & Pannable Graph Container */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`
            }}
            className="absolute inset-0 transition-transform duration-75"
          >
            {/* SVG Connecting Edges Layer */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
            >
              <defs>
                {/* Cyan Arrowhead Marker */}
                <marker 
                  id="arrow-cyan" 
                  viewBox="0 0 10 10" 
                  refX="8" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
                </marker>

                {/* Dashed Red Omission Arrowhead */}
                <marker 
                  id="arrow-red" 
                  viewBox="0 0 10 10" 
                  refX="8" 
                  refY="5" 
                  markerWidth="7" 
                  markerHeight="7" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
                </marker>

                {/* Emerald Containment Arrowhead */}
                <marker 
                  id="arrow-emerald" 
                  viewBox="0 0 10 10" 
                  refX="8" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>

                {/* Amber Marker */}
                <marker 
                  id="arrow-amber" 
                  viewBox="0 0 10 10" 
                  refX="8" 
                  refY="5" 
                  markerWidth="6" 
                  markerHeight="6" 
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
              </defs>

              {layoutEdges.map((edge) => {
                const isDashedRed = edge.style === 'dashed_red';
                const isEmerald = edge.style === 'solid_emerald';
                const isCrimson = edge.style === 'solid_crimson';

                const strokeColor = isDashedRed ? '#ef4444' : isEmerald ? '#10b981' : isCrimson ? '#f43f5e' : '#00f0ff';
                const markerId = isDashedRed ? 'url(#arrow-red)' : isEmerald ? 'url(#arrow-emerald)' : isCrimson ? 'url(#arrow-red)' : 'url(#arrow-cyan)';

                return (
                  <g key={edge.id}>
                    {/* Shadow/Glow Line */}
                    <path
                      d={edge.pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isDashedRed ? 4 : 3}
                      strokeOpacity="0.2"
                    />

                    {/* Main Edge Path */}
                    <path
                      d={edge.pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isDashedRed ? 2.5 : 2}
                      strokeDasharray={isDashedRed ? '6 4' : 'none'}
                      markerEnd={markerId}
                      className={isDashedRed ? 'animate-pulse-slow' : ''}
                    />

                    {/* Edge Label Pill */}
                    {edge.label && (
                      <g transform={`translate(${edge.midX}, ${edge.midY})`}>
                        <rect
                          x="-50"
                          y="-10"
                          width="100"
                          height="20"
                          rx="4"
                          fill="#090d16"
                          stroke={strokeColor}
                          strokeWidth="1"
                          strokeOpacity="0.7"
                        />
                        <text
                          x="0"
                          y="4"
                          fill={isDashedRed ? '#fca5a5' : '#e2e8f0'}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive HTML Node Cards Layer */}
            {layoutNodes.map((node) => {
              const isMissing = node.type === 'missing_action';
              const isAlert = node.type === 'alert';
              const isContainment = node.type === 'containment';
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${node.width}px`
                  }}
                  className={`node-card p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'scale-105 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] z-30'
                      : 'hover:scale-102 hover:shadow-lg z-20'
                  } ${
                    isMissing
                      ? 'bg-red-950/70 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.25)] border-dashed'
                      : isAlert
                        ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-100 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : isContainment
                          ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900/90 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                      isMissing 
                        ? 'bg-red-900/80 text-red-200' 
                        : isAlert 
                          ? 'bg-cyan-900/80 text-cyan-200' 
                          : 'bg-black/50 text-slate-400'
                    }`}>
                      {node.type.replace('_', ' ')}
                    </span>
                    {node.time && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {node.time}
                      </span>
                    )}
                  </div>

                  <div className="font-semibold text-xs text-white leading-snug">
                    {node.label}
                  </div>

                  <div className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-tight">
                    {node.detail}
                  </div>

                  {isMissing && (
                    <div className="mt-2 text-[10px] font-mono text-red-300 font-bold bg-red-900/60 px-2 py-0.5 rounded flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400 shrink-0" />
                      <span>OMITTED NEGATIVE SPACE</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: SEQUENTIAL PIPELINE VIEW */
        <div className="relative w-full min-h-[380px] bg-[#070a12] rounded-lg border border-slate-800/80 p-6 overflow-x-auto flex flex-col justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 max-w-5xl mx-auto w-full py-4">
            {rawNodes.map((node, index) => {
              const isMissing = node.type === 'missing_action';
              const isAlert = node.type === 'alert';
              const isContainment = node.type === 'containment';
              const isSelected = selectedNode?.id === node.id;

              return (
                <React.Fragment key={node.id}>
                  {/* Visual Node */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`group relative flex flex-col items-center cursor-pointer transition-all ${
                      isSelected ? 'scale-105' : 'hover:scale-102'
                    }`}
                  >
                    <div className={`p-4 rounded-xl border text-center w-52 transition-all ${
                      isMissing
                        ? 'bg-red-950/40 border-red-500/80 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)] border-dashed animate-pulse-slow'
                        : isAlert
                          ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : isContainment
                            ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-900/90 border-slate-700 text-slate-200'
                    }`}>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                          {node.type.replace('_', ' ')}
                        </span>
                        {node.time && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {node.time}
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-xs text-white leading-tight">
                        {node.label}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {node.detail}
                      </div>

                      {isMissing && (
                        <div className="mt-2 text-[10px] font-mono text-red-300 font-bold bg-red-900/60 py-0.5 rounded">
                          ⚠ NEGATIVE SPACE GAP
                        </div>
                      )}
                    </div>

                    {/* Inspector Pin */}
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      isMissing ? 'bg-red-500' : isAlert ? 'bg-cyan-400' : 'bg-slate-500'
                    }`} />
                  </div>

                  {/* Connector Arrow if not last */}
                  {index < rawNodes.length - 1 && (
                    <div className="hidden md:flex flex-col items-center justify-center shrink-0">
                      <div className={`h-0.5 w-12 ${
                        rawNodes[index + 1]?.type === 'missing_action' 
                          ? 'border-t-2 border-dashed border-red-500/70' 
                          : 'bg-cyan-500/50'
                      }`} />
                      <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                        {rawNodes[index + 1]?.type === 'missing_action' ? 'Omitted' : 'Progress'}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Node Inspector Drawer */}
      {selectedNode ? (
        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              DECISION NODE INSPECTOR: {selectedNode.label}
            </span>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-500 hover:text-slate-300 font-mono"
            >
              [Close]
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Operational Finding</span>
              <p className="text-slate-200 mt-0.5">{selectedNode.detail}</p>
              {selectedNode.time && (
                <span className="text-cyan-400 font-mono block mt-1">Logged Timestamp: {selectedNode.time}</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Governance & Supervisory Basis</span>
              <p className="text-slate-300 mt-0.5 italic">
                {selectedNode.type === 'missing_action'
                  ? 'Mandated by NCIIPC Critical Information Infrastructure (CII) & RBI Cyber Security Guidelines: Critical asset threats mandate host containment within 15 minutes.'
                  : 'Standard operational action recorded in SOC audit log.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 text-center py-1 font-mono">
          Click any decision node above to inspect raw telemetry, analyst notes, and regulatory grounding.
        </div>
      )}

    </div>
  );
}
