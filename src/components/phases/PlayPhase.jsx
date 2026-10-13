import React, { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { KingdomMap } from '../gamification/KingdomMap.jsx';
import { QuestionRenderer } from '../quiz/QuestionRenderer.jsx';
import { BossBattleModal } from '../quiz/BossBattleModal.jsx';
import { FeedbackOverlay } from '../shared/FeedbackOverlay.jsx';
import { BadgesModal } from '../gamification/BadgesModal.jsx';
import { generateBank, DISTRICTS } from '../../data/questionBank.js';
import { createRNG } from '../../utils/rng.js';
import { calcStars, calcXP } from '../../utils/scoring.js';
import { checkBadges } from '../../utils/badgeEngine.js';
import { narrate, playClickSound } from '../../utils/audio.js';
import {
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossWinNarration
} from '../../utils/narration.js';

const MODES = [
  { id: 'guided', name: 'Guided Practice', icon: '🧭', questions: 5, hints: true, timed: false, lives: null },
  { id: 'independent', name: 'Independent Practice', icon: '📝', questions: 10, hints: false, timed: false, lives: null },
  { id: 'timed', name: 'Timed Challenge', icon: '⏱️', questions: 8, hints: false, timed: true, lives: null },
  { id: 'boss', name: 'Boss Battle', icon: '👑', questions: 5, hints: false, timed: false, lives: 3 }
];

export function PlayPhase({
  muted = false,
  xp = 0,
  streak = 0,
  bestStreak = 0,
  badges = [],
  simCompleted = [false, false, false],
  worldResults = Array(10).fill(null),
  onUpdateScore,
  onGoReflect
}) {
  const [selectedMode, setSelectedMode] = useState('independent');
  const [activeWorld, setActiveWorld] = useState(null); // null = map view, number = quiz view
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [showBossIntro, setShowBossIntro] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const timerRef = useRef(null);
  const totalCorrectRef = useRef(0);
  const totalAnsweredRef = useRef(0);
  const bankRef = useRef(null);

  // Pre-generate question bank once per session
  if (!bankRef.current) {
    bankRef.current = generateBank(Date.now());
  }

  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const allWorldsCompleted = worldResults.some(r => r != null && r > 0);

  // Timer for Timed Challenge Mode (avoids stale closures)
  useEffect(() => {
    if (activeWorld !== null && selectedMode === 'timed' && timeLeft > 0 && !feedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishQuizSession();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeWorld, selectedMode, feedback]);

  const startWorldSession = (worldIdx, modeId = selectedMode) => {
    const modeConfig = MODES.find(m => m.id === modeId) || MODES[1];
    const count = modeConfig.questions;

    // Grab world's 10 questions from pre-generated unique bank and shuffle
    const worldQuestions = bankRef.current.slice(worldIdx * 10, worldIdx * 10 + 10);
    const rng = createRNG(Date.now());
    const shuffled = rng.shuffle(worldQuestions).slice(0, count);

    setQuestions(shuffled);
    setQIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setHintLevel(0);
    setCorrectInSession(0);
    setTimeLeft(60);
    setLives(modeConfig.lives || 3);

    if (modeId === 'boss') {
      setShowBossIntro(true);
    } else {
      setActiveWorld(worldIdx);
    }
  };

  const handleOptionSelect = option => {
    playClickSound();
    if (selectedOption !== null || feedback !== null) return;
    setSelectedOption(option);

    const q = questions[qIdx];
    const isCorrect = option === q.correctAnswer;
    totalAnsweredRef.current += 1;

    if (isCorrect) {
      totalCorrectRef.current += 1;
      const nextCorrect = correctInSession + 1;
      setCorrectInSession(nextCorrect);
      const earnedXP = calcXP({ attempts: 1, hintsUsed: hintLevel, streak: streak + 1 });

      if (!muted) narrate(playCorrectNarration(streak + 1), true);

      // Check badges
      const newBadges = checkBadges({
        totalCorrect: totalCorrectRef.current,
        totalAnswered: totalAnsweredRef.current,
        streak: streak + 1,
        bestStreak: Math.max(bestStreak, streak + 1),
        simCompleted,
        worldResults,
        badges
      });

      onUpdateScore({
        xpDelta: earnedXP,
        isCorrect: true,
        newBadges: newBadges.map(b => b.id)
      });

      setFeedback({
        status: 'correct',
        title: 'Curve Calibrated! 🎯',
        explanation: q.explanation,
        xpGained: earnedXP,
        badge: newBadges.length > 0 ? newBadges[0] : null
      });
    } else {
      let remainingLives = lives;
      if (selectedMode === 'boss') {
        remainingLives = lives - 1;
        setLives(remainingLives);
      }

      if (!muted) narrate(playWrongNarration(qIdx), true);

      onUpdateScore({
        xpDelta: 0,
        isCorrect: false,
        newBadges: []
      });

      setFeedback({
        status: 'wrong',
        title: remainingLives <= 0 && selectedMode === 'boss' ? 'Out of Engineer Lives!' : 'Not Quite! 🔍',
        explanation: q.explanation,
        xpGained: 0,
        badge: null
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setHintLevel(0);

    // If out of lives in boss mode, finish
    if (selectedMode === 'boss' && lives <= 0) {
      finishQuizSession(false);
      return;
    }

    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
    } else {
      // Completed world session
      finishQuizSession(selectedMode === 'boss' && lives > 0);
    }
  };

  const finishQuizSession = (bossWon = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const stars = calcStars(correctInSession);
    onUpdateScore({
      worldIdx: activeWorld,
      stars,
      bossWon
    });

    if (bossWon) {
      if (!muted) narrate(bossWinNarration(DISTRICTS[activeWorld].boss.name), true);
    } else if (stars > 0) {
      if (!muted) narrate(districtCompleteNarration(DISTRICTS[activeWorld].name), true);
    }

    setActiveWorld(null);
  };

  const handleUseHint = () => {
    playClickSound();
    const nextHint = hintLevel + 1;
    setHintLevel(nextHint);
    if (!muted) {
      const q = questions[qIdx];
      if (nextHint === 1) narrate(playHint1Narration(q.hint1), true);
      else if (nextHint === 2) narrate(playHint2Narration(q.hint2), true);
    }
  };

  const currentDistrict = activeWorld !== null ? DISTRICTS[activeWorld] : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Top Practice Bar: XP, Streak, Stars, Badges */}
      <div className="w-full max-w-5xl bg-[#14082c]/90 border border-purple-400/30 rounded-2xl px-3 sm:px-4 py-2 flex items-center justify-between shadow-xl backdrop-blur-md z-20 shrink-0 mb-2">
        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-black text-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-300">✨</span>
            <span className="text-amber-300 font-display font-900">{xp}</span>
            <span className="hidden sm:inline text-slate-400">XP</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-rose-400">🔥</span>
            <span className="text-rose-300 font-display font-900">{streak}</span>
            <span className="hidden sm:inline text-slate-400">Streak</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-amber-300">★</span>
            <span className="text-amber-300 font-display font-900">{totalStars}/30</span>
            <span className="hidden sm:inline text-slate-400">Stars</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBadgesModal(true)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-xs font-black text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>🎖️</span>
            <span>{badges.length} Badges</span>
          </button>

          {allWorldsCompleted && (
            <button
              onClick={onGoReflect}
              className="btn-gold text-xs py-1 px-3 shadow-sm hover:scale-105 transition cursor-pointer"
            >
              Go to Reflect →
            </button>
          )}
        </div>
      </div>

      {/* View 1: Kingdom / Fair Map View */}
      {activeWorld === null && (
        <div className="w-full max-w-5xl flex-1 min-h-0 flex flex-col justify-between z-20">
          {/* Mode Selector Tabs */}
          <div className="flex items-center justify-center gap-2 mb-2 shrink-0 overflow-x-auto p-1">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  setSelectedMode(m.id);
                }}
                className={`px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-display font-black flex items-center gap-1.5 transition cursor-pointer ${
                  selectedMode === m.id
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md scale-105'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/30'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full text-slate-300">
                  {m.questions}Q
                </span>
              </button>
            ))}
          </div>

          {/* Map Grid */}
          <KingdomMap
            worldResults={worldResults}
            onSelectWorld={idx => startWorldSession(idx, selectedMode)}
            totalStars={totalStars}
            onGoReflect={onGoReflect}
            allCompleted={allWorldsCompleted}
          />

          <div className="text-center text-[11px] text-slate-400 font-extrabold mt-1 shrink-0">
            10 Fair Worlds · Need 1★ in World n to unlock World n+1 · All Questions Procedurally Unique
          </div>
        </div>
      )}

      {/* View 2: Active Quiz Session View */}
      {activeWorld !== null && (
        <div className="w-full max-w-4xl flex-1 min-h-0 flex flex-col justify-between z-20 fade-in-up">
          {/* Quiz Session Header */}
          <div className="w-full flex items-center justify-between border-b border-white/15 pb-2 mb-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentDistrict?.icon}</span>
              <span className="font-display font-900 text-sm sm:text-base text-white">
                {currentDistrict?.name}
              </span>
              <span className="text-xs text-amber-300 font-black">
                (Q {qIdx + 1}/{questions.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              {selectedMode === 'timed' && (
                <div className="bg-rose-950/80 border border-rose-400/50 px-3 py-0.5 rounded-full text-xs font-black text-rose-300 flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{timeLeft}s</span>
                </div>
              )}

              {selectedMode === 'boss' && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`text-base ${i < lives ? 'text-rose-400' : 'text-slate-600'}`}>
                      ❤️
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => setActiveWorld(null)}
                className="text-xs text-slate-400 hover:text-white font-black underline cursor-pointer"
              >
                Exit to Map
              </button>
            </div>
          </div>

          {/* Question Renderer */}
          <QuestionRenderer
            question={questions[qIdx]}
            selectedOption={selectedOption}
            onSelectOption={handleOptionSelect}
            showHints={selectedMode === 'guided'}
            hintLevel={hintLevel}
            onUseHint={handleUseHint}
            disabled={feedback !== null}
          />
        </div>
      )}

      {/* Feedback Overlay Modal */}
      {feedback && (
        <FeedbackOverlay
          status={feedback.status}
          title={feedback.title}
          explanation={feedback.explanation}
          xpGained={feedback.xpGained}
          badge={feedback.badge}
          onNext={handleNextQuestion}
          nextLabel={qIdx < questions.length - 1 ? 'Next Question →' : 'Finish World Session →'}
        />
      )}

      {/* Boss Intro Modal */}
      {showBossIntro && (
        <BossBattleModal
          boss={currentDistrict?.boss}
          lives={3}
          onStart={() => {
            setShowBossIntro(false);
            setActiveWorld(activeWorld);
          }}
          onClose={() => {
            setShowBossIntro(false);
            setActiveWorld(null);
          }}
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          unlockedBadges={badges}
          onClose={() => setShowBadgesModal(false)}
        />
      )}
    </div>
  );
}
