import React, { useState, useMemo } from 'react';
import { StepSlider, Msg, GoldBtn } from './kit.jsx';
import { playClickSound, playSuccessChime } from '../../utils/audio.js';

const CASES = [
  {
    id: 1,
    title: 'Case 1: Fairground Lawn Plaza',
    kind: 'area-by-angle',
    fixedType: 'range',
    fixedVal: 6,
    targetVal: 12,
    targetUnit: 'π m²',
    targetText: 'Water exactly 12π m² of grass',
    targetExplanation: 'With range = 6 m, full circle area is 36π m². To get 12π m², angle must be 120° (1/3 turn).'
  },
  {
    id: 2,
    title: 'Case 2: Perimeter Barrier Spray',
    kind: 'arc-by-radius',
    fixedType: 'angle',
    fixedVal: 90,
    targetVal: 6,
    targetUnit: 'π m',
    targetText: 'Spray along outer barrier arc of 6π m',
    targetExplanation: 'With angle = 90° (1/4 turn), arc = 1/4 × 2πr = (r/2)π. To get 6π m, range must be 12 m.'
  },
  {
    id: 3,
    title: 'Case 3: Festival Fountain Lawn',
    kind: 'area-by-angle',
    fixedType: 'range',
    fixedVal: 4,
    targetVal: 8,
    targetUnit: 'π m²',
    targetText: 'Water exactly 8π m² semicircular zone',
    targetExplanation: 'With range = 4 m, full circle area is 16π m². To water 8π m², angle must be 180° (1/2 turn).'
  }
];

