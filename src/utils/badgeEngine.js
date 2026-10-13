export const BADGES = {
  first_correct: {
    id: 'first_correct',
    name: 'First Curve Cracked 🔍',
    description: 'Answered your first circle question correctly!',
    icon: '🔍'
  },
  streak_5: {
    id: 'streak_5',
    name: 'Hot on the Orbit 🔥',
    description: 'Achieved a streak of 5 correct answers in a row!',
    icon: '🔥'
  },
  streak_10: {
    id: 'streak_10',
    name: 'Chief Orbit Engineer 🦉',
    description: 'Achieved an amazing streak of 10 correct answers in a row!',
    icon: '🦉'
  },
  sim_all: {
    id: 'sim_all',
    name: 'Ride Lab Master 🧪',
    description: 'Completed all 3 Simulation Stations in the Ride Lab!',
    icon: '🧪'
  },
  world_3star: {
    id: 'world_3star',
    name: 'Attraction Approved ⭐⭐⭐',
    description: 'Earned 3 Stars in any Practice World!',
    icon: '⭐⭐⭐'
  },
  boss_won: {
    id: 'boss_won',
    name: 'Boss Ride Calibrated 🏆',
    description: 'Defeated a Boss in a Boss Battle!',
    icon: '🏆'
  },
  answered_20: {
    id: 'answered_20',
    name: 'Persistent Compass 📐',
    description: 'Answered 20 or more questions in Practice Mode!',
    icon: '📐'
  },
  journey_complete: {
    id: 'journey_complete',
    name: 'Orbit Fair Master 🎖️',
    description: 'Completed the full 5-phase circle learning journey!',
    icon: '🎖️'
  }
};

/**
 * Evaluates current state and returns an array of newly unlocked badge objects.
 */
export function checkBadges(state) {
  const currentBadges = new Set(state.badges || []);
  const newlyUnlocked = [];

  const trigger = (badgeId) => {
    if (!currentBadges.has(badgeId) && BADGES[badgeId]) {
      newlyUnlocked.push(BADGES[badgeId]);
      currentBadges.add(badgeId);
    }
  };

  // 1. First correct
  if ((state.totalCorrect || 0) >= 1) trigger('first_correct');

  // 2. Streaks
  if ((state.streak || 0) >= 5 || (state.bestStreak || 0) >= 5) trigger('streak_5');
  if ((state.streak || 0) >= 10 || (state.bestStreak || 0) >= 10) trigger('streak_10');

  // 3. All 3 Simulate stations complete
  if (Array.isArray(state.simCompleted) && state.simCompleted.slice(0, 3).every(Boolean)) {
    trigger('sim_all');
  }

  // 4. Any world 3 stars
  if (Array.isArray(state.worldResults) && state.worldResults.some(r => r === 3)) {
    trigger('world_3star');
  }

  // 5. Boss won
  if (state.bossesDefeated && state.bossesDefeated > 0) {
    trigger('boss_won');
  }

  // 6. Answered 20+
  if ((state.totalAnswered || 0) >= 20) {
    trigger('answered_20');
  }

  // 7. Journey complete
  if (state.journeyComplete) {
    trigger('journey_complete');
  }

  return newlyUnlocked;
}
