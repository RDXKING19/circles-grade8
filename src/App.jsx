import React, { useReducer, useState, useEffect } from 'react';
import { setMuted, playClickSound } from './utils/audio.js';
import { TopNav } from './components/TopNav.jsx';
import { IntroScreen } from './components/IntroScreen.jsx';
import { WonderPhase } from './components/phases/WonderPhase.jsx';
import { StoryPhase } from './components/phases/StoryPhase.jsx';
import { SimulatePhase } from './components/phases/SimulatePhase.jsx';
import { PlayPhase } from './components/phases/PlayPhase.jsx';
import { ReflectPhase, CelebrationScreen } from './components/phases/ReflectPhase.jsx';
import { checkBadges } from './utils/badgeEngine.js';

const INITIAL_STATE = {
  phase: 'intro', // 'intro' | 'wonder' | 'story' | 'simulate' | 'practice' | 'reflect'
  storyPanel: 0,
  simCompleted: [false, false, false], // 3 stations: A, B, C
  worldResults: Array(10).fill(null),
  xp: 0,
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  bossesDefeated: 0,
  badges: [],
  audioEnabled: true,
  journeyComplete: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'COMPLETE_SIM_STATION': {
      const idx = action.payload;
      const updated = [...state.simCompleted];
      updated[idx] = true;
      const nextBadges = checkBadges({ ...state, simCompleted: updated });
      return {
        ...state,
        simCompleted: updated,
        badges: Array.from(new Set([...state.badges, ...nextBadges.map(b => b.id)]))
      };
    }

    case 'ANSWER_CORRECT': {
      const nextStreak = state.streak + 1;
      const nextBest = Math.max(state.bestStreak, nextStreak);
      const earnedXP = action.payload?.xpDelta || 10;
      const newBadges = action.payload?.newBadges || [];

      return {
        ...state,
        xp: state.xp + earnedXP,
        streak: nextStreak,
        bestStreak: nextBest,
        totalCorrect: state.totalCorrect + 1,
        totalAnswered: state.totalAnswered + 1,
        badges: Array.from(new Set([...state.badges, ...newBadges]))
      };
    }

    case 'ANSWER_INCORRECT':
      return {
        ...state,
        streak: 0,
        totalAnswered: state.totalAnswered + 1
      };

    case 'UPDATE_WORLD_RESULT': {
      const { worldIdx, stars, bossWon } = action.payload;
      const newResults = [...state.worldResults];
      if (stars !== undefined) {
        newResults[worldIdx] = Math.max(newResults[worldIdx] || 0, stars);
      }
      const nextBosses = bossWon ? state.bossesDefeated + 1 : state.bossesDefeated;
      const nextBadges = checkBadges({
        ...state,
        worldResults: newResults,
        bossesDefeated: nextBosses
      });

      return {
        ...state,
        worldResults: newResults,
        bossesDefeated: nextBosses,
        badges: Array.from(new Set([...state.badges, ...nextBadges.map(b => b.id)]))
      };
    }

    case 'COMPLETE_PHASE': {
      if (action.payload === 'practice') {
        return { ...state, phase: 'reflect' };
      }
      if (action.payload === 'reflect') {
        return {
          ...state,
          journeyComplete: true,
          badges: Array.from(new Set([...state.badges, 'journey_complete']))
        };
      }
      return state;
    }

    case 'TOGGLE_AUDIO': {
      const nextAudio = !state.audioEnabled;
      setMuted(!nextAudio);
      return { ...state, audioEnabled: nextAudio };
    }

    case 'RESET_SESSION':
      return { ...INITIAL_STATE, audioEnabled: state.audioEnabled };

    default:
      return state;
  }
}

