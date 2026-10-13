import React, { useState } from 'react';
import { playClickSound, playSuccessChime } from '../../utils/audio.js';
import { GoldBtn, Msg } from './kit.jsx';

const ROUNDS = [
  {
    round: 1,
    title: 'Round 1: Festival Running Stadium Track',
    concept: 'Composite Shape = Rectangle + 2 Semicircles (which combine to make 1 Full Circle!)',
    description: 'A 30 m × 14 m central turf field with a curved semicircle on each 14 m end (radius r = 7 m).',
    hintText: 'Area: Add central rectangle (420 m²) + 2 semicircles (49π = 154 m²). Perimeter: Fence the 2 straights (60 m) + 2 outer curved arcs (14π = 44 m). Do NOT fence the interior lines!',
    pieces: [
      { id: 'rect', name: 'Central Turf Pitch (30 m × 14 m)', formula: '30 × 14', areaText: '+420 m²', type: 'base', icon: '🟩' },
      { id: 'semiA', name: 'West Semicircle Track (r = 7 m)', formula: '½π(7²)', areaText: '+24.5π m²', type: 'semicircle', icon: '🟣' },
      { id: 'semiB', name: 'East Semicircle Track (r = 7 m)', formula: '½π(7²)', areaText: '+24.5π m²', type: 'semicircle', icon: '🟣' },
      { id: 'decoy', name: 'Extra Square Yard (10 m × 10 m)', formula: '10 × 10', areaText: '+100 m²', isDecoy: true, icon: '⬜' }
    ],
    edges: [
      { id: 'top', name: 'Top Straight Rim (30 m)', length: '30 m', isBoundary: true, type: 'straight' },
      { id: 'bot', name: 'Bottom Straight Rim (30 m)', length: '30 m', isBoundary: true, type: 'straight' },
      { id: 'arcWest', name: 'West Outer Curved Arc (7π m = 22 m)', length: '7π m', isBoundary: true, type: 'arc' },
      { id: 'arcEast', name: 'East Outer Curved Arc (7π m = 22 m)', length: '7π m', isBoundary: true, type: 'arc' },
      { id: 'midWest', name: 'West Interior Pitch Line (14 m)', length: '14 m', isBoundary: false, type: 'interior' },
      { id: 'midEast', name: 'East Interior Pitch Line (14 m)', length: '14 m', isBoundary: false, type: 'interior' }
    ],
    correctAreaPieces: ['rect', 'semiA', 'semiB'],
    correctPerimeterEdges: ['top', 'bot', 'arcWest', 'arcEast'],
    summaryText: 'Total Area = 420 + 49π = 574 m² (π = 22/7) · Outer Perimeter = 60 + 14π = 104 m',
    areaTargetText: '420 + 49π m² (574 m²)',
    perimeterTargetText: '60 + 14π m (104 m)'
  },
  {
    round: 2,
    title: 'Round 2: Central Fountain Garden Bed',
    concept: 'Composite Shape = Square Plaza − Corner Quarter-Circle Cutout Pond',
    description: 'A 10 m × 10 m square plaza with a corner quarter-circle pond (r = 10 m) cut out from one side.',
    hintText: 'Area: Start with square (100 m²), subtract quarter-circle pond (25π m²). Perimeter: Fence top straight (10 m) + right straight (10 m) + curved pond rim (5π m).',
    pieces: [
      { id: 'square', name: 'Square Plaza Base (10 m × 10 m)', formula: '10 × 10', areaText: '+100 m²', type: 'base', icon: '🟧' },
      { id: 'quadrant', name: 'Quarter-Circle Pond Cutout (r = 10 m)', formula: '¼π(10²)', areaText: '−25π m²', isSubtract: true, icon: '💧' },
      { id: 'decoyFull', name: 'Full Circular Pond Cutout', formula: 'π(10²)', areaText: '−100π m²', isDecoy: true, icon: '⚪' }
    ],
    edges: [
      { id: 'topEdge', name: 'Top Plaza Edge (10 m)', length: '10 m', isBoundary: true, type: 'straight' },
      { id: 'rightEdge', name: 'Right Plaza Edge (10 m)', length: '10 m', isBoundary: true, type: 'straight' },
      { id: 'curvedPond', name: 'Curved Pond Water Rim (5π m)', length: '5π m', isBoundary: true, type: 'arc' },
      { id: 'interiorCross', name: 'Interior Center Marker Line', length: '5 m', isBoundary: false, type: 'interior' }
    ],
    correctAreaPieces: ['square', 'quadrant'],
    correctPerimeterEdges: ['topEdge', 'rightEdge', 'curvedPond'],
    summaryText: 'Total Area = 100 − 25π m² · Outer Fence Perimeter = 20 + 5π m',
    areaTargetText: '100 − 25π m²',
    perimeterTargetText: '20 + 5π m'
  }
];