export function SprinklerSetup({ onComplete }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [angle, setAngle] = useState(60);
  const [range, setRange] = useState(6);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [completedCases, setCompletedCases] = useState(0);
  const [isStationComplete, setIsStationComplete] = useState(false);

  const curCase = CASES[caseIdx];

  // Set initial fixed values when case changes
  const activeAngle = curCase.fixedType === 'angle' ? curCase.fixedVal : angle;
  const activeRange = curCase.fixedType === 'range' ? curCase.fixedVal : range;

  // Calculation
  const currentVal = useMemo(() => {
    if (curCase.kind === 'area-by-angle') {
      // sector area in terms of pi: (angle / 360) * range^2
      return (activeAngle / 360) * (activeRange * activeRange);
    } else {
      // arc length in terms of pi: (angle / 360) * 2 * range
      return (activeAngle / 360) * (2 * activeRange);
    }
  }, [curCase, activeAngle, activeRange]);

  const isExact = Math.abs(currentVal - curCase.targetVal) < 0.01;
  const isClose = Math.abs(currentVal - curCase.targetVal) <= curCase.targetVal * 0.25;

  const handleCheck = () => {
    playClickSound();
    setChecked(true);
    if (isExact) {
      playSuccessChime();
      setFeedback({ type: 'success', text: `Target Matched! ${curCase.targetExplanation}` });
      const nextDone = completedCases + 1;
      setCompletedCases(nextDone);

      if (nextDone >= 3) {
        setIsStationComplete(true);
        if (onComplete) onComplete();
      }
    } else {
      setFeedback({
        type: 'warning',
        text: `Currently at ${currentVal.toFixed(1).replace(/\.0$/, '')}${curCase.targetUnit}. Adjust the slider to match ${curCase.targetVal}${curCase.targetUnit} exactly!`
      });
    }
  };

  const handleNextCase = () => {
    playClickSound();
    if (caseIdx < CASES.length - 1) {
      const nextIdx = caseIdx + 1;
      setCaseIdx(nextIdx);
      setChecked(false);
      setFeedback(null);
      if (CASES[nextIdx].fixedType === 'range') setRange(CASES[nextIdx].fixedVal);
      if (CASES[nextIdx].fixedType === 'angle') setAngle(CASES[nextIdx].fixedVal);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden select-none">
      {/* Top Header & Case Tracker */}
      <div className="flex items-center justify-between bg-[#150a30]/80 border border-purple-400/30 rounded-2xl px-3 py-1.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💦</span>
          <span className="text-sm sm:text-base font-black text-amber-300">
            {curCase.title}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-200">
          <span>Target Progress:</span>
          <span className="text-emerald-300 font-extrabold">{completedCases}/3 Complete</span>
        </div>
      </div>

      {/* Main Workspace Grid: Sprinkler Garden Simulation & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center flex-1 min-h-0 overflow-hidden">
        {/* Left: Interactive Garden Sprinkler SVG */}
        <div className="md:col-span-6 bg-[#091b15] border border-emerald-500/30 rounded-2xl p-2 flex flex-col items-center justify-center h-full relative overflow-hidden">
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-40 sm:max-h-44">
            <defs>
              <radialGradient id="lawn_grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
              </radialGradient>
            </defs>
            {/* Lawn background */}
            <rect x="0" y="0" width="240" height="180" rx="16" fill="url(#lawn_grad)" />

            {/* Sprinkler spray sector */}
            {(() => {
              const rPx = Math.min(75, activeRange * 5.5 + 15);
              const rad = (activeAngle * Math.PI) / 180;
              const endX = 120 + rPx * Math.cos(rad);
              const endY = 90 - rPx * Math.sin(rad);
              const largeArc = activeAngle > 180 ? 1 : 0;
              return (
                <g>
                  {/* Spray area */}
                  <path
                    d={`M 120 90 L ${120 + rPx} 90 A ${rPx} ${rPx} 0 ${largeArc} 0 ${endX} ${endY} Z`}
                    fill="#38bdf8"
                    fillOpacity="0.38"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {/* Outer spray rim */}
                  <path
                    d={`M ${120 + rPx} 90 A ${rPx} ${rPx} 0 ${largeArc} 0 ${endX} ${endY}`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3.5"
                    strokeDasharray="4 3"
                  />
                </g>
              );
            })()}

            {/* Central Sprinkler Head */}
            <circle cx="120" cy="90" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="120" cy="90" r="3" fill="#38bdf8" />

            {/* Angle & Range Indicator Badge with clear backdrop */}
            <g transform="translate(120, 158)">
              <rect x="-85" y="-11" width="170" height="22" rx="11" fill="#06221c" fillOpacity="0.92" stroke="#38bdf8" strokeWidth="1.2" />
              <text x="0" y="4" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="900">
                Spray: {activeAngle}° · Range: {activeRange} m
              </text>
            </g>
          </svg>

          <div className="mt-1 bg-black/50 px-3.5 py-1 rounded-full border border-white/15 text-center">
            <span className="text-xs sm:text-sm text-cyan-200 font-black">
              Goal: {curCase.targetText}
            </span>
          </div>
        </div>

        {/* Right: Dual Sliders & Target Meter */}
        <div className="md:col-span-6 flex flex-col justify-between h-full gap-2 p-1">
          {/* Target Alignment Meter */}
          <div className="bg-[#12062d] border border-white/15 rounded-xl p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-slate-200">Live Calibration:</span>
              <span className={isExact ? 'text-emerald-400 font-black text-sm sm:text-base' : isClose ? 'text-amber-400 font-black' : 'text-slate-100 font-black'}>
                {currentVal.toFixed(1).replace(/\.0$/, '')}{curCase.targetUnit} / {curCase.targetVal}{curCase.targetUnit}
              </span>
            </div>

            <div className="w-full h-3 bg-purple-950/80 rounded-full overflow-hidden border border-white/20">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  isExact
                    ? 'bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]'
                    : isClose
                    ? 'bg-amber-400'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, (currentVal / curCase.targetVal) * 100))}%` }}
              />
            </div>
          </div>

          {/* Slider 1: Spray Angle */}
          <StepSlider
            label={`Spray Angle ${curCase.fixedType === 'angle' ? '(Locked by Plan)' : ''}`}
            value={activeAngle}
            min={30}
            max={360}
            step={15}
            unit="°"
            disabled={curCase.fixedType === 'angle'}
            onChange={val => {
              setAngle(val);
              setChecked(false);
            }}
          />

          {/* Slider 2: Spray Range */}
          <StepSlider
            label={`Spray Range ${curCase.fixedType === 'range' ? '(Locked by Plan)' : ''}`}
            value={activeRange}
            min={2}
            max={14}
            step={1}
            unit=" m"
            disabled={curCase.fixedType === 'range'}
            onChange={val => {
              setRange(val);
              setChecked(false);
            }}
          />

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-0.5">
            <GoldBtn onClick={handleCheck} disabled={checked && isExact} className="flex-1 py-2.5 text-sm sm:text-base font-black">
              <span>{isExact ? 'Target Matched! ✓' : 'Check Calibration'}</span>
            </GoldBtn>

            {checked && isExact && caseIdx < CASES.length - 1 && (
              <button
                onClick={handleNextCase}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-full transition cursor-pointer shadow-lg hover:scale-105"
              >
                Next Case →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      <div className="bg-[#12072a] border border-purple-400/40 rounded-2xl p-2 sm:p-2.5 shrink-0">
        {feedback ? (
          <Msg type={feedback.type}>{feedback.text}</Msg>
        ) : isStationComplete ? (
          <div className="flex items-center justify-between text-xs sm:text-sm md:text-base text-emerald-300 font-black">
            <span>✓ Station B Complete! All 3 sprinkler cases accurately calibrated!</span>
            <span className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400">
              Station Solved 🎉
            </span>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-slate-200 font-extrabold text-center">
            Adjust the unlocked slider until the spray matches {curCase.targetVal}{curCase.targetUnit} exactly.
          </div>
        )}
      </div>
    </div>
  );
}
