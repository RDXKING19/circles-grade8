import React, { useState, useMemo } from 'react';
import { StepSlider, Panel, Msg, GoldBtn } from './kit.jsx';
import { playClickSound, playSuccessChime } from '../../utils/audio.js';

const RADIUS_PRESETS = [7, 14, 21];

function polarToCartesian(cx, cy, r, deg) {
  const rad = ((deg % 360) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad)
  };
}

function describeSector(cx, cy, r, deg) {
  const end = polarToCartesian(cx, cy, r, deg);
  const largeArcFlag = deg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function describeArc(cx, cy, r, deg) {
  const end = polarToCartesian(cx, cy, r, deg);
  const largeArcFlag = deg > 180 ? 1 : 0;
  return `M ${cx + r} ${cy} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function UnrollLab({ onComplete }) {
  const [deg, setDeg] = useState(90);
  const [radiusIdx, setRadiusIdx] = useState(0); // 7m, 14m, 21m
  const [visitedZones, setVisitedZones] = useState(new Set([2])); // zone 2 is 90 deg
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const radius = RADIUS_PRESETS[radiusIdx];

  const handleAngleChange = newDeg => {
    setDeg(newDeg);
    const zone = Math.floor(newDeg / 45);
    setVisitedZones(prev => {
      const next = new Set(prev);
      next.add(zone);
      return next;
    });
  };

  // Fractions & Math calculations (using pi = 22/7)
  const mathData = useMemo(() => {
    const fraction = deg / 360;
    const fullCirc = Math.round(2 * (22 / 7) * radius);
    const fullArea = Math.round((22 / 7) * radius * radius);
    const arcLen = (fraction * fullCirc).toFixed(1).replace(/\.0$/, '');
    const secArea = (fraction * fullArea).toFixed(1).replace(/\.0$/, '');

    // Simplify fraction display
    let fracStr = `${deg}/360`;
    if (deg === 90) fracStr = '1/4';
    else if (deg === 180) fracStr = '1/2';
    else if (deg === 270) fracStr = '3/4';
    else if (deg === 60) fracStr = '1/6';
    else if (deg === 120) fracStr = '1/3';
    else if (deg === 45) fracStr = '1/8';

    return { fraction, fullCirc, fullArea, arcLen, secArea, fracStr };
  }, [deg, radius]);

  const hasHighZone = Array.from(visitedZones).some(z => z >= 4);
  const canTakeQuiz = visitedZones.size >= 4 && hasHighZone;

  const handleQuizSelect = idx => {
    playClickSound();
    setQuizAnswer(idx);
    if (idx === 0) {
      setQuizFeedback({
        type: 'success',
        text: 'Correct! Both arc length and sector area cover exactly 1/4 of the full circle measures!'
      });
      playSuccessChime();
      setIsCompleted(true);
      if (onComplete) onComplete();
    } else {
      setQuizFeedback({
        type: 'error',
        text: 'Not quite. Remember that both arc length and sector area use the exact same fraction: angle ÷ 360°.'
      });
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden select-none">
      {/* Top Banner & Radius Selector */}
      <div className="flex items-center justify-between bg-[#150a30]/80 border border-purple-400/30 rounded-2xl px-3 py-1.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎡</span>
          <span className="text-sm sm:text-base font-black text-amber-300">
            Giant Wheel Radius:
          </span>
          <div className="flex items-center gap-1.5">
            {RADIUS_PRESETS.map((r, i) => (
              <button
                key={r}
                onClick={() => {
                  playClickSound();
                  setRadiusIdx(i);
                }}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-black transition cursor-pointer ${
                  radiusIdx === i
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                r = {r} m
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Zone Progress */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 font-extrabold">
          <span>Angle Zones:</span>
          <span className="text-cyan-300 font-black text-sm sm:text-base">
            {Math.min(4, visitedZones.size)}/4 {hasHighZone ? '✓' : ''}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Wheel on Left, Unrolled Rim on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center flex-1 min-h-0 overflow-hidden">
        {/* Left: Giant Wheel SVG */}
        <div className="md:col-span-6 bg-[#0f0524] border border-purple-400/30 rounded-2xl p-2 flex flex-col items-center justify-center h-full relative overflow-hidden">
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-40 sm:max-h-44">
            <defs>
              <filter id="unroll_glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fb923c" floodOpacity="0.8" />
              </filter>
            </defs>
            {/* Wheel rim */}
            <circle cx="120" cy="90" r="65" fill="#1b0e3e" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />

            {/* Shaded sector */}
            <path
              d={describeSector(120, 90, 65, deg)}
              fill="#c084fc"
              fillOpacity="0.4"
              stroke="#c084fc"
              strokeWidth="2"
            />

            {/* Glowing outer curved arc */}
            <path
              d={describeArc(120, 90, 65, deg)}
              fill="none"
              stroke="#fb923c"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#unroll_glow)"
            />

            {/* Spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
              const p = polarToCartesian(120, 90, 65, a);
              return <line key={a} x1="120" y1="90" x2={p.x} y2={p.y} stroke="#6366f1" strokeWidth="1" opacity="0.4" />;
            })}

            {/* Center hub */}
            <circle cx="120" cy="90" r="5" fill="#facc15" />

            {/* Central Angle Badge - clear backdrop to avoid spoke overlap */}
            <g transform="translate(120, 68)">
              <rect x="-24" y="-12" width="48" height="20" rx="10" fill="#150a30" fillOpacity="0.9" stroke="#facc15" strokeWidth="1.5" />
              <text x="0" y="3" textAnchor="middle" fill="#facc15" fontSize="13" fontWeight="900">
                {deg}°
              </text>
            </g>
          </svg>

          <div className="text-center mt-0.5">
            <span className="text-xs sm:text-sm text-slate-200 font-black">
              Central Angle: {deg}° · Fraction of Wheel = {mathData.fracStr}
            </span>
          </div>
        </div>

        {/* Right: Unrolled Rim & Comparison Bars */}
        <div className="md:col-span-6 flex flex-col justify-between h-full gap-2 p-1">
          {/* Unroll Bar Visualization */}
          <div className="bg-[#12062d] border border-white/15 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5">
            <div className="text-xs sm:text-sm font-black text-slate-200 flex items-center justify-between">
              <span>Full Circumference Rim:</span>
              <span className="text-cyan-300 font-black text-sm sm:text-base">{mathData.fullCirc} m</span>
            </div>
            <div className="w-full h-3 bg-purple-950/80 rounded-full overflow-hidden border border-white/20">
              <div className="h-full bg-cyan-400 w-full rounded-full opacity-80" />
            </div>

            <div className="text-xs sm:text-sm font-black text-slate-200 flex items-center justify-between mt-0.5">
              <span>Unrolled Arc Path ({deg}°):</span>
              <span className="text-amber-400 font-black text-sm sm:text-base">{mathData.arcLen} m</span>
            </div>
            <div className="w-full h-3 bg-purple-950/80 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(2, mathData.fraction * 100))}%` }}
              />
            </div>
          </div>

          {/* Formulas Output Readout */}
          <div className="bg-[#180a3c]/90 border border-purple-400/30 rounded-xl p-2.5 text-xs sm:text-sm font-bold flex flex-col gap-1 leading-snug">
            <div className="text-slate-200">
              <span className="text-amber-300 font-black">Arc Length: </span>
              {mathData.fracStr} × {mathData.fullCirc} m = <span className="text-amber-300 font-black text-sm sm:text-base">{mathData.arcLen} m</span>
            </div>
            <div className="text-slate-200">
              <span className="text-purple-300 font-black">Sector Area: </span>
              {mathData.fracStr} × {mathData.fullArea} m² = <span className="text-purple-300 font-black text-sm sm:text-base">{mathData.secArea} m²</span>
            </div>
          </div>

          {/* Angle Slider Control */}
          <StepSlider
            label="Adjust Central Angle"
            value={deg}
            min={15}
            max={345}
            step={5}
            unit="°"
            onChange={handleAngleChange}
          />
        </div>
      </div>

      {/* Confirmation Gate / Challenge Box */}
      <div className="bg-[#12072a] border border-amber-400/40 rounded-2xl p-2 sm:p-2.5 shrink-0">
        {!canTakeQuiz ? (
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-200 font-extrabold">
            <span>Explore at least 4 angle zones (including 180°+) to unlock confirmation challenge!</span>
            <span className="text-amber-400 font-black">({visitedZones.size}/4 zones)</span>
          </div>
        ) : !isCompleted ? (
          <div className="flex flex-col gap-1.5">
            <div className="text-xs sm:text-sm md:text-base text-amber-300 font-display font-black">
              Gate Challenge: A sector has central angle 90°. Which statement is true?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                'Its arc is 1/4 of circumference & sector is 1/4 of area.',
                'Its arc is 1/4 of circumference but sector is 1/2 of area.',
                'Its arc is 90 cm and sector is 90 cm².',
                'Its arc is 1/90 of circumference & sector is 1/90 of area.'
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizSelect(idx)}
                  className={`text-left px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                    quizAnswer === idx
                      ? idx === 0
                        ? 'border-emerald-400 bg-emerald-950/80 text-white'
                        : 'border-rose-400 bg-rose-950/80 text-white'
                      : 'border-white/20 bg-white/5 text-slate-200 hover:border-amber-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {quizFeedback && <Msg type={quizFeedback.type}>{quizFeedback.text}</Msg>}
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs sm:text-sm md:text-base text-emerald-300 font-black">
            <span>✓ Station A Complete! Concept proved: Arc length & sector area follow central angle fraction.</span>
            <span className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400">
              Station Solved 🎉
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
