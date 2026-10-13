import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration, playClickSound } from '../../utils/audio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { WORLDS } from '../../config/worlds.config.js';

const RECAP_QUESTIONS = [
  {
    id: 1,
    q: "A sector has a central angle of 60°. What fraction of the circle's circumference is its arc?",
    options: ["1/6", "1/3", "1/60", "1/12"],
    correct: "1/6",
    explanation: "Fraction = Central Angle ÷ 360° = 60° ÷ 360° = 1/6."
  },
  {
    id: 2,
    q: "Arjun finds the area of a circle with diameter 10 cm as π × 10² = 100π cm². What went wrong?",
    options: [
      "He should have used the radius, 5 cm, giving 25π cm²",
      "He should have multiplied by 2 instead of squaring",
      "He should have divided 100 by π",
      "Nothing went wrong"
    ],
    correct: "He should have used the radius, 5 cm, giving 25π cm²",
    explanation: "Area uses radius, not diameter. r = 10 ÷ 2 = 5 cm, so Area = π × 5² = 25π cm²."
  },
  {
    id: 3,
    q: "Hui Min says the perimeter of a semicircle of radius 7 cm is 22 cm (π = 22/7). What is missing?",
    options: [
      "The straight diameter edge of 14 cm, so total perimeter is 36 cm",
      "She should have multiplied 22 cm by 2",
      "She forgot to add 7 cm once",
      "Nothing is missing"
    ],
    correct: "The straight diameter edge of 14 cm, so total perimeter is 36 cm",
    explanation: "The curved arc is 22 cm, but perimeter must also include the straight diameter (2 × 7 = 14 cm), giving 36 cm in total."
  }
];

