import { frac, asFrac, add, sub, mul, div, eq, toNumber, isInt, isHalf, decimalsAtMost } from './frac.js';

export const RADII = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24, 28];
export const ANGLES = [30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300];
export const SEVEN_RADII = RADII.filter(r => r % 7 === 0); // 7, 14, 21, 28

export const PI_MODES = {
  TERMS: 'terms',
  SEVEN: '22/7',
  DECIMAL: '3.14'
};

export const PI_VALUE = {
  '22/7': frac(22, 7),
  '3.14': frac(314, 100)
};

export const Q = (pi = 0, k = 0) => ({
  pi: asFrac(pi),
  k: asFrac(k)
});

export const qAdd = (a, b) => Q(add(a.pi, b.pi), add(a.k, b.k));
export const qSub = (a, b) => Q(sub(a.pi, b.pi), sub(a.k, b.k));
export const qScale = (a, f) => Q(mul(a.pi, f), mul(a.k, f));
export const qEq = (a, b) => eq(a.pi, b.pi) && eq(a.k, b.k);

// Basic Circle Measures
export const circumference = r => Q(2 * r, 0);
export const area = r => Q(r * r, 0);
export const arcLength = (r, deg) => qScale(circumference(r), frac(deg, 360));
export const sectorArea = (r, deg) => qScale(area(r), frac(deg, 360));
export const semicirclePerimeter = r => qAdd(arcLength(r, 180), Q(0, 2 * r));
export const semicircleArea = r => qScale(area(r), frac(1, 2));
export const quadrantPerimeter = r => qAdd(arcLength(r, 90), Q(0, 2 * r));
export const quadrantArea = r => qScale(area(r), frac(1, 4));
export const annulusArea = (R, r) => Q(R * R - r * r, 0);
export const segmentLiteArea = r => qSub(sectorArea(r, 90), Q(0, frac(r * r, 2)));

// Evaluate under a π convention
export function evaluate(q, mode) {
  if (mode === PI_MODES.TERMS) return q;
  const piVal = PI_VALUE[mode];
  if (!piVal) return q;
  return add(mul(q.pi, piVal), q.k);
}

// Clean answer check
export function isCleanAnswer(q, mode) {
  if (mode === PI_MODES.TERMS) {
    return isHalf(q.pi) && decimalsAtMost(q.k, 1);
  }
  const v = evaluate(q, mode);
  return mode === PI_MODES.SEVEN ? isHalf(v) : decimalsAtMost(v, 2);
}

export function modeAllowed(mode, radii) {
  if (mode !== PI_MODES.SEVEN) return true;
  const list = Array.isArray(radii) ? radii : [radii];
  return list.every(r => r % 7 === 0);
}

// Format fractional number nicely
function fmtFracNumber(f) {
  const fa = asFrac(f);
  if (fa.d === 1) return `${fa.n}`;
  const num = toNumber(fa);
  if (decimalsAtMost(fa, 2)) {
    return num.toString();
  }
  return `${fa.n}/${fa.d}`;
}

export function fmtQuantity(q, mode, unit = '') {
  const unitSuffix = unit ? ` ${unit}` : '';
  if (mode === PI_MODES.TERMS) {
    const hasPi = q.pi.n !== 0;
    const hasK = q.k.n !== 0;

    let piStr = '';
    if (hasPi) {
      if (eq(q.pi, frac(1, 1))) piStr = 'π';
      else if (eq(q.pi, frac(-1, 1))) piStr = '-π';
      else piStr = `${fmtFracNumber(q.pi)}π`;
    }

    if (!hasPi && !hasK) return `0${unitSuffix}`;
    if (!hasK) return `${piStr}${unitSuffix}`;
    if (!hasPi) return `${fmtFracNumber(q.k)}${unitSuffix}`;

    // Both Pi and K
    const kVal = toNumber(q.k);
    if (kVal > 0 && q.pi.n > 0) {
      return `(${fmtFracNumber(q.k)} + ${piStr})${unitSuffix}`;
    } else if (kVal > 0 && q.pi.n < 0) {
      const posPi = fmtFracNumber(frac(Math.abs(q.pi.n), q.pi.d));
      const posPiStr = posPi === '1' ? 'π' : `${posPi}π`;
      return `(${fmtFracNumber(q.k)} − ${posPiStr})${unitSuffix}`;
    } else if (kVal < 0 && q.pi.n > 0) {
      return `(${piStr} − ${Math.abs(kVal)})${unitSuffix}`;
    } else {
      return `(${fmtFracNumber(q.k)} + ${piStr})${unitSuffix}`;
    }
  }

  const valFrac = evaluate(q, mode);
  const formattedVal = fmtFracNumber(valFrac);
  return `${formattedVal}${unitSuffix}`;
}