export function App() {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [storySlideInfo, setStorySlideInfo] = useState(null);

  const completed = {
    wonder: state.phase !== 'intro' && state.phase !== 'wonder',
    story: !['intro', 'wonder', 'story'].includes(state.phase),
    simulate: state.simCompleted.every(Boolean),
    practice: state.worldResults.some(r => r != null && r > 0),
    reflect: state.journeyComplete
  };

  const hasProgress =
    state.xp > 0 || state.worldResults.some(r => r != null && r > 0) || state.badges.length > 0;

  // Global click audio effect for tactile feedback
  useEffect(() => {
    const handleGlobalClick = e => {
      const target = e.target.closest(
        'button, [role="button"], [role="option"], [role="radio"], [role="checkbox"], input[type="radio"], input[type="checkbox"], input[type="range"], select, option, .cursor-pointer, svg .cursor-pointer'
      );
      if (target) {
        playClickSound();
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  const goPhase = key => {
    if (key !== 'story') setStorySlideInfo(null);
    dispatch({ type: 'SET_PHASE', payload: key });
  };

  const handleUpdateScore = payload => {
    if (payload.isCorrect !== undefined) {
      if (payload.isCorrect) {
        dispatch({ type: 'ANSWER_CORRECT', payload });
      } else {
        dispatch({ type: 'ANSWER_INCORRECT', payload });
      }
    }
    if (payload.worldIdx !== undefined) {
      dispatch({ type: 'UPDATE_WORLD_RESULT', payload });
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar (Hidden on Intro Screen) */}
      {state.phase !== 'intro' && (
        <TopNav
          phase={state.phase}
          completed={completed}
          muted={!state.audioEnabled}
          onToggleMute={toggleMute}
          onHome={() => dispatch({ type: 'RESET_SESSION' })}
          onGoPhase={goPhase}
          slideInfo={state.phase === 'story' ? storySlideInfo : null}
          hasProgress={hasProgress}
        />
      )}

      {/* Main Viewport Content Area */}
      <main className={`flex-1 min-h-0 flex flex-col relative overflow-hidden ${state.phase !== 'intro' ? 'app-main' : ''}`}>
        {state.phase === 'intro' && (
          <IntroScreen onBegin={() => dispatch({ type: 'SET_PHASE', payload: 'wonder' })} />
        )}

        {state.phase === 'wonder' && (
          <WonderPhase
            muted={!state.audioEnabled}
            onNext={() => dispatch({ type: 'SET_PHASE', payload: 'story' })}
          />
        )}

        {state.phase === 'story' && (
          <StoryPhase
            muted={!state.audioEnabled}
            onSlideChange={(current, total) => setStorySlideInfo({ current, total })}
            onDone={() => {
              setStorySlideInfo(null);
              dispatch({ type: 'SET_PHASE', payload: 'simulate' });
            }}
          />
        )}

        {state.phase === 'simulate' && (
          <SimulatePhase
            muted={!state.audioEnabled}
            simCompleted={state.simCompleted}
            onCompleteStation={idx => dispatch({ type: 'COMPLETE_SIM_STATION', payload: idx })}
            onNext={() => dispatch({ type: 'SET_PHASE', payload: 'practice' })}
          />
        )}

        {state.phase === 'practice' && !state.journeyComplete && (
          <PlayPhase
            muted={!state.audioEnabled}
            xp={state.xp}
            streak={state.streak}
            bestStreak={state.bestStreak}
            badges={state.badges}
            simCompleted={state.simCompleted}
            worldResults={state.worldResults}
            onUpdateScore={handleUpdateScore}
            onGoReflect={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
          />
        )}

        {state.phase === 'reflect' && !state.journeyComplete && (
          <ReflectPhase
            xp={state.xp}
            stars={state.worldResults.reduce((a, b) => a + (b || 0), 0)}
            bestStreak={state.bestStreak}
            badges={state.badges}
            worldResults={state.worldResults}
            muted={!state.audioEnabled}
            onComplete={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' })}
          />
        )}

        {state.journeyComplete && (
          <CelebrationScreen
            xp={state.xp}
            stars={state.worldResults.reduce((a, b) => a + (b || 0), 0)}
            bestStreak={state.bestStreak}
            muted={!state.audioEnabled}
            onRestart={() => dispatch({ type: 'RESET_SESSION' })}
          />
        )}
      </main>
    </div>
  );
}

export default App;
