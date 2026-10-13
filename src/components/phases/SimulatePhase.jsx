import React, { useState, useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { simStationIntro } from '../../utils/narration.js';
import { UnrollLab } from '../simulations/UnrollLab.jsx';
import { SprinklerSetup } from '../simulations/SprinklerSetup.jsx';
import { TrackGardenBuilder } from '../simulations/TrackGardenBuilder.jsx';

const STATIONS = [
  {
    id: 0,
    icon: '🎡',
    name: 'Station A: Giant Wheel Unroll Lab',
    sub: 'Rotate sectors & unroll curved rims',
    Comp: UnrollLab
  },
  {
    id: 1,
    icon: '💦',
    name: 'Station B: Lawn Sprinkler Setup',
    sub: 'Calibrate spray angle & range targets',
    Comp: SprinklerSetup
  },
  {
    id: 2,
    icon: '🏟️',
    name: 'Station C: Track & Garden Builder',
    sub: 'Composite figures: area & perimeter',
    Comp: TrackGardenBuilder
  }
];

export function SimulatePhase({
  muted,
  onNext,
  simCompleted = [false, false, false],
  onCompleteStation
}) {
  const [stationIdx, setStationIdx] = useState(0);

  const currentStation = STATIONS[stationIdx];
  const CurrentComp = currentStation.Comp;

  const completedCount = simCompleted.slice(0, 3).filter(Boolean).length;
  const allStationsComplete = completedCount === 3;

  useEffect(() => {
    if (!muted) narrate(simStationIntro(stationIdx), true);
    return () => stopNarration();
  }, [stationIdx, muted]);

  const handleStationFinished = () => {
    if (onCompleteStation) {
      onCompleteStation(stationIdx);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Simulation Stations Card - strictly no page scrolling */}
      <div className="w-full max-w-6xl h-[calc(100dvh-var(--header-h)-28px)] max-h-[660px] sim-card bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="sim-accent w-24 h-1.5 bg-cyan-400 rounded-full mb-1 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="sim-title font-display font-900 text-lg sm:text-2xl text-white flex items-center gap-2 mb-2 shrink-0 drop-shadow-md">
          <span className="text-xl sm:text-2xl">🧪</span>
          <span>Ride Lab — 3 Engineering Stations</span>
        </h2>

        {/* Two-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar: Station Tabs */}
          <div className="w-full lg:w-[340px] xl:w-[360px] flex flex-col justify-between gap-2 shrink-0">
            <div className="flex flex-col gap-2">
              {STATIONS.map((st, i) => {
                const isSelected = stationIdx === i;
                const isDone = simCompleted[i];

                return (
                  <button
                    key={st.id}
                    onClick={() => setStationIdx(i)}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] ring-1 ring-cyan-400/50'
                        : 'border-purple-500/30 bg-[#13082b]/85 text-slate-200 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl font-black shrink-0 ${
                          isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                        }`}
                      >
                        {st.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-900 text-xs sm:text-sm md:text-base leading-tight truncate text-white">
                          {st.name}
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-slate-300 mt-0.5 truncate">
                          {st.sub}
                        </p>
                      </div>
                    </div>

                    {/* Clean Status Indicator Badge */}
                    <div className="shrink-0 flex items-center">
                      {isDone ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/70 text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <span>✓</span>
                          <span>Done</span>
                        </span>
                      ) : isSelected ? (
                        <span className="bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="bg-white/10 text-slate-300 border border-white/15 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                          Ready
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Left CTA Button (Gated on all 3 stations being complete) */}
            <div className="flex flex-col gap-1.5 mt-auto">
              <button
                onClick={onNext}
                disabled={!allStationsComplete}
                className="btn-gold font-display font-900 text-sm sm:text-base py-2.5 sm:py-3 px-5 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Go to Practice Phase!</span>
                <span className="text-lg">→</span>
              </button>
              {!allStationsComplete && (
                <span className="text-xs text-amber-300 font-black text-center leading-tight">
                  Complete all 3 stations to unlock Practice ({completedCount}/3 complete)
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Station Workspace */}
          <div className="sim-right flex-1 min-w-0 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-3xl p-3 sm:p-4 flex flex-col justify-between shadow-inner overflow-hidden">
            <CurrentComp
              onComplete={handleStationFinished}
              audioEnabled={!muted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
