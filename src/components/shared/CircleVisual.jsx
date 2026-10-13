import React from 'react';

/**
 * Pure SVG circle and geometry diagram renderer for OrbitQuest.
 * Designed with high contrast, crystal clear labeling, and beautiful night-fair theme.
 */

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees % 360) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy - r * Math.sin(angleInRadians)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const diff = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = diff <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function describeSectorPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const diff = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = diff <= 180 ? '0' : '1';

  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ');
}

export function CircleVisual({ type = 'circle', data = {}, compact = false }) {
  const width = compact ? 320 : 420;
  const height = compact ? 200 : 250;
  const cx = width / 2;
  const cy = height / 2;

  const strokeWidth = compact ? 2.5 : 3.5;
  const arcStrokeWidth = compact ? 4 : 5;
  const fontSize = compact ? 13 : 16;
  const titleSize = compact ? 15 : 18;

  switch (type) {
    /* ------------------------------------------------ 1. Circle Parts */
    case 'parts': {
      const highlight = (data.highlight || 'radius').toLowerCase();
      const r = compact ? 65 : 85;

      const pRadiusEnd = polarToCartesian(cx, cy, r, 45);
      const pDiaA = polarToCartesian(cx, cy, r, 180);
      const pDiaB = polarToCartesian(cx, cy, r, 0);
      const pChordA = polarToCartesian(cx, cy, r, 210);
      const pChordB = polarToCartesian(cx, cy, r, 300);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <defs>
            <filter id="circ_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#facc15" floodOpacity="0.8" />
            </filter>
            <filter id="arc_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#fb923c" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Base Circle outline */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="#180c38"
            stroke={highlight === 'circumference' ? '#fb923c' : '#475569'}
            strokeWidth={highlight === 'circumference' ? arcStrokeWidth + 2 : strokeWidth}
            strokeDasharray={highlight === 'circumference' ? 'none' : '4 3'}
            filter={highlight === 'circumference' ? 'url(#arc_glow)' : undefined}
          />

          {/* Sector Highlight */}
          {highlight === 'sector' && (
            <path
              d={describeSectorPath(cx, cy, r, 0, 75)}
              fill="#c084fc"
              fillOpacity="0.45"
              stroke="#c084fc"
              strokeWidth={arcStrokeWidth}
            />
          )}

          {/* Segment Highlight */}
          {highlight === 'segment' && (
            <path
              d={`M ${pChordA.x} ${pChordA.y} A ${r} ${r} 0 0 0 ${pChordB.x} ${pChordB.y} Z`}
              fill="#f43f5e"
              fillOpacity="0.45"
              stroke="#f43f5e"
              strokeWidth={arcStrokeWidth}
            />
          )}

          {/* Arc Highlight */}
          {highlight === 'arc' && (
            <path
              d={describeArc(cx, cy, r, 20, 110)}
              fill="none"
              stroke="#fb923c"
              strokeWidth={arcStrokeWidth + 2}
              strokeLinecap="round"
              filter="url(#arc_glow)"
            />
          )}

          {/* Diameter line */}
          {(highlight === 'diameter' || highlight === 'radius') && (
            <line
              x1={pDiaA.x}
              y1={pDiaA.y}
              x2={highlight === 'radius' ? cx : pDiaB.x}
              y2={highlight === 'radius' ? cy : pDiaB.y}
              stroke={highlight === 'diameter' ? '#facc15' : '#38bdf8'}
              strokeWidth={highlight === 'diameter' ? arcStrokeWidth : strokeWidth}
              filter={highlight === 'diameter' ? 'url(#circ_glow)' : undefined}
            />
          )}

          {/* Radius line */}
          {highlight === 'radius' && (
            <line
              x1={cx}
              y1={cy}
              x2={pRadiusEnd.x}
              y2={pRadiusEnd.y}
              stroke="#38bdf8"
              strokeWidth={arcStrokeWidth}
              strokeLinecap="round"
              filter="url(#circ_glow)"
            />
          )}

          {/* Chord line */}
          {highlight === 'chord' && (
            <line
              x1={pChordA.x}
              y1={pChordA.y}
              x2={pChordB.x}
              y2={pChordB.y}
              stroke="#22d3ee"
              strokeWidth={arcStrokeWidth}
              strokeLinecap="round"
              filter="url(#circ_glow)"
            />
          )}

          {/* Center point */}
          <circle cx={cx} cy={cy} r={compact ? 5 : 6} fill="#facc15" />
          <text x={cx + 10} y={cy - 10} fill="#fde047" fontSize={fontSize} fontWeight="900">O</text>

          {/* Highlight Badge Label */}
          <g transform={`translate(${cx}, ${height - 18})`}>
            <rect
              x="-80"
              y="-14"
              width="160"
              height="28"
              rx="14"
              fill="#1e0e45"
              stroke="#facc15"
              strokeWidth="2"
            />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#facc15"
              fontSize={titleSize}
              fontWeight="900"
              letterSpacing="0.5"
            >
              {highlight.toUpperCase()}
            </text>
          </g>
        </svg>
      );
    }

    /* ------------------------------------------------ 2. Whole Circle with Radius or Diameter */
    case 'circle': {
      const r = compact ? 65 : 85;
      const show = data.show || 'radius';
      const val = data.r !== undefined ? data.r : (data.d ? data.d / 2 : 7);
      const unit = data.unit || 'cm';
      const labelText = show === 'diameter'
        ? (data.d ? `d = ${data.d} ${unit}` : `d = ${val * 2} ${unit}`)
        : `r = ${val} ${unit}`;

      const pRight = { x: cx + r, y: cy };
      const pLeft = { x: cx - r, y: cy };

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <defs>
            <radialGradient id="circ_bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#2a1458" />
              <stop offset="100%" stop-color="#14072f" />
            </radialGradient>
          </defs>

          {/* Circle area */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="url(#circ_bg)"
            stroke="#a855f7"
            strokeWidth={strokeWidth}
          />

          {/* Measure line */}
          {show === 'diameter' ? (
            <>
              <line
                x1={pLeft.x}
                y1={cy}
                x2={pRight.x}
                y2={cy}
                stroke="#38bdf8"
                strokeWidth={strokeWidth + 1}
                strokeDasharray="5 3"
              />
              <circle cx={pLeft.x} cy={cy} r="4" fill="#38bdf8" />
              <circle cx={pRight.x} cy={cy} r="4" fill="#38bdf8" />
            </>
          ) : (
            <>
              <line
                x1={cx}
                y1={cy}
                x2={pRight.x}
                y2={cy}
                stroke="#38bdf8"
                strokeWidth={strokeWidth + 1}
              />
              <circle cx={pRight.x} cy={cy} r="4" fill="#38bdf8" />
            </>
          )}

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="5" fill="#facc15" />
          <text x={cx - 14} y={cy - 10} fill="#fde047" fontSize={fontSize} fontWeight="800">O</text>

          {/* Dimension Label */}
          <g transform={`translate(${show === 'diameter' ? cx : cx + r / 2}, ${cy - 16})`}>
            <rect
              x="-50"
              y="-13"
              width="100"
              height="26"
              rx="13"
              fill="#0e0422"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize={fontSize}
              fontWeight="900"
            >
              {labelText}
            </text>
          </g>

          {/* Subtext info */}
          {data.subtext && (
            <text x={cx} y={height - 12} textAnchor="middle" fill="#facc15" fontSize={fontSize - 2} fontWeight="800">
              {data.subtext}
            </text>
          )}
        </svg>
      );
    }

    /* ------------------------------------------------ 3. Sector & Arc */
    case 'sector': {
      const r = compact ? 65 : 82;
      const deg = data.deg || 90;
      const radiusVal = data.r || 7;
      const unit = data.unit || 'm';
      const unknown = data.unknown || 'none'; // 'arc' | 'area' | 'angle' | 'r'

      const pStart = polarToCartesian(cx, cy, r, 0);
      const pEnd = polarToCartesian(cx, cy, r, deg);
      const midAngle = deg / 2;
      const pAngleLabel = polarToCartesian(cx, cy, compact ? 28 : 34, midAngle);
      const pArcLabel = polarToCartesian(cx, cy, r + (compact ? 22 : 26), midAngle);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <defs>
            <filter id="sector_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fb923c" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Ghost full circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="#120629"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Shaded Sector */}
          <path
            d={describeSectorPath(cx, cy, r, 0, deg)}
            fill="#a855f7"
            fillOpacity="0.38"
            stroke="#c084fc"
            strokeWidth={strokeWidth}
          />

          {/* Highlighted Curved Arc */}
          <path
            d={describeArc(cx, cy, r, 0, deg)}
            fill="none"
            stroke="#fb923c"
            strokeWidth={arcStrokeWidth + 1}
            strokeLinecap="round"
            filter="url(#sector_glow)"
          />

          {/* Central Angle Arc indicator */}
          <path
            d={describeArc(cx, cy, compact ? 22 : 28, 0, deg)}
            fill="none"
            stroke="#facc15"
            strokeWidth="2.5"
          />

          {/* Angle label */}
          <text
            x={pAngleLabel.x}
            y={pAngleLabel.y + 4}
            textAnchor="middle"
            fill="#facc15"
            fontSize={fontSize}
            fontWeight="900"
          >
            {unknown === 'angle' ? 'x° = ?' : `${deg}°`}
          </text>

          {/* Radius label */}
          <g transform={`translate(${cx + r / 2}, ${cy + 16})`}>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize={fontSize - 1}
              fontWeight="900"
            >
              {unknown === 'r' ? 'r = ?' : `r = ${radiusVal} ${unit}`}
            </text>
          </g>

          {/* Arc label */}
          <g transform={`translate(${pArcLabel.x}, ${pArcLabel.y})`}>
            <rect
              x="-45"
              y="-12"
              width="90"
              height="24"
              rx="12"
              fill="#0e0422"
              stroke="#fb923c"
              strokeWidth="2"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#fb923c"
              fontSize={fontSize - 1}
              fontWeight="900"
            >
              {unknown === 'arc' ? 'Arc = ?' : (data.arcLabel || 'Arc')}
            </text>
          </g>

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="5" fill="#facc15" />

          {/* Area label if specified or unknown */}
          {unknown === 'area' && (
            <g transform={`translate(${cx + r * 0.45 * Math.cos(midAngle * Math.PI / 180)}, ${cy - r * 0.45 * Math.sin(midAngle * Math.PI / 180)})`}>
              <rect x="-42" y="-12" width="84" height="24" rx="12" fill="#1e0a44" stroke="#c084fc" strokeWidth="2"/>
              <text x="0" y="4" textAnchor="middle" fill="#c084fc" fontSize={fontSize - 2} fontWeight="900">
                Area = ?
              </text>
            </g>
          )}
        </svg>
      );
    }

    /* ------------------------------------------------ 4. Semicircle */
    case 'semicircle': {
      const r = compact ? 70 : 90;
      const radiusVal = data.r || 7;
      const unit = data.unit || 'cm';
      const baseCy = cy + (compact ? 25 : 35);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <defs>
            <filter id="semi_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Shaded Semicircle */}
          <path
            d={`M ${cx - r} ${baseCy} A ${r} ${r} 0 0 1 ${cx + r} ${baseCy} Z`}
            fill="#38bdf8"
            fillOpacity="0.25"
            stroke="#38bdf8"
            strokeWidth={strokeWidth}
          />

          {/* Curved boundary arc */}
          <path
            d={`M ${cx - r} ${baseCy} A ${r} ${r} 0 0 1 ${cx + r} ${baseCy}`}
            fill="none"
            stroke="#fb923c"
            strokeWidth={arcStrokeWidth}
            strokeLinecap="round"
          />

          {/* Straight diameter base */}
          <line
            x1={cx - r}
            y1={baseCy}
            x2={cx + r}
            y2={baseCy}
            stroke="#facc15"
            strokeWidth={arcStrokeWidth - 1}
          />

          {/* Center dot */}
          <circle cx={cx} cy={baseCy} r="5" fill="#facc15" />

          {/* Dimension labels */}
          <g transform={`translate(${cx}, ${baseCy + 22})`}>
            <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#0c0420" stroke="#facc15" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#facc15" fontSize={fontSize - 1} fontWeight="900">
              Diameter = {radiusVal * 2} {unit}
            </text>
          </g>

          <g transform={`translate(${cx}, ${baseCy - r - 12})`}>
            <rect x="-55" y="-12" width="110" height="24" rx="12" fill="#0c0420" stroke="#fb923c" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#fb923c" fontSize={fontSize - 1} fontWeight="900">
              Curved Arc = πr
            </text>
          </g>
        </svg>
      );
    }

    /* ------------------------------------------------ 5. Quadrant */
    case 'quadrant': {
      const r = compact ? 75 : 95;
      const radiusVal = data.r || 10;
      const unit = data.unit || 'm';
      const originX = cx - (compact ? 35 : 45);
      const originY = cy + (compact ? 35 : 45);

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          {/* Shaded Quadrant */}
          <path
            d={`M ${originX} ${originY} L ${originX + r} ${originY} A ${r} ${r} 0 0 0 ${originX} ${originY - r} Z`}
            fill="#a855f7"
            fillOpacity="0.25"
            stroke="#c084fc"
            strokeWidth={strokeWidth}
          />

          {/* Curved arc */}
          <path
            d={`M ${originX + r} ${originY} A ${r} ${r} 0 0 0 ${originX} ${originY - r}`}
            fill="none"
            stroke="#fb923c"
            strokeWidth={arcStrokeWidth}
            strokeLinecap="round"
          />

          {/* Two straight edges */}
          <line x1={originX} y1={originY} x2={originX + r} y2={originY} stroke="#38bdf8" strokeWidth={strokeWidth + 1} />
          <line x1={originX} y1={originY} x2={originX} y2={originY - r} stroke="#38bdf8" strokeWidth={strokeWidth + 1} />

          {/* 90 degree corner square */}
          <path
            d={`M ${originX + 18} ${originY} L ${originX + 18} ${originY - 18} L ${originX} ${originY - 18}`}
            fill="none"
            stroke="#facc15"
            strokeWidth="2.5"
          />

          {/* Center dot */}
          <circle cx={originX} cy={originY} r="5" fill="#facc15" />

          {/* Radius labels */}
          <text x={originX + r / 2} y={originY + 20} textAnchor="middle" fill="#38bdf8" fontSize={fontSize} fontWeight="900">
            r = {radiusVal} {unit}
          </text>
          <text x={originX - 22} y={originY - r / 2} textAnchor="middle" fill="#38bdf8" fontSize={fontSize} fontWeight="900">
            r = {radiusVal} {unit}
          </text>

          {/* Arc label */}
          <g transform={`translate(${originX + r * 0.75}, ${originY - r * 0.75})`}>
            <rect x="-35" y="-12" width="70" height="24" rx="12" fill="#0e0422" stroke="#fb923c" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#fb923c" fontSize={fontSize - 2} fontWeight="900">
              1/4 Circumf.
            </text>
          </g>
        </svg>
      );
    }

    /* ------------------------------------------------ 6. Composite Figures */
    case 'composite': {
      const kind = data.kind || 'stadium';
      const unit = data.unit || 'm';

      if (kind === 'stadium') {
        const straightL = compact ? 120 : 160;
        const semiR = compact ? 42 : 55;
        const rVal = data.r || 7;
        const lengthVal = data.length || 30;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
            {/* Shaded Stadium Track */}
            <path
              d={`
                M ${cx - straightL / 2} ${cy - semiR}
                L ${cx + straightL / 2} ${cy - semiR}
                A ${semiR} ${semiR} 0 0 1 ${cx + straightL / 2} ${cy + semiR}
                L ${cx - straightL / 2} ${cy + semiR}
                A ${semiR} ${semiR} 0 0 1 ${cx - straightL / 2} ${cy - semiR}
                Z
              `}
              fill="#10b981"
              fillOpacity="0.22"
              stroke="#fb923c"
              strokeWidth={arcStrokeWidth}
            />

            {/* Interior dashed boundary lines (DO NOT count in perimeter) */}
            <line
              x1={cx - straightL / 2}
              y1={cy - semiR}
              x2={cx - straightL / 2}
              y2={cy + semiR}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <line
              x1={cx + straightL / 2}
              y1={cy - semiR}
              x2={cx + straightL / 2}
              y2={cy + semiR}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Top & Bottom straight labels */}
            <text x={cx} y={cy - semiR - 10} textAnchor="middle" fill="#38bdf8" fontSize={fontSize} fontWeight="900">
              Straight = {lengthVal} {unit}
            </text>
            <text x={cx} y={cy + semiR + 22} textAnchor="middle" fill="#38bdf8" fontSize={fontSize} fontWeight="900">
              Straight = {lengthVal} {unit}
            </text>

            {/* Semicircle radius labels */}
            <text x={cx + straightL / 2 + semiR + 10} y={cy + 5} textAnchor="start" fill="#fb923c" fontSize={fontSize - 2} fontWeight="900">
              r = {rVal} {unit}
            </text>
            <text x={cx - straightL / 2 - semiR - 10} y={cy + 5} textAnchor="end" fill="#fb923c" fontSize={fontSize - 2} fontWeight="900">
              r = {rVal} {unit}
            </text>

            {/* Notice pill */}
            <g transform={`translate(${cx}, ${cy})`}>
              <rect x="-60" y="-12" width="120" height="24" rx="12" fill="#0f0728" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill="#cbd5e1" fontSize={fontSize - 3} fontWeight="800">
                Interior (not in fence)
              </text>
            </g>
          </svg>
        );
      }

      if (kind === 'square-quadrant') {
        const sideL = compact ? 100 : 130;
        const sideVal = data.side || 10;
        const ox = cx - sideL / 2;
        const oy = cy - sideL / 2;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
            {/* Base square minus corner quadrant */}
            <path
              d={`
                M ${ox} ${oy}
                L ${ox + sideL} ${oy}
                L ${ox + sideL} ${oy + sideL}
                L ${ox} ${oy + sideL}
                Z
              `}
              fill="#1e143c"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Shaded remaining garden bed */}
            <path
              d={`
                M ${ox} ${oy}
                L ${ox + sideL} ${oy}
                L ${ox + sideL} ${oy + sideL}
                A ${sideL} ${sideL} 0 0 1 ${ox} ${oy}
                Z
              `}
              fill="#38bdf8"
              fillOpacity="0.3"
              stroke="#38bdf8"
              strokeWidth={strokeWidth}
            />

            {/* Curved cut-out Pond Arc */}
            <path
              d={`M ${ox + sideL} ${oy + sideL} A ${sideL} ${sideL} 0 0 1 ${ox} ${oy}`}
              fill="none"
              stroke="#fb923c"
              strokeWidth={arcStrokeWidth}
            />

            {/* Labels */}
            <text x={cx} y={oy - 8} textAnchor="middle" fill="#facc15" fontSize={fontSize} fontWeight="900">
              Square side = {sideVal} {unit}
            </text>
            <text x={ox + sideL + 20} y={cy} textAnchor="start" fill="#facc15" fontSize={fontSize} fontWeight="900">
              {sideVal} {unit}
            </text>
            <text x={cx - 15} y={cy + 25} textAnchor="middle" fill="#fb923c" fontSize={fontSize - 2} fontWeight="900">
              Quarter-Circle Pond
            </text>
          </svg>
        );
      }

      if (kind === 'ring' || kind === 'annulus') {
        const R = compact ? 70 : 90;
        const rIn = compact ? 40 : 52;
        const RVal = data.R || 10;
        const rInVal = data.rIn || 6;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
            {/* Outer circle fill */}
            <circle cx={cx} cy={cy} r={R} fill="#c084fc" fillOpacity="0.35" stroke="#c084fc" strokeWidth={strokeWidth} />
            {/* Inner hole */}
            <circle cx={cx} cy={cy} r={rIn} fill="#14072b" stroke="#f43f5e" strokeWidth={strokeWidth} />

            {/* Center dot */}
            <circle cx={cx} cy={cy} r="4" fill="#facc15" />

            {/* Radii lines */}
            <line x1={cx} y1={cy} x2={cx + rIn} y2={cy} stroke="#f43f5e" strokeWidth="2.5" />
            <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke="#c084fc" strokeWidth="2.5" />

            <text x={cx + rIn / 2} y={cy + 16} textAnchor="middle" fill="#f43f5e" fontSize={fontSize - 2} fontWeight="900">
              r = {rInVal} {unit}
            </text>
            <text x={cx + 25} y={cy - R / 2} textAnchor="start" fill="#c084fc" fontSize={fontSize - 2} fontWeight="900">
              R = {RVal} {unit}
            </text>
          </svg>
        );
      }

      // Default rect-semi
      const rectW = compact ? 100 : 130;
      const rectH = compact ? 60 : 80;
      const semiR = rectH / 2;
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <path
            d={`
              M ${cx - rectW / 2} ${cy - rectH / 2}
              L ${cx + rectW / 2} ${cy - rectH / 2}
              A ${semiR} ${semiR} 0 0 1 ${cx + rectW / 2} ${cy + rectH / 2}
              L ${cx - rectW / 2} ${cy + rectH / 2}
              Z
            `}
            fill="#38bdf8"
            fillOpacity="0.25"
            stroke="#fb923c"
            strokeWidth={arcStrokeWidth}
          />
          <line
            x1={cx + rectW / 2}
            y1={cy - rectH / 2}
            x2={cx + rectW / 2}
            y2={cy + rectH / 2}
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text x={cx} y={cy - rectH / 2 - 10} textAnchor="middle" fill="#38bdf8" fontSize={fontSize} fontWeight="900">
            {data.length || 10} {unit}
          </text>
          <text x={cx - rectW / 2 - 25} y={cy + 4} textAnchor="middle" fill="#38bdf8" fontSize={fontSize} fontWeight="900">
            {data.width || 6} {unit}
          </text>
        </svg>
      );
    }

    /* ------------------------------------------------ 7. Giant Wheel Wonder Visual */
    case 'wheel-arc': {
      const r = compact ? 68 : 88;
      const cabins = [0, 45, 90, 135, 180, 225, 270, 315];

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <defs>
            <filter id="wheel_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#facc15" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Support A-frame legs */}
          <line x1={cx} y1={cy} x2={cx - 50} y2={height - 10} stroke="#475569" strokeWidth="4" />
          <line x1={cx} y1={cy} x2={cx + 50} y2={height - 10} stroke="#475569" strokeWidth="4" />

          {/* Wheel rim */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7c3aed" strokeWidth="3" />

          {/* Spokes */}
          {cabins.map(deg => {
            const p = polarToCartesian(cx, cy, r, deg);
            return (
              <line
                key={deg}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#6366f1"
                strokeWidth="1.5"
                opacity="0.7"
              />
            );
          })}

          {/* 12 o'clock (90 deg) to 3 o'clock (0 deg) quarter-turn arc */}
          <path
            d={describeArc(cx, cy, r, 0, 90)}
            fill="none"
            stroke="#facc15"
            strokeWidth={arcStrokeWidth + 2}
            strokeLinecap="round"
            filter="url(#wheel_glow)"
          />

          {/* Cabins */}
          {cabins.map(deg => {
            const p = polarToCartesian(cx, cy, r, deg);
            const isTarget = deg === 0 || deg === 90;
            return (
              <g key={deg} transform={`translate(${p.x}, ${p.y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={isTarget ? 9 : 6}
                  fill={isTarget ? '#facc15' : '#38bdf8'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {isTarget && (
                  <text y="3" textAnchor="middle" fill="#000" fontSize="8" fontWeight="900">
                    {deg === 90 ? '12h' : '3h'}
                  </text>
                )}
              </g>
            );
          })}

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r="8" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />

          {/* Arc Length Question Tag */}
          <g transform={`translate(${cx + r * 0.75}, ${cy - r * 0.75})`}>
            <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#1e0a44" stroke="#facc15" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#facc15" fontSize={fontSize - 2} fontWeight="900">
              Arc = ?
            </text>
          </g>

          {/* Radius callout */}
          <g transform={`translate(${cx - 35}, ${cy - 15})`}>
            <text x="0" y="0" fill="#38bdf8" fontSize={fontSize - 2} fontWeight="900">
              r = 14 m
            </text>
          </g>
        </svg>
      );
    }

    default:
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
          <circle cx={cx} cy={cy} r="60" fill="#2d1b6b" stroke="#facc15" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="4" fill="#facc15" />
        </svg>
      );
  }
}
