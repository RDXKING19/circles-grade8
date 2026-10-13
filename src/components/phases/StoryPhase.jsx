import React, { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { CircleVisual } from '../shared/CircleVisual.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { storyNarration } from '../../utils/narration.js';
import { STORY_PANELS } from '../../data/storyContent.js';

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'diagram'
  const slide = STORY_PANELS[slideIdx];

  const slideChangeRef = useRef(onSlideChange);
  slideChangeRef.current = onSlideChange;

  useEffect(() => {
    setViewMode('image');
  }, [slideIdx]);

  useEffect(() => {
    if (slideChangeRef.current) {
      slideChangeRef.current(slideIdx + 1, STORY_PANELS.length);
    }
  }, [slideIdx]);

  useEffect(() => {
    if (!muted) narrate(storyNarration(slideIdx), true);
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    if (slideIdx < STORY_PANELS.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Story Glass Card - Spacious, high quality, and responsive */}
      <div className="w-full max-w-6xl h-[calc(100dvh-var(--header-h)-75px)] max-h-[650px] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-7 items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Left Column: Visual Story Illustration & Geometry Blueprint */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-400/40 h-56 sm:h-72 md:h-full w-full bg-[#110729]/95 flex flex-col items-center justify-center shrink-0">
          {viewMode === 'image' ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden group">
              <img
                src={slide.image || `/assets/story/story_${slide.panel}.png`}
                alt={slide.title}
                className="w-full h-full object-cover object-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle top & bottom vignette for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#110729]/80 via-transparent to-black/30 pointer-events-none rounded-2xl" />

              {/* Badges and toggle control */}
              <div className="absolute top-2.5 left-2.5 bg-[#160b36]/85 border border-purple-400/40 rounded-full px-3 py-1 text-xs sm:text-sm text-purple-200 font-extrabold shadow-lg backdrop-blur-md">
                Scene {slide.panel} / {STORY_PANELS.length}
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
                <div className="bg-[#1e0a44]/90 border border-purple-400/50 rounded-full px-3.5 py-1 text-xs sm:text-sm text-amber-300 font-black shadow-lg backdrop-blur-md truncate max-w-[65%]">
                  Fair Concept: {slide.title}
                </div>
                <button
                  onClick={() => setViewMode('diagram')}
                  className="bg-[#2c125e]/90 hover:bg-[#3d1a80] border border-purple-300/50 text-purple-200 hover:text-white rounded-full px-3 py-1 text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md shadow-lg hover:scale-105"
                  title="Switch to Geometry Diagram"
                >
                  <span>📐</span>
                  <span>Blueprint</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-between p-3 bg-[#110729]/95">
              <div className="w-full flex-1 flex items-center justify-center">
                <CircleVisual type={slide.visualType} data={slide.visualData} />
              </div>
              <div className="w-full flex items-center justify-between pt-1">
                <div className="bg-[#1e0a44]/90 border border-purple-400/50 rounded-full px-3.5 py-1 text-xs sm:text-sm text-amber-300 font-black">
                  Geometry: {slide.title}
                </div>
                <button
                  onClick={() => setViewMode('image')}
                  className="bg-amber-500/90 hover:bg-amber-400 text-[#0c031d] rounded-full px-3.5 py-1 text-xs sm:text-sm font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg hover:scale-105"
                  title="Switch to Story Art"
                >
                  <span>🎨</span>
                  <span>Story Scene</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Narrative Typography & Speech */}
        <div className="flex flex-col items-start text-left justify-between h-full py-1 gap-2.5 overflow-y-auto pr-1">
          {/* Phase Badge */}
          <div className="flex items-center gap-2.5">
            <span className="text-sm sm:text-base font-black text-amber-400 tracking-wider uppercase">
              Blueprint {slide.panel} of {STORY_PANELS.length}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          {/* Slide Title */}
          <h2 className="font-display font-900 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] text-amber-300 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-base sm:text-lg md:text-xl lg:text-[1.25rem] leading-relaxed font-bold drop-shadow-sm">
            {slide.text}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45]/95 border-2 border-amber-400/60 rounded-2xl px-4 py-2.5 text-center text-amber-300 font-display font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2.5 shadow-lg">
            <span className="shrink-0 text-base sm:text-xl">✨</span>
            <span className="leading-snug">{slide.highlight}</span>
            <span className="shrink-0 text-base sm:text-xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl shadow-xl shrink-0">
              {slide.characterEmoji}
            </div>
            <div className="bg-white text-[#0c031d] rounded-2xl px-4 sm:px-5 py-2.5 font-display font-black text-sm sm:text-base md:text-lg shadow-xl flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-3 z-20 shrink-0">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-base sm:text-lg px-7 py-3 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105"
        >
          ← Back
        </button>

        {/* Slide Dots */}
        <div className="flex items-center gap-2.5">
          {STORY_PANELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`h-3 rounded-full transition-all cursor-pointer ${
                i === slideIdx ? 'bg-amber-400 w-10' : 'bg-white/30 w-3 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold font-display font-900 text-base sm:text-lg px-8 py-3 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition cursor-pointer"
        >
          <span>
            {slideIdx === STORY_PANELS.length - 1 ? 'Enter Ride Lab' : 'Next Blueprint'}
          </span>
          <span className="ml-1.5">→</span>
        </button>
      </div>
    </div>
  );
}