export function TrackGardenBuilder({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('area'); // 'area' | 'perimeter'
  const [selectedPieces, setSelectedPieces] = useState(new Set());
  const [selectedEdges, setSelectedEdges] = useState(new Set());
  const [warningMsg, setWarningMsg] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [roundChecked, setRoundChecked] = useState(false);
  const [roundPassed, setRoundPassed] = useState(false);

  const curRound = ROUNDS[roundIdx];

  const togglePiece = id => {
    playClickSound();
    setWarningMsg(null);
    setRoundChecked(false);
    setSelectedPieces(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleEdge = edge => {
    playClickSound();
    setRoundChecked(false);
    if (!edge.isBoundary) {
      setWarningMsg(`⚠️ Notice: "${edge.name}" is an interior line inside the field! Interior lines never count for outer perimeter fencing.`);
      return;
    }
    setWarningMsg(null);
    setSelectedEdges(prev => {
      const next = new Set(prev);
      if (next.has(edge.id)) next.delete(edge.id);
      else next.add(edge.id);
      return next;
    });
  };

  const handleQuickAssemble = () => {
    playClickSound();
    setSelectedPieces(new Set(curRound.correctAreaPieces));
    setSelectedEdges(new Set(curRound.correctPerimeterEdges));
    setWarningMsg(null);
    setRoundChecked(false);
  };

  const isPiecesCorrect =
    curRound.correctAreaPieces.every(p => selectedPieces.has(p)) &&
    selectedPieces.size === curRound.correctAreaPieces.length;

  const isEdgesCorrect =
    curRound.correctPerimeterEdges.every(e => selectedEdges.has(e)) &&
    selectedEdges.size === curRound.correctPerimeterEdges.length;

  const handleVerify = () => {
    playClickSound();
    setRoundChecked(true);

    if (isPiecesCorrect && isEdgesCorrect) {
      playSuccessChime();
      setRoundPassed(true);
      if (roundIdx === ROUNDS.length - 1) {
        if (onComplete) onComplete();
      }
    } else {
      setRoundPassed(false);
      if (!isPiecesCorrect && !isEdgesCorrect) {
        setWarningMsg('Check both tabs! Verify the pieces in Step 1 (Area) and the perimeter edges in Step 2 (Fence).');
      } else if (!isPiecesCorrect) {
        setWarningMsg('Step 1 (Area) needs attention: make sure only valid sections are included without decoys.');
      } else {
        setWarningMsg('Step 2 (Fence) needs attention: select all outer boundary segments and exclude interior lines.');
      }
    }
  };

  const handleNextRound = () => {
    playClickSound();
    if (roundIdx < ROUNDS.length - 1) {
      setRoundIdx(roundIdx + 1);
      setActiveTab('area');
      setSelectedPieces(new Set());
      setSelectedEdges(new Set());
      setWarningMsg(null);
      setShowHint(false);
      setRoundChecked(false);
      setRoundPassed(false);
    }
  };

  // Status calculation for pills
  const hasAreaCorrect = isPiecesCorrect;
  const hasEdgesCorrect = isEdgesCorrect;

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-[#150a30]/85 border border-purple-400/30 rounded-2xl px-3 py-1.5 shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">🏟️</span>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm md:text-base font-black text-amber-300 block truncate">
              {curRound.title}
            </span>
            <span className="text-[11px] sm:text-xs text-purple-200 font-bold block truncate">
              {curRound.concept}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] sm:text-xs bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-full font-black cursor-pointer transition flex items-center gap-1"
          >
            <span>💡</span>
            <span>{showHint ? 'Hide Concept' : 'Concept Hint'}</span>
          </button>
          <span className="text-xs font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400/40">
            Part {curRound.round}/2
          </span>
        </div>
      </div>

      {/* Concept Hint Banner (Expandable) */}
      {showHint && (
        <div className="bg-amber-950/80 border border-amber-400/50 rounded-xl p-2 text-xs text-amber-100 font-bold shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">💡</span>
            <span>{curRound.hintText}</span>
          </div>
          <button
            onClick={handleQuickAssemble}
            className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full hover:bg-amber-300 cursor-pointer shrink-0"
          >
            Auto-Assemble
          </button>
        </div>
      )}

      {/* Main 2-Column Workspace: SVG Blueprint on Left, Controls on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 flex-1 min-h-0 overflow-hidden items-stretch">
        {/* Left Column: Live Interactive Blueprint Diagram (SVG) */}
        <div className="md:col-span-5 lg:col-span-6 bg-[#0c041f] border border-purple-400/30 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between items-center relative overflow-hidden">
          {/* Blueprint Title Badge */}
          <div className="w-full flex items-center justify-between text-xs font-black px-1 shrink-0 mb-1">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Interactive Blueprint
            </span>
            <span className="text-[11px] text-slate-300 font-bold">
              Tap parts or buttons to assemble
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="w-full flex-1 min-h-0 flex items-center justify-center relative">
            {roundIdx === 0 ? (
              /* ROUND 1: STADIUM TRACK SVG */
              <svg viewBox="0 0 380 180" className="w-full h-full max-h-44 sm:max-h-52 select-none">
                <defs>
                  {/* Grass pattern */}
                  <pattern id="turf_pat" width="12" height="12" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill="#064e3b" />
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#047857" strokeWidth="1" opacity="0.6" />
                  </pattern>
                  <filter id="fence_glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#facc15" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* West Semicircle (ArcWest) */}
                <path
                  d="M 90 40 A 50 50 0 0 0 90 140 Z"
                  onClick={() => togglePiece('semiA')}
                  className="cursor-pointer transition-all duration-300"
                  fill={selectedPieces.has('semiA') ? '#7c3aed' : '#23124d'}
                  fillOpacity={selectedPieces.has('semiA') ? 0.75 : 0.4}
                  stroke={selectedPieces.has('semiA') ? '#a855f7' : '#4c1d95'}
                  strokeWidth="2"
                />

                {/* East Semicircle (ArcEast) */}
                <path
                  d="M 290 40 A 50 50 0 0 1 290 140 Z"
                  onClick={() => togglePiece('semiB')}
                  className="cursor-pointer transition-all duration-300"
                  fill={selectedPieces.has('semiB') ? '#7c3aed' : '#23124d'}
                  fillOpacity={selectedPieces.has('semiB') ? 0.75 : 0.4}
                  stroke={selectedPieces.has('semiB') ? '#a855f7' : '#4c1d95'}
                  strokeWidth="2"
                />

                {/* Central Turf Rectangle */}
                <rect
                  x="90"
                  y="40"
                  width="200"
                  height="100"
                  rx="0"
                  onClick={() => togglePiece('rect')}
                  className="cursor-pointer transition-all duration-300"
                  fill={selectedPieces.has('rect') ? 'url(#turf_pat)' : '#132822'}
                  stroke={selectedPieces.has('rect') ? '#34d399' : '#1e3a34'}
                  strokeWidth="2"
                />

                {/* Pitch Midfield Line & Center Circle */}
                <line x1="190" y1="40" x2="190" y2="140" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <circle cx="190" cy="90" r="20" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />

                {/* Interior Dividing Lines (Not for Perimeter) */}
                <g onClick={() => toggleEdge(curRound.edges[4])} className="cursor-pointer">
                  <line x1="90" y1="40" x2="90" y2="140" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.8" />
                  <text x="82" y="93" fill="#fda4af" fontSize="10" fontWeight="900" textAnchor="end">14 m</text>
                </g>

                <g onClick={() => toggleEdge(curRound.edges[5])} className="cursor-pointer">
                  <line x1="290" y1="40" x2="290" y2="140" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.8" />
                  <text x="298" y="93" fill="#fda4af" fontSize="10" fontWeight="900" textAnchor="start">14 m</text>
                </g>

                {/* Top Outer Edge (Fence) */}
                <line
                  x1="90"
                  y1="40"
                  x2="290"
                  y2="40"
                  onClick={() => toggleEdge(curRound.edges[0])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('top') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('top') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('top') ? '6 2' : 'none'}
                  filter={selectedEdges.has('top') ? 'url(#fence_glow)' : 'none'}
                />

                {/* Bottom Outer Edge (Fence) */}
                <line
                  x1="90"
                  y1="140"
                  x2="290"
                  y2="140"
                  onClick={() => toggleEdge(curRound.edges[1])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('bot') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('bot') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('bot') ? '6 2' : 'none'}
                  filter={selectedEdges.has('bot') ? 'url(#fence_glow)' : 'none'}
                />

                {/* West Outer Curved Arc (Fence) */}
                <path
                  d="M 90 40 A 50 50 0 0 0 90 140"
                  fill="none"
                  onClick={() => toggleEdge(curRound.edges[2])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('arcWest') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('arcWest') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('arcWest') ? '6 2' : 'none'}
                  filter={selectedEdges.has('arcWest') ? 'url(#fence_glow)' : 'none'}
                />

                {/* East Outer Curved Arc (Fence) */}
                <path
                  d="M 290 40 A 50 50 0 0 1 290 140"
                  fill="none"
                  onClick={() => toggleEdge(curRound.edges[3])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('arcEast') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('arcEast') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('arcEast') ? '6 2' : 'none'}
                  filter={selectedEdges.has('arcEast') ? 'url(#fence_glow)' : 'none'}
                />

                {/* Labels & Dimension Annotations */}
                <text x="190" y="30" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="900">
                  Top Straight: 30 m {selectedEdges.has('top') ? '🔒 Fence' : ''}
                </text>
                <text x="190" y="160" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="900">
                  Bottom Straight: 30 m {selectedEdges.has('bot') ? '🔒 Fence' : ''}
                </text>
                <text x="45" y="93" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="900">
                  r = 7 m
                </text>
                <text x="335" y="93" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="900">
                  r = 7 m
                </text>
              </svg>
            ) : (
              /* ROUND 2: GARDEN BED CUTOUT SVG */
              <svg viewBox="0 0 380 180" className="w-full h-full max-h-44 sm:max-h-52 select-none">
                <defs>
                  <filter id="fence_glow_2" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#facc15" floodOpacity="0.9" />
                  </filter>
                  <radialGradient id="pond_grad" cx="20%" cy="80%" r="80%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </radialGradient>
                </defs>

                {/* Base Square Plaza (120, 20) to (260, 160) */}
                <rect
                  x="120"
                  y="20"
                  width="140"
                  height="140"
                  onClick={() => togglePiece('square')}
                  className="cursor-pointer transition-all duration-300"
                  fill={selectedPieces.has('square') ? '#b45309' : '#3f220d'}
                  fillOpacity={selectedPieces.has('square') ? 0.75 : 0.4}
                  stroke={selectedPieces.has('square') ? '#f59e0b' : '#78350f'}
                  strokeWidth="2"
                />

                {/* Quarter Circle Pond Cutout at Bottom-Left: radius 140 from (120, 160) */}
                <path
                  d="M 120 160 L 120 20 A 140 140 0 0 1 260 160 Z"
                  onClick={() => togglePiece('quadrant')}
                  className="cursor-pointer transition-all duration-300"
                  fill={selectedPieces.has('quadrant') ? 'url(#pond_grad)' : '#082f49'}
                  fillOpacity={selectedPieces.has('quadrant') ? 0.85 : 0.4}
                  stroke={selectedPieces.has('quadrant') ? '#38bdf8' : '#0284c7'}
                  strokeWidth="2"
                />

                {/* Water ripple decorative ring */}
                <path
                  d="M 120 160 L 120 70 A 90 90 0 0 1 210 160 Z"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.5"
                />

                {/* Top Outer Edge (Fence) */}
                <line
                  x1="120"
                  y1="20"
                  x2="260"
                  y2="20"
                  onClick={() => toggleEdge(curRound.edges[0])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('topEdge') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('topEdge') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('topEdge') ? '6 2' : 'none'}
                  filter={selectedEdges.has('topEdge') ? 'url(#fence_glow_2)' : 'none'}
                />

                {/* Right Outer Edge (Fence) */}
                <line
                  x1="260"
                  y1="20"
                  x2="260"
                  y2="160"
                  onClick={() => toggleEdge(curRound.edges[1])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('rightEdge') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('rightEdge') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('rightEdge') ? '6 2' : 'none'}
                  filter={selectedEdges.has('rightEdge') ? 'url(#fence_glow_2)' : 'none'}
                />

                {/* Curved Pond Rim (Fence) */}
                <path
                  d="M 120 20 A 140 140 0 0 1 260 160"
                  fill="none"
                  onClick={() => toggleEdge(curRound.edges[2])}
                  className="cursor-pointer transition-all duration-300"
                  stroke={selectedEdges.has('curvedPond') ? '#facc15' : '#64748b'}
                  strokeWidth={selectedEdges.has('curvedPond') ? 4.5 : 2}
                  strokeDasharray={selectedEdges.has('curvedPond') ? '6 2' : 'none'}
                  filter={selectedEdges.has('curvedPond') ? 'url(#fence_glow_2)' : 'none'}
                />

                {/* Dimension labels */}
                <text x="190" y="14" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="900">
                  Top Edge: 10 m {selectedEdges.has('topEdge') ? '🔒 Fence' : ''}
                </text>
                <text x="270" y="95" textAnchor="start" fill="#facc15" fontSize="12" fontWeight="900">
                  Right Edge: 10 m
                </text>
                <text x="190" y="105" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900">
                  Pond Curved Rim (5π m)
                </text>
              </svg>
            )}
          </div>

          {/* Bottom Diagram Key / Legend */}
          <div className="w-full flex items-center justify-around bg-black/40 rounded-xl px-2 py-1 border border-white/10 text-[11px] font-bold shrink-0 mt-1">
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-3 h-2 rounded bg-emerald-500 inline-block" />
              Turf / Base Area
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-3 h-0.5 bg-amber-400 inline-block" />
              Outer Fence
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-3 h-0.5 border-b border-rose-400 border-dashed inline-block" />
              Interior (No Fence)
            </span>
          </div>
        </div>

        {/* Right Column: 2-Step Interactive Assembly Studio */}
        <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-between gap-2 overflow-hidden">
          {/* Step Selector Tabs: Area vs Perimeter */}
          <div className="grid grid-cols-2 gap-2 bg-[#100624] p-1 rounded-2xl border border-purple-400/30 shrink-0">
            <button
              onClick={() => setActiveTab('area')}
              className={`py-2 px-3 rounded-xl font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
                activeTab === 'area'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>1. Turf Area Ledger</span>
              {hasAreaCorrect ? (
                <span className="bg-emerald-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">✓ OK</span>
              ) : (
                <span className="text-[11px] text-cyan-200">({selectedPieces.size} items)</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('perimeter')}
              className={`py-2 px-3 rounded-xl font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
                activeTab === 'perimeter'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>2. Outer Perimeter Fence</span>
              {hasEdgesCorrect ? (
                <span className="bg-emerald-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">✓ OK</span>
              ) : (
                <span className="text-[11px] text-amber-200">({selectedEdges.size} edges)</span>
              )}
            </button>
          </div>

          {/* Tab Content 1: Area Ledger */}
          {activeTab === 'area' && (
            <div className="bg-[#14072f] border border-purple-400/30 rounded-2xl p-2.5 flex flex-col justify-between flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
                <div className="flex items-center justify-between text-xs font-black text-purple-200 mb-0.5">
                  <span>Select composite pieces to calculate total area:</span>
                  <span className="text-amber-300">Target: {curRound.areaTargetText}</span>
                </div>

                {curRound.pieces.map(p => {
                  const isSelected = selectedPieces.has(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePiece(p.id)}
                      className={`px-3 py-2 rounded-xl border flex items-center justify-between text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/80 text-white shadow-sm ring-1 ring-cyan-400/40'
                          : p.isDecoy
                          ? 'border-white/10 bg-white/5 text-slate-300 hover:border-rose-400/40'
                          : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        <span className="text-base shrink-0">{p.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold truncate leading-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">Formula: {p.formula}</p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                          {p.areaText}
                        </span>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-400'
                        }`}>
                          {isSelected ? '✓' : '+'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Area Concept Insight Callout */}
              <div className="bg-black/50 border border-white/10 rounded-xl p-2 text-[11px] sm:text-xs text-slate-200 font-extrabold mt-1.5 shrink-0">
                <span className="text-cyan-300 font-black">Rule: </span>
                {roundIdx === 0
                  ? 'Add connected shapes! Two semicircles combine to equal one full circle: ½πr² + ½πr² = πr² = 154 m².'
                  : 'Subtract cutouts! Central Bed Area = Square Plaza (100 m²) minus quarter-circle pond (25π m²).'}
              </div>
            </div>
          )}

          {/* Tab Content 2: Perimeter Fencing */}
          {activeTab === 'perimeter' && (
            <div className="bg-[#14072f] border border-purple-400/30 rounded-2xl p-2.5 flex flex-col justify-between flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
                <div className="flex items-center justify-between text-xs font-black text-amber-200 mb-0.5">
                  <span>Select outer boundaries for the security fence:</span>
                  <span className="text-amber-300">Target: {curRound.perimeterTargetText}</span>
                </div>

                {curRound.edges.map(e => {
                  const isSelected = selectedEdges.has(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggleEdge(e)}
                      className={`px-3 py-2 rounded-xl border flex items-center justify-between text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/80 text-white shadow-sm ring-1 ring-amber-400/40'
                          : !e.isBoundary
                          ? 'border-rose-400/20 bg-rose-950/20 text-slate-300 hover:border-rose-400/50'
                          : 'border-white/15 bg-white/5 text-slate-200 hover:border-amber-400/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        <span className="text-base shrink-0">
                          {isSelected ? '🔒' : !e.isBoundary ? '🚫' : '○'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold truncate leading-tight">{e.name}</p>
                          <p className={`text-[10px] truncate ${!e.isBoundary ? 'text-rose-300 font-bold' : 'text-slate-400'}`}>
                            {!e.isBoundary ? 'Interior Field Line (Do NOT fence)' : `Length: ${e.length}`}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                          {isSelected ? 'Fenced ✓' : !e.isBoundary ? 'Interior' : '+ Fence'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Perimeter Concept Insight Callout */}
              <div className="bg-black/50 border border-white/10 rounded-xl p-2 text-[11px] sm:text-xs text-slate-200 font-extrabold mt-1.5 shrink-0">
                <span className="text-amber-300 font-black">Perimeter Rule: </span>
                Fences ONLY surround the outside boundary! Athletes run across interior lines, so they are NEVER fenced.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warnings & Bottom Verification Bar */}
      <div className="bg-[#110729] border border-purple-400/40 rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1.5 shrink-0">
        {warningMsg && <Msg type="warning">{warningMsg}</Msg>}

        <div className="flex items-center justify-between gap-2">
          {/* Status Feedback readout */}
          <div className="min-w-0 flex-1">
            {roundChecked ? (
              roundPassed ? (
                <div className="text-xs sm:text-sm text-emerald-300 font-black flex items-center gap-1.5">
                  <span className="text-base">✓</span>
                  <span>Correct Blueprint! {curRound.summaryText}</span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-rose-300 font-bold">
                  Review selections: Area must equal {curRound.areaTargetText} and Outer Fence must equal {curRound.perimeterTargetText}.
                </div>
              )
            ) : (
              <div className="text-xs sm:text-sm text-slate-200 font-extrabold truncate">
                {hasAreaCorrect && hasEdgesCorrect ? (
                  <span className="text-emerald-300 font-black">All blueprint elements ready! Click Verify Blueprint.</span>
                ) : (
                  <span>Select correct pieces in Step 1 and outer fence segments in Step 2.</span>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {!roundPassed ? (
              <GoldBtn onClick={handleVerify} className="py-2 px-5 text-xs sm:text-sm font-black shadow-md">
                Verify Blueprint
              </GoldBtn>
            ) : roundIdx < ROUNDS.length - 1 ? (
              <button
                onClick={handleNextRound}
                className="btn-gold text-xs sm:text-sm py-2 px-5 shadow-md hover:scale-105 transition cursor-pointer font-black"
              >
                Proceed to Round 2 →
              </button>
            ) : (
              <div className="bg-emerald-500/25 text-emerald-300 font-black text-xs sm:text-sm px-4 py-2 rounded-full border border-emerald-400 flex items-center gap-1.5 shadow-md">
                <span>🎉</span>
                <span>Station C Mastered!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
