// src/components/GhostAttackReplay.jsx
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  ShieldAlert, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FastForward, 
  Layers 
} from 'lucide-react';
import { ghostScenarios } from '../data/ghostScenarios';

export function GhostAttackReplay({ activeEntityId }) {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const scenario = ghostScenarios[selectedScenarioIndex];
  const stages = scenario.stages;
  const currentStage = stages[currentStageIndex];

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev < stages.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3500 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stages.length, playbackSpeed]);

  const socState = activeEntityId === 'entity-beta' 
    ? currentStage.socBetaState 
    : currentStage.socAlphaState;

  return (
    <div className="bg-[#0b0f1a] rounded-xl border border-slate-800 p-4 lg:p-5 flex flex-col space-y-4">
      
      {/* Studio Header & Controller Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              Ghost Attack Replay Studio
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800">
              MITRE ATT&CK Step-by-Step
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized timeline comparing actual adversarial progression against SOC triage awareness.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setCurrentStageIndex(Math.max(0, currentStageIndex - 1))}
            disabled={currentStageIndex === 0}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
            title="Step Back"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1 text-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Replay'}</span>
          </button>

          <button
            onClick={() => setCurrentStageIndex(Math.min(stages.length - 1, currentStageIndex + 1))}
            disabled={currentStageIndex === stages.length - 1}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStageIndex(0);
            }}
            className="p-1.5 text-slate-400 hover:text-white"
            title="Reset Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Speed Buttons */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-1.5 py-0.5 rounded ${
                  playbackSpeed === speed 
                    ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Progression Track */}
      <div className="grid grid-cols-5 gap-2">
        {stages.map((st, idx) => {
          const isActive = idx === currentStageIndex;
          const isPassed = idx < currentStageIndex;

          return (
            <button
              key={st.stageIndex}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStageIndex(idx);
              }}
              className={`p-2.5 rounded-lg text-left border transition-all ${
                isActive
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : isPassed
                    ? 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>STAGE 0{st.stageIndex}</span>
                <span className="text-slate-400">{st.timeOffset}</span>
              </div>
              <div className="text-xs font-semibold truncate">
                {st.mitreTactic.split(':')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dual Reality Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        
        {/* Track A: Real Ground Truth (Attacker Campaign) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-red-400 flex items-center gap-1.5 font-semibold tracking-wider">
              <Flame className="w-4 h-4 text-red-500" />
              GROUND TRUTH: ADVERSARIAL ATTACK EXECUTION
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentStage.timestamp}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block">MITRE Technique</span>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {currentStage.mitreTechnique}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block">Attacker Infiltration Activity</span>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {currentStage.attackerAction}
            </p>
          </div>

          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-red-300 overflow-x-auto">
            <span className="text-slate-500 block text-[10px] uppercase">Telemetry Artifact / IOC:</span>
            {currentStage.ioc}
          </div>
        </div>

        {/* Track B: SOC Operational Awareness & Decision */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          socState.color === 'crimson' 
            ? 'bg-red-950/20 border-red-800/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
            : socState.color === 'emerald'
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 font-semibold tracking-wider">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              OBSERVED SOC DECISION & AWARENESS
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              socState.color === 'crimson' 
                ? 'bg-red-900/60 text-red-300' 
                : socState.color === 'emerald'
                  ? 'bg-emerald-900/60 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {socState.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block">SOC Operational Finding</span>
            <div className="text-sm font-bold text-slate-100 mt-0.5">
              {socState.label}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-mono block">Analyst Action & Disposition</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {socState.actionTaken}
            </p>
          </div>

          <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">
              Triage Latency: <strong className="text-white">{socState.durationSec}s</strong>
            </span>
            <span className={`text-[11px] font-mono font-semibold ${
              socState.color === 'crimson' ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {socState.color === 'crimson' ? '⚠ Execution Failure Window' : '✓ Resilient Response'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