export const REASONS = {
  circumference: 'circumference = 2 × π × radius',
  area: 'area = π × radius²',
  arc: 'arc length = (angle ÷ 360) × 2 × π × radius',
  sector: 'sector area = (angle ÷ 360) × π × radius²',
  semicircleP: 'semicircle perimeter = arc + diameter',
  semicircleA: 'semicircle area = (1/2) × π × radius²',
  quadrantP: 'quadrant perimeter = arc + 2 × radius',
  quadrantA: 'quadrant area = (1/4) × π × radius²'
};

export function validateQuestionNumbers(vd, answerQ, mode) {
  if (vd.r && !RADII.includes(vd.r) && vd.r % 7 !== 0) return false;
  if (vd.deg && !ANGLES.includes(vd.deg)) return false;
  if (vd.r && !modeAllowed(mode, [vd.r])) return false;
  return isCleanAnswer(answerQ, mode);
}

export function makeDistractors(correctQ, candidates, rng, mode, unit = '', count = 3) {
  const correctStr = fmtQuantity(correctQ, mode, unit);
  const seen = new Set([correctStr]);
  const result = [];

  // Try candidate quantities first
  for (const cand of candidates) {
    if (!cand) continue;
    try {
      const str = fmtQuantity(cand, mode, unit);
      if (!seen.has(str) && isCleanAnswer(cand, mode)) {
        seen.add(str);
        result.push(str);
        if (result.length >= count) break;
      }
    } catch (e) {
      // Ignore
    }
  }

  // If we need more distractors, construct mathematical variations
  const multipliers = [
    frac(2, 1),
    frac(1, 2),
    frac(3, 2),
    frac(4, 3),
    frac(2, 3)
  ];

  for (const m of multipliers) {
    if (result.length >= count) break;
    try {
      const altQ = qScale(correctQ, m);
      const str = fmtQuantity(altQ, mode, unit);
      if (!seen.has(str) && isCleanAnswer(altQ, mode)) {
        seen.add(str);
        result.push(str);
      }
    } catch (e) {
      // Ignore
    }
  }

  // Additional offset variations if still short
  const offsets = [frac(2, 1), frac(-2, 1), frac(7, 1), frac(-7, 1), frac(10, 1)];
  for (const off of offsets) {
    if (result.length >= count) break;
    try {
      const altQ = Q(add(correctQ.pi, off), correctQ.k);
      if (altQ.pi.n > 0) {
        const str = fmtQuantity(altQ, mode, unit);
        if (!seen.has(str) && isCleanAnswer(altQ, mode)) {
          seen.add(str);
          result.push(str);
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  // Final fallback to guarantee 3 distractors
  let step = 1;
  while (result.length < count && step < 20) {
    const fallbackQ = Q(add(correctQ.pi, frac(step, 1)), correctQ.k);
    const str = fmtQuantity(fallbackQ, mode, unit);
    if (!seen.has(str)) {
      seen.add(str);
      result.push(str);
    }
    step++;
  }

  return result.slice(0, count);
}

// Independent recomputation from visualData
export function recompute(visualData) {
  const { type, r, d, deg, R, rIn, length, width, side, target } = visualData;

  const radius = r || (d ? d / 2 : 7);

  switch (type) {
    case 'circumference':
      return circumference(radius);

    case 'area':
      return area(radius);

    case 'radius-from-c':
      return Q(0, radius);

    case 'diameter-from-c':
      return Q(0, radius * 2);

    case 'radius-from-a':
      return Q(0, radius);

    case 'arc':
      return arcLength(radius, deg || 90);

    case 'sector':
      return sectorArea(radius, deg || 90);

    case 'semicircle-perimeter':
      return semicirclePerimeter(radius);

    case 'semicircle-area':
      return semicircleArea(radius);

    case 'quadrant-perimeter':
      return quadrantPerimeter(radius);

    case 'quadrant-area':
      return quadrantArea(radius);

    case 'annulus':
      return annulusArea(R || 10, rIn || 6);

    case 'stadium-perimeter':
      // 2 * straight + circumference of end caps
      return qAdd(circumference(radius), Q(0, 2 * (length || 30)));

    case 'stadium-area':
      // rect area + end caps (full circle)
      return qAdd(area(radius), Q(0, (length || 30) * (2 * radius)));

    case 'square-minus-quadrant-area':
      // side^2 - 1/4 * pi * side^2
      return qSub(Q(0, (side || 10) * (side || 10)), quadrantArea(side || 10));

    case 'square-minus-quadrant-perimeter':
      // 2 * side + quadrant arc
      return qAdd(arcLength(side || 10, 90), Q(0, 2 * (side || 10)));

    case 'rect-plus-semicircle-area':
      return qAdd(semicircleArea(radius), Q(0, (length || 10) * (width || 6)));

    case 'rect-plus-semicircle-perimeter':
      return qAdd(arcLength(radius, 180), Q(0, (length || 10) * 2 + (width || 6)));

    default:
      if (target) return target;
      return circumference(radius);
  }
}
