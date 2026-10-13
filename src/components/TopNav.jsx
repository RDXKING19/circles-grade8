import React, { useRef, useState } from 'react';
import { useHeaderHeight } from '../hooks/useHeaderHeight.js';

export function TopNav({
  phase,
  completed = {},
  muted = false,
  onToggleMute,
  onHome,
  onGoPhase,
  slideInfo,
  hasProgress = false
}) {
  const headerRef = useRef(null);
  useHeaderHeight(headerRef);

  const [showConfirmHome, setShowConfirmHome] = useState(false);

  const phases = [
    { num: '01', key: 'wonder', label: 'Wonder', icon: '🔍' },
    { num: '02', key: 'story', label: 'Story', icon: '📖' },
    { num: '03', key: 'simulate', label: 'Simulate', icon: '🧪' },
    { num: '04', key: 'practice', label: 'Practice', icon: '🎮' },
    { num: '05', key: 'reflect', label: 'Reflect', icon: '📝' }
  ];

  const handleHomeClick = () => {
    if (hasProgress) {
      setShowConfirmHome(true);
    } else {
      onHome();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="w-full fixed top-0 left-0 right-0 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col items-center z-50 pointer-events-none"
      >
        {/* Top Navbar Main Row */}
        <div className="w-full flex items-center justify-between pointer-events-none max-w-7xl gap-2">
          {/* Top Left: Home Button Pill */}
          <button
            onClick={handleHomeClick}
            className="pointer-events-auto bg-[#180c3c]/90 hover:bg-[#25145b] border border-white/25 text-white font-display font-extrabold text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 hover:scale-105 shrink-0"
          >
            <span className="text-base sm:text-lg">🏠</span>
            <span className="font-black tracking-wide hidden sm:inline">Home</span>
          </button>

          {/* Top Center: Capsule Progress Bar */}
          <nav className="pointer-events-auto bg-[#160a36]/95 border border-white/20 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1 sm:gap-1.5 shrink-0">
            {phases.map((p, idx) => {
              const isActive = phase === p.key;

              return (
                <React.Fragment key={p.key}>
                  {idx > 0 && <span className="w-1 sm:w-2 h-[2px] bg-white/20 shrink-0" />}

                  <button
                    onClick={() => onGoPhase(p.key)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-all duration-200 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#3b1c8c] text-white border-2 border-white shadow-[0_0_16px_rgba(255,255,255,0.45)] scale-105'
                        : 'bg-transparent text-slate-200 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[11px] sm:text-xs font-black flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/15 text-slate-200'
                      }`}
                    >
                      {p.num}
                    </span>
                    <span className="text-xs sm:text-sm">{p.icon}</span>
                    <span className={`font-black tracking-tight ${isActive ? 'inline' : 'hidden md:inline'}`}>
                      {p.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Top Right: Sound On/Muted */}
          <div className="pointer-events-auto flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleMute}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer border shadow-lg hover:scale-105 shrink-0 ${
                muted
                  ? 'bg-rose-950/80 border-rose-400/50 text-rose-300'
                  : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
              }`}
            >
              <span className="text-sm">{muted ? '🔇' : '🔊'}</span>
              <span className="font-black hidden sm:inline">{muted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>
        </div>

        {/* Story Sub-Bar if in Story Phase */}
        {slideInfo && (
          <div className="pointer-events-auto bg-[#180a3c]/90 border border-purple-400/40 rounded-full px-4 py-1 mt-1.5 shadow-md flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-300">
            <span>🎡 Fair Blueprint {slideInfo.current} of {slideInfo.total}</span>
          </div>
        )}
      </header>

      {/* Confirmation Modal for Reset/Exit */}
      {showConfirmHome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#160a36] border-2 border-purple-400/50 rounded-3xl p-6 shadow-2xl text-center">
            <div className="text-4xl mb-3">🎪</div>
            <h3 className="font-display font-900 text-xl sm:text-2xl text-white mb-2">
              Return to Entrance?
            </h3>
            <p className="text-sm text-slate-300 font-bold mb-6">
              You have active progress in the fair! Returning to the entrance resets your current session.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmHome(false)}
                className="btn-ghost text-sm px-5 py-2.5"
              >
                Continue Fair
              </button>
              <button
                onClick={() => {
                  setShowConfirmHome(false);
                  onHome();
                }}
                className="btn-gold text-sm px-6 py-2.5"
              >
                Reset & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
