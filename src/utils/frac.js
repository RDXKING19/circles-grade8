/**
 * Exact Rational Arithmetic for OrbitQuest
 * Ensures all math calculations are exact rational fractions.
 */

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function frac(n, d = 1) {
  if (d === 0) throw new Error('Division by zero in frac');
  if (typeof n === 'object' && n !== null && 'n' in n && 'd' in d) return n;
  let num = Math.round(n);
  let den = Math.round(d);
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return { n: num / g, d: den / g };
}

export function asFrac(val) {
  if (typeof val === 'object' && val !== null && 'n' in val && 'd' in val) {
    return frac(val.n, val.d);
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return frac(val, 1);
    // Convert finite decimal to fraction
    const s = val.toString();
    const dec = s.indexOf('.');
    if (dec === -1) return frac(val, 1);
    const places = s.length - dec - 1;
    const factor = Math.pow(10, places);
    return frac(Math.round(val * factor), factor);
  }
  return frac(0, 1);
}

export function add(a, b) {
  const fa = asFrac(a);
  const fb = asFrac(b);
  return frac(fa.n * fb.d + fb.n * fa.d, fa.d * fb.d);
}

export function sub(a, b) {
  const fa = asFrac(a);
  const fb = asFrac(b);
  return frac(fa.n * fb.d - fb.n * fa.d, fa.d * fb.d);
}

export function mul(a, b) {
  const fa = asFrac(a);
  const fb = asFrac(b);
  return frac(fa.n * fb.n, fa.d * fb.d);
}

export function div(a, b) {
  const fa = asFrac(a);
  const fb = asFrac(b);
  if (fb.n === 0) throw new Error('Division by zero fraction');
  return frac(fa.n * fb.d, fa.d * fb.n);
}

export function eq(a, b) {
  const fa = asFrac(a);
  const fb = asFrac(b);
  return fa.n === fb.n && fa.d === fb.d;
}

export function toNumber(f) {
  const fa = asFrac(f);
  return fa.n / fa.d;
}

export function isInt(f) {
  const fa = asFrac(f);
  return fa.d === 1;
}

export function isHalf(f) {
  const fa = asFrac(f);
  return (fa.n * 2) % fa.d === 0;
}

export function decimalsAtMost(f, k) {
  const fa = asFrac(f);
  const factor = Math.pow(10, k);
  return (fa.n * factor) % fa.d === 0;
}
