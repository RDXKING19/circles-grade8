import React from 'react';
import { FloatingSymbols } from './shared/FloatingSymbols.jsx';

export function IntroScreen({ onBegin }) {
  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Intro Content Card */}
      <div className="relative w-full max-w-4xl flex flex-col items-center text-center fade-in-up z-20 my-auto justify-between overflow-hidden py-1">
        {/* Curriculum Pill Badge */}
        <div className="bg-[#1c0d38] border-2 border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black px-5 py-1 rounded-full shadow-lg mb-2 tracking-wide shrink-0">
          ✨ Grade 8 · Circles & Mensuration
        </div>

        {/* Title */}
        <h1 className="font-display font-900 text-3xl sm:text-5xl md:text-6xl text-white text-center leading-tight tracking-tight mb-2 shrink-0">
          Circles at the
          <span className="text-[#facc15] font-900 block drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]">
            Orbit Night Fair
          </span>
        </h1>

        {/* Mascot Avatar & Speech Pill */}
        <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#facc15] p-0.5 shadow-[0_0_20px_rgba(250,204,21,0.7)] flex items-center justify-center text-xl shrink-0">
            🦉
          </div>
          <div className="bg-white rounded-full px-5 py-1 text-[#0c031d] font-display font-900 text-xs sm:text-sm md:text-base shadow-lg">
            Chief Engineer Tally: Ready to measure every curve? 🎉
          </div>
        </div>

        {/* Subtitle text */}
        <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl text-center leading-relaxed mb-3 font-bold drop-shadow-sm shrink-0">
          Join Hui Min and Arjun at the school night fair! Calculate boundaries, flooring, arc lengths, sector areas, and composite festival attractions.
        </p>

        {/* 3 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-3xl mb-3 shrink-0">
          <div className="bg-[#1a0c3a]/90 border border-purple-400/35 rounded-2xl p-2.5 sm:p-3 text-center shadow-lg">
            <span className="text-2xl mb-1 block">📏</span>
            <h4 className="font-display font-900 text-white text-xs sm:text-sm mb-0.5">Circle Rules</h4>
            <p className="text-slate-300 text-[11px] font-semibold leading-tight">
              Circumference, area, arc length, and sector area formulas.
            </p>
          </div>
          <div className="bg-[#1a0c3a]/90 border border-purple-400/35 rounded-2xl p-2.5 sm:p-3 text-center shadow-lg">
            <span className="text-2xl mb-1 block">🧪</span>
            <h4 className="font-display font-900 text-white text-xs sm:text-sm mb-0.5">Ride Simulations</h4>
            <p className="text-slate-300 text-[11px] font-semibold leading-tight">
              Interactive labs: Giant Wheel, Sprinkler, & Track Builder.
            </p>
          </div>
          <div className="bg-[#1a0c3a]/90 border border-purple-400/35 rounded-2xl p-2.5 sm:p-3 text-center shadow-lg">
            <span className="text-2xl mb-1 block">🎮</span>
            <h4 className="font-display font-900 text-white text-xs sm:text-sm mb-0.5">10 Fair Worlds</h4>
            <p className="text-slate-300 text-[11px] font-semibold leading-tight">
              Earn XP, collect star ratings, and calibrate boss rides!
            </p>
          </div>
        </div>

        {/* YOUR LEARNING JOURNEY Flow Card */}
        <div className="w-full max-w-3xl bg-[#14082c]/95 border-2 border-purple-400/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md flex flex-col items-center mb-3 shrink-0">
          <p className="text-[#facc15] text-[11px] sm:text-xs font-display font-900 tracking-wider text-center mb-1.5 uppercase">
            YOUR 5-STEP JOURNEY
          </p>

          <div className="flex items-center justify-between w-full max-w-xl px-2">
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-purple-400 bg-purple-950 text-xs sm:text-sm flex items-center justify-center mb-0.5">🔍</span>
              <span className="font-display font-900 text-white text-[11px] sm:text-xs">Wonder</span>
            </div>
            <span className="text-amber-400 text-xs font-black">→</span>
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-400 bg-amber-950 text-xs sm:text-sm flex items-center justify-center mb-0.5">📖</span>
              <span className="font-display font-900 text-white text-[11px] sm:text-xs">Story</span>
            </div>
            <span className="text-amber-400 text-xs font-black">→</span>
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cyan-400 bg-cyan-950 text-xs sm:text-sm flex items-center justify-center mb-0.5">🧪</span>
              <span className="font-display font-900 text-white text-[11px] sm:text-xs">Simulate</span>
            </div>
            <span className="text-amber-400 text-xs font-black">→</span>
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-emerald-400 bg-emerald-950 text-xs sm:text-sm flex items-center justify-center mb-0.5">🎮</span>
              <span className="font-display font-900 text-white text-[11px] sm:text-xs">Practice</span>
            </div>
            <span className="text-amber-400 text-xs font-black">→</span>
            <div className="flex flex-col items-center">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-indigo-400 bg-indigo-950 text-xs sm:text-sm flex items-center justify-center mb-0.5">📝</span>
              <span className="font-display font-900 text-white text-[11px] sm:text-xs">Reflect</span>
            </div>
          </div>
        </div>

        {/* Begin Button */}
        <button
          onClick={onBegin}
          className="btn-gold font-display font-900 text-base sm:text-lg px-8 py-3 rounded-full shadow-[0_0_28px_rgba(250,204,21,0.7)] hover:scale-105 transition cursor-pointer shrink-0"
        >
          <span>Begin Your Journey!</span>
          <span>🎡</span>
        </button>
      </div>
    </div>
  );
}
