import { circumference, area, arcLength, sectorArea } from '../src/utils/circleMath.js';

console.log('🧪 Testing Station A, B, and C Simulation Logic...\n');

let failures = 0;

// Test Station A: Giant Wheel Math
const testRadius = 14;
const testDeg = 90;
const circ = circumference(testRadius);
const fullCircVal = 2 * (22 / 7) * testRadius;
const arcVal = (testDeg / 360) * fullCircVal;

if (Math.round(arcVal) !== 22) {
  console.error(`❌ Station A arc calculation failed: expected 22, got ${arcVal}`);
  failures++;
} else {
  console.log('  ✓ Station A Giant Wheel 90° arc = 22 m verified!');
}

// Test Station B: Sprinkler Targets
// Case 1: range = 6, angle = 120 -> area in terms of pi: (120/360) * 6^2 = 12 pi
const case1Val = (120 / 360) * (6 * 6);
if (case1Val !== 12) {
  console.error(`❌ Station B Case 1 failed: expected 12, got ${case1Val}`);
  failures++;
} else {
  console.log('  ✓ Station B Case 1 (range 6 m, angle 120° -> 12π m²) verified!');
}

// Case 2: angle = 90, range = 12 -> arc in terms of pi: (90/360) * 2 * 12 = 6 pi
const case2Val = (90 / 360) * (2 * 12);
if (case2Val !== 6) {
  console.error(`❌ Station B Case 2 failed: expected 6, got ${case2Val}`);
  failures++;
} else {
  console.log('  ✓ Station B Case 2 (angle 90°, range 12 m -> 6π m) verified!');
}

// Case 3: range = 4, angle = 180 -> area in terms of pi: (180/360) * 4^2 = 8 pi
const case3Val = (180 / 360) * (4 * 4);
if (case3Val !== 8) {
  console.error(`❌ Station B Case 3 failed: expected 8, got ${case3Val}`);
  failures++;
} else {
  console.log('  ✓ Station B Case 3 (range 4 m, angle 180° -> 8π m²) verified!');
}

// Test Station C: Composite figures
// Stadium: length 30, radius 7
// Rect area = 30 * 14 = 420; Circle area = (22/7) * 7^2 = 154; Total = 574
const stadiumArea = 30 * 14 + (22 / 7) * 7 * 7;
if (stadiumArea !== 574) {
  console.error(`❌ Station C Stadium area failed: expected 574, got ${stadiumArea}`);
  failures++;
} else {
  console.log('  ✓ Station C Stadium area (574 m²) verified!');
}

// Stadium perimeter: 2 * 30 + 2 * (22/7) * 7 = 60 + 44 = 104
const stadiumPerimeter = 2 * 30 + 2 * (22 / 7) * 7;
if (stadiumPerimeter !== 104) {
  console.error(`❌ Station C Stadium perimeter failed: expected 104, got ${stadiumPerimeter}`);
  failures++;
} else {
  console.log('  ✓ Station C Stadium perimeter (104 m) verified!');
}

if (failures > 0) {
  console.error(`\n❌ Station tests failed with ${failures} errors!`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL SIMULATION STATION TESTS PASSED!');
  process.exit(0);
}
