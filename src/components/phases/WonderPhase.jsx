import React, { useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { CircleVisual } from '../shared/CircleVisual.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    if (!muted) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-3xl max-h-[calc(100dvh-var(--header-h)-16px)] glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto py-3 sm:py-4 px-4 sm:px-7 shadow-2xl border-2 border-purple-400/40 rounded-3xl overflow-y-auto">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder" />

        <div className="flex items-center gap-2 mb-1 shrink-0">
          <span className="text-2xl sm:text-3xl animate-bounce">🔍</span>
          <span className="text-purple-300 font-display font-900 text-xs sm:text-sm md:text-base tracking-widest uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="font-display font-900 text-purple-100 mb-2 max-w-2xl text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight drop-shadow-lg shrink-0">
          The Mystery of the Giant Wheel
        </h2>

        {/* Feature Visual Box */}
        <div className="w-full bg-[#1e143c]/95 border-2 border-purple-400/35 rounded-2xl p-2.5 sm:p-3.5 mb-2.5 flex flex-col items-center shadow-2xl backdrop-blur-md shrink-0">
          <div className="w-full max-w-xs h-28 sm:h-32 flex items-center justify-center mb-1">
            <CircleVisual type="wheel-arc" compact />
          </div>
          <div className="text-amber-300 font-display font-900 text-lg sm:text-xl md:text-2xl mb-1 tracking-wide drop-shadow-md">
            Radius = 14 m · Arc from 12 to 3 o'clock = ?
          </div>
          <p className="text-slate-100 text-sm sm:text-base md:text-lg max-w-2xl leading-snug sm:leading-relaxed font-bold drop-shadow-sm">
            The Orbit Night Fair's Giant Wheel has a radius of 14 metres. A photo cabin rides from 12 o'clock to 3 o'clock. Can Hui Min calculate the exact distance travelled without walking the curved rim with a string?
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-3 bg-[#14082c]/90 border border-purple-400/40 rounded-2xl px-4 sm:px-5 py-2 mb-2.5 max-w-2xl shadow-lg shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500/30 border border-purple-300/40 text-purple-200 flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 shadow-md">
            🦉
          </div>
          <p className="text-purple-100 text-xs sm:text-sm md:text-base font-extrabold text-left leading-snug">
            "What if you could measure a curved path just by knowing what fraction of the circle it covers?"
          </p>
        </div>

        <button
          onClick={onNext}
          className="btn-gold text-base sm:text-lg font-display font-900 px-8 py-2.5 sm:py-3 rounded-full flex items-center gap-2.5 shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition cursor-pointer shrink-0"
        >
          <span>Explore the Fair Blueprints</span>
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