export function ReflectPhase({
  xp = 0,
  stars = 0,
  bestStreak = 0,
  badges = [],
  worldResults = Array(10).fill(null),
  muted = false,
  onComplete
}) {
  const [recapIdx, setRecapIdx] = useState(0);
  const [recapAnswers, setRecapAnswers] = useState({});
  const [recapCompleted, setRecapCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [recapFeedback, setRecapFeedback] = useState(null);

  const minLength = 10;
  const currentRecapQ = RECAP_QUESTIONS[recapIdx];

  useEffect(() => {
    if (!muted) narrate(reflectNarration(), true);
    return () => stopNarration();
  }, [muted]);

  const handleRecapSelect = opt => {
    playClickSound();
    const isCorrect = opt === currentRecapQ.correct;
    setRecapAnswers(prev => ({ ...prev, [currentRecapQ.id]: opt }));

    if (isCorrect) {
      setRecapFeedback({ status: 'correct', text: currentRecapQ.explanation });
    } else {
      setRecapFeedback({ status: 'wrong', text: `Review the rule: ${currentRecapQ.explanation}` });
    }
  };

  const handleNextRecap = () => {
    setRecapFeedback(null);
    if (recapIdx < RECAP_QUESTIONS.length - 1) {
      setRecapIdx(i => i + 1);
    } else {
      setRecapCompleted(true);
    }
  };

  const handleSubmit = () => {
    if (!muted) narrate(reflectCompleteNarration(), true);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      // Ignore
    }
    onComplete();
  };

  const charCount = reflectionText.trim().length;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-3xl bg-[#160b36]/95 border-2 border-indigo-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center text-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Phase Band */}
        <div className="phase-band phase-band--reflect shrink-0" />

        {/* Phase Header */}
        <div className="flex items-center gap-2 mb-1 shrink-0">
          <span className="text-2xl sm:text-3xl">📝</span>
          <span className="text-indigo-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 5: Reflect & Consolidate
          </span>
        </div>

        <h2 className="text-main-heading text-white text-xl sm:text-2xl md:text-3xl mb-3 shrink-0">
          {recapCompleted ? 'Fair Plan Scorecard' : 'Engineer Concept Recap'}
        </h2>

        {!recapCompleted ? (
          /* Recap Questions Step */
          <div className="w-full flex flex-col items-center flex-1 min-h-0 justify-between overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs text-amber-300 font-black">
                Review Question {recapIdx + 1} of {RECAP_QUESTIONS.length}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="font-display font-900 text-base sm:text-lg text-white mb-3 max-w-xl">
              {currentRecapQ.q}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl mb-3">
              {currentRecapQ.options.map((opt, i) => {
                const isSelected = recapAnswers[currentRecapQ.id] === opt;
                const isCorrect = opt === currentRecapQ.correct;

                return (
                  <button
                    key={i}
                    onClick={() => handleRecapSelect(opt)}
                    className={`p-3 rounded-2xl border-2 font-display font-black text-xs sm:text-sm text-left transition cursor-pointer ${
                      isSelected
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-950/80 text-white'
                          : 'border-rose-400 bg-rose-950/80 text-white'
                        : 'border-white/15 bg-white/5 text-slate-200 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Continue */}
            {recapFeedback && (
              <div className="w-full max-w-xl mb-3">
                <div
                  className={`border rounded-xl p-2.5 text-xs font-bold ${
                    recapFeedback.status === 'correct'
                      ? 'border-emerald-400/50 bg-emerald-950/70 text-emerald-200'
                      : 'border-rose-400/50 bg-rose-950/70 text-rose-200'
                  }`}
                >
                  {recapFeedback.text}
                </div>
              </div>
            )}

            <button
              onClick={handleNextRecap}
              disabled={!recapAnswers[currentRecapQ.id]}
              className="btn-gold text-sm sm:text-base px-8 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {recapIdx < RECAP_QUESTIONS.length - 1 ? 'Next Question →' : 'View Fair Scorecard →'}
            </button>
          </div>
        ) : (
          /* Final Scorecard & Open Reflection Step */
          <div className="w-full flex flex-col items-center flex-1 min-h-0 justify-between overflow-hidden">
            {/* Stats Pills */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl mb-3">
              <div className="bg-[#120728] border border-amber-400/40 rounded-2xl p-2.5 text-center">
                <span className="text-xl sm:text-2xl font-display font-900 text-amber-300 block">{xp}</span>
                <span className="text-[11px] text-slate-300 font-black uppercase">Total XP</span>
              </div>
              <div className="bg-[#120728] border border-amber-400/40 rounded-2xl p-2.5 text-center">
                <span className="text-xl sm:text-2xl font-display font-900 text-amber-300 block">{stars}/30</span>
                <span className="text-[11px] text-slate-300 font-black uppercase">Stars</span>
              </div>
              <div className="bg-[#120728] border border-amber-400/40 rounded-2xl p-2.5 text-center">
                <span className="text-xl sm:text-2xl font-display font-900 text-amber-300 block">{bestStreak}</span>
                <span className="text-[11px] text-slate-300 font-black uppercase">Best Streak</span>
              </div>
            </div>

            {/* Reflection Text Input */}
            <div className="w-full max-w-xl flex flex-col gap-1.5 mb-3 text-left">
              <label className="text-xs font-black text-amber-300">
                Reflection to Chief Ride Engineer Tally:
              </label>
              <textarea
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Dear Tally, to find the length of an arc, I first work out the fraction of the circle because..."
                rows={3}
                className="w-full bg-[#110726] border-2 border-purple-400/40 rounded-2xl p-3 text-white text-xs sm:text-sm font-bold focus:border-amber-400 outline-none resize-none"
              />
              <span className="text-[11px] text-slate-400 font-bold self-end">
                {charCount}/{minLength} characters minimum
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={charCount < minLength}
              className="btn-gold text-base px-10 py-3 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(250,204,21,0.6)]"
            >
              Complete Journey 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CelebrationScreen({ xp = 0, stars = 0, bestStreak = 0, onRestart }) {
  useEffect(() => {
    try {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-xl bg-[#160b36]/95 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center fade-in-up z-20 my-auto">
        <div className="text-5xl sm:text-6xl mb-2 animate-bounce">🏆</div>

        <div className="bg-amber-400/20 border border-amber-400/60 text-amber-300 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider mb-2">
          Grade 8 Circles Mastered!
        </div>

        <h1 className="font-display font-900 text-3xl sm:text-4xl text-white mb-2 leading-tight">
          Orbit Night Fair Approved!
        </h1>

        <p className="text-slate-200 text-xs sm:text-sm font-bold mb-5 max-w-md">
          Sensational work! You have mastered circumference, area, arcs, sectors, and composite figures. All fair attractions are calibrated and ready for opening night!
        </p>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
            <span className="text-2xl font-display font-900 text-amber-300 block">{xp}</span>
            <span className="text-[10px] text-slate-300 font-black uppercase">Final XP</span>
          </div>
          <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
            <span className="text-2xl font-display font-900 text-amber-300 block">{stars}/30</span>
            <span className="text-[10px] text-slate-300 font-black uppercase">Stars</span>
          </div>
          <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
            <span className="text-2xl font-display font-900 text-amber-300 block">{bestStreak}</span>
            <span className="text-[10px] text-slate-300 font-black uppercase">Top Streak</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="btn-gold text-base py-3 px-10 shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105 transition cursor-pointer"
        >
          Explore Again 🎡
        </button>
      </div>
    </div>
  );
}
