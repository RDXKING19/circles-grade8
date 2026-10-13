import { generateBank } from '../src/data/questionBank.js';

console.log('🧪 Starting Question Bank Stress Test across 300 randomized seeds...\n');

const NUM_SEEDS = 300;
let totalQuestionsChecked = 0;
let failures = 0;

for (let s = 0; s < NUM_SEEDS; s++) {
  const seed = 100000 + s * 739;
  let bank;

  try {
    bank = generateBank(seed);
  } catch (err) {
    console.error(`❌ Seed ${seed} failed generation:`, err);
    failures++;
    continue;
  }

  if (bank.length !== 100) {
    console.error(`❌ Seed ${seed} returned ${bank.length} questions, expected 100!`);
    failures++;
    continue;
  }

  // Check each world's 10 questions
  for (let w = 0; w < 10; w++) {
    const worldQuestions = bank.slice(w * 10, w * 10 + 10);
    const textSet = new Set();

    for (let q = 0; q < worldQuestions.length; q++) {
      const item = worldQuestions[q];
      totalQuestionsChecked++;

      // Check fields
      if (!item.id || !item.questionText || !item.correctAnswer || !item.options) {
        console.error(`❌ Seed ${seed} W${w} Q${q} missing required fields!`);
        failures++;
      }

      // Check options
      if (!Array.isArray(item.options) || item.options.length !== 4) {
        console.error(`❌ Seed ${seed} W${w} Q${q} options count is ${item.options?.length}, expected 4!`);
        failures++;
      }

      // Check options uniqueness
      const uniqueOptions = new Set(item.options);
      if (uniqueOptions.size !== 4) {
        console.error(`❌ Seed ${seed} W${w} Q${q} duplicate options detected:`, item.options);
        failures++;
      }

      // Check correct answer is in options
      if (!item.options.includes(item.correctAnswer)) {
        console.error(`❌ Seed ${seed} W${w} Q${q} correct answer "${item.correctAnswer}" not in options!`, item.options);
        failures++;
      }

      // Check question text uniqueness within world
      if (textSet.has(item.questionText)) {
        console.error(`❌ Seed ${seed} W${w} duplicate question text found: "${item.questionText}"`);
        failures++;
      }
      textSet.add(item.questionText);
    }
  }

  if ((s + 1) % 50 === 0) {
    console.log(`  ✓ Passed ${s + 1}/${NUM_SEEDS} seeds (${(s + 1) * 100} questions validated)...`);
  }
}

console.log(`\n========================================`);
console.log(`Summary:`);
console.log(`Total questions verified: ${totalQuestionsChecked}`);
console.log(`Failures: ${failures}`);
console.log(`========================================`);

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL QUESTION BANK STRESS TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
