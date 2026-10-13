import { WORLDS } from '../config/worlds.config.js';
import {
  RADII,
  ANGLES,
  SEVEN_RADII,
  PI_MODES,
  circumference,
  area,
  arcLength,
  sectorArea,
  semicirclePerimeter,
  semicircleArea,
  quadrantPerimeter,
  quadrantArea,
  annulusArea,
  fmtQuantity,
  isCleanAnswer,
  makeDistractors,
  modeAllowed,
  Q
} from '../utils/circleMath.js';
import { frac } from '../utils/frac.js';
import { createRNG } from '../utils/rng.js';

export const DISTRICTS = WORLDS.map(w => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  conceptFocus: w.conceptFocus,
  description: w.description,
  boss: w.boss
}));

const FAIR_NOUNS = [
  'Ferris Wheel',
  'Carousel Floor',
  'Festival Stage',
  'Lawn Sprinkler',
  'Fountain Pond',
  'Carnival Tart',
  'Fairground Track',
  'Decorative Plaza',
  'Ring Toss Target',
  'Game Wheel'
];

/**
 * Guarantees exactly 4 completely distinct options including correctAnswer.
 */
function ensureFourDistinctOptions(correctAnswer, candidates, fallbackFn) {
  const seen = new Set([correctAnswer]);
  const distinct = [];

  for (const cand of candidates) {
    if (cand && !seen.has(cand)) {
      seen.add(cand);
      distinct.push(cand);
      if (distinct.length === 3) break;
    }
  }

  let step = 1;
  while (distinct.length < 3) {
    const fb = fallbackFn ? fallbackFn(step) : `${step}`;
    if (!seen.has(fb)) {
      seen.add(fb);
      distinct.push(fb);
    }
    step++;
  }

  return [correctAnswer, ...distinct];
}

/**
 * Procedurally generates 1 question for a world.
 * Guarantees distinct question texts and unique option lists.
 */
export function generateQuestion(worldId, qIdx, rng, existingTexts = new Set()) {
  let attempts = 0;

  while (attempts < 100) {
    attempts++;
    const q = buildQuestion(worldId, qIdx, rng);
    if (!existingTexts.has(q.questionText)) {
      existingTexts.add(q.questionText);
      return q;
    }
  }

  // Fallback with unique index guarantee
  const fallback = buildQuestion(worldId, qIdx, rng);
  fallback.questionText += ` [Attraction #${qIdx + 1}]`;
  return fallback;
}

function buildQuestion(worldId, qIdx, rng) {
  const noun = rng.pick(FAIR_NOUNS);
  const qId = `w${worldId}-q${qIdx}`;

  switch (worldId) {
    /* ------------------------------------------------ World 0: Parts of a Circle */
    case 0: {
      const templates = [
        () => {
          const r = rng.pick([4, 5, 6, 7, 8, 9, 10, 12, 14]);
          const d = r * 2;
          const isRtoD = rng.next() > 0.5;
          const questionText = isRtoD
            ? `A ${noun} has a radius of ${r} m. What is its diameter?`
            : `A ${noun} has a diameter of ${d} m. What is its radius?`;
          const correctAnswer = isRtoD ? `${d} m` : `${r} m`;
          const cand = isRtoD
            ? [`${r} m`, `${d + 4} m`, `${d * 2} m`, `${r + 3} m`]
            : [`${d} m`, `${Math.max(1, Math.round(d / 4))} m`, `${d * 2} m`, `${r + 2} m`];
          const options = rng.shuffle(
            ensureFourDistinctOptions(correctAnswer, cand, s => `${(isRtoD ? d : r) + s * 3} m`)
          );

          return {
            category: 'circle-parts',
            visual: 'circle',
            visualData: { r, show: isRtoD ? 'radius' : 'diameter', unit: 'm' },
            questionText,
            options,
            correctAnswer,
            explanation: isRtoD
              ? `Diameter is twice the radius: d = 2 × ${r} m = ${d} m.`
              : `Radius is half the diameter: r = ${d} ÷ 2 = ${r} m.`,
            hint1: isRtoD ? 'Formula: diameter = 2 × radius.' : 'Formula: radius = diameter ÷ 2.',
            hint2: isRtoD ? `Multiply ${r} by 2.` : `Divide ${d} by 2.`
          };
        },
        () => {
          const parts = [
            { name: 'radius', def: 'A line segment connecting the centre to any point on the rim', dist: ['diameter', 'chord', 'arc'] },
            { name: 'diameter', def: 'The longest chord passing directly through the centre of the circle', dist: ['radius', 'chord', 'sector'] },
            { name: 'chord', def: 'A straight line segment connecting any two points on the circle boundary', dist: ['radius', 'diameter', 'arc'] },
            { name: 'arc', def: 'A curved portion of the circle boundary line', dist: ['chord', 'sector', 'segment'] },
            { name: 'sector', def: 'A pie-slice region enclosed by two radii and an arc', dist: ['segment', 'semicircle', 'chord'] },
            { name: 'segment', def: 'A region of the circle enclosed by a chord and an arc', dist: ['sector', 'quadrant', 'diameter'] }
          ];
          const chosen = rng.pick(parts);
          const options = rng.shuffle(
            ensureFourDistinctOptions(chosen.name, chosen.dist, s => `part-${s}`)
          );

          return {
            category: 'circle-parts',
            visual: 'parts',
            visualData: { highlight: chosen.name },
            questionText: `Which circle part is defined as: "${chosen.def}"?`,
            options,
            correctAnswer: chosen.name,
            explanation: `By definition, ${chosen.name} is "${chosen.def}".`,
            hint1: 'Look closely at the highlighted geometric feature.',
            hint2: `Notice if it connects to the centre or stays along the rim.`
          };
        },
        () => {
          const d = rng.pick([16, 20, 24, 28, 32]);
          const correctAnswer = `${d} cm`;
          const cand = [`${d / 2} cm`, `${d * 2} cm`, `${d + 4} cm`, `${d - 4} cm`];
          const options = rng.shuffle(
            ensureFourDistinctOptions(correctAnswer, cand, s => `${d + s * 2} cm`)
          );

          return {
            category: 'circle-parts',
            visual: 'parts',
            visualData: { highlight: 'diameter' },
            questionText: `What is the longest possible straight line segment that can be drawn inside a circle of diameter ${d} cm?`,
            options,
            correctAnswer,
            explanation: `The diameter is the longest possible chord in any circle, which equals ${d} cm.`,
            hint1: 'The longest chord in a circle is its diameter.',
            hint2: `The diameter given is ${d} cm.`
          };
        }
      ];
      return { id: qId, districtId: 0, ...rng.pick(templates)() };
    }

    /* ------------------------------------------------ World 1: Circumference & Area */
    case 1: {
      const mode = rng.next() < 0.4 ? PI_MODES.TERMS : rng.next() < 0.7 ? PI_MODES.SEVEN : PI_MODES.DECIMAL;
      const isArea = rng.next() > 0.5;
      const r = mode === PI_MODES.SEVEN ? rng.pick(SEVEN_RADII) : rng.pick([3, 4, 5, 6, 8, 10]);

      const correctQ = isArea ? area(r) : circumference(r);
      const unit = isArea ? 'm²' : 'm';
      const convText = mode === PI_MODES.TERMS
        ? 'Leave your answer in terms of π.'
        : mode === PI_MODES.SEVEN
        ? 'Take π = 22/7.'
        : 'Use π = 3.14.';

      const questionText = isArea
        ? `Find the area of a circular ${noun} with radius ${r} m. ${convText}`
        : `Find the circumference of a circular ${noun} with radius ${r} m. ${convText}`;

      const cand1 = isArea ? circumference(r) : area(r);
      const cand2 = isArea ? area(r * 2) : circumference(r * 2);
      const distractors = makeDistractors(correctQ, [cand1, cand2], rng, mode, unit);
      const formattedCorrect = fmtQuantity(correctQ, mode, unit);
      const options = rng.shuffle(
        ensureFourDistinctOptions(formattedCorrect, distractors, s => `${s * 10} ${unit}`)
      );

      return {
        id: qId,
        districtId: 1,
        category: 'circumference-area',
        visual: 'circle',
        visualData: { r, show: 'radius', unit: 'm', type: isArea ? 'area' : 'circumference' },
        questionText,
        options,
        correctAnswer: formattedCorrect,
        explanation: isArea
          ? `Area = πr² = π × ${r}² = ${formattedCorrect}.`
          : `Circumference = 2πr = 2 × π × ${r} = ${formattedCorrect}.`,
        hint1: isArea ? 'Formula: Area = π × radius²' : 'Formula: Circumference = 2 × π × radius',
        hint2: `Substitute radius = ${r} m into the formula.`
      };
    }

    /* ------------------------------------------------ World 2: Backwards Circumference & Area */
    case 2: {
      const isArea = rng.next() > 0.5;
      const r = rng.pick([3, 5, 7, 10, 14]);
      const askDiameter = rng.next() > 0.5;

      const givenText = isArea
        ? `A circular ${noun} has an area of ${r * r}π cm².`
        : `A circular ${noun} has a circumference of ${2 * r}π cm.`;

      const questionText = `${givenText} What is its ${askDiameter ? 'diameter' : 'radius'}?`;
      const correctVal = askDiameter ? r * 2 : r;
      const correctAnswer = `${correctVal} cm`;
      const cand = askDiameter
        ? [`${r} cm`, `${correctVal + 4} cm`, `${correctVal * 2} cm`, `${Math.max(1, correctVal - 4)} cm`]
        : [`${r * 2} cm`, `${Math.max(1, Math.round(r / 2))} cm`, `${r + 4} cm`, `${r + 8} cm`];

      const options = rng.shuffle(
        ensureFourDistinctOptions(correctAnswer, cand, s => `${correctVal + s * 3} cm`)
      );

      return {
        id: qId,
        districtId: 2,
        category: 'reverse-circumference-area',
        visual: 'circle',
        visualData: { r, show: askDiameter ? 'diameter' : 'radius', unit: 'cm', type: isArea ? 'radius-from-a' : 'radius-from-c' },
        questionText,
        options,
        correctAnswer,
        explanation: isArea
          ? `Since Area = πr² = ${r * r}π cm², r² = ${r * r}, so r = ${r} cm.${askDiameter ? ` Diameter = 2r = ${correctVal} cm.` : ''}`
          : `Since Circumference = 2πr = ${2 * r}π cm, r = ${r} cm.${askDiameter ? ` Diameter = 2r = ${correctVal} cm.` : ''}`,
        hint1: isArea ? 'Divide the area by π, then take the square root to find the radius.' : 'Divide the circumference by 2π to find the radius.',
        hint2: askDiameter ? 'Remember to double the radius to find diameter.' : `Solve for radius.`
      };
    }

    /* ------------------------------------------------ World 3: Formula & Units */
    case 3: {
      const templates = [
        () => {
          const r = rng.pick([6, 8, 12]);
          const correctAnswer = `Area, using formula π × ${r}²`;
          const cand = [
            `Circumference, using formula 2 × π × ${r * 2}`,
            `Area, using formula π × ${r * 2}²`,
            `Circumference, using formula π × ${r}`
          ];
          const options = rng.shuffle(ensureFourDistinctOptions(correctAnswer, cand));

          return {
            category: 'formula-units',
            visual: 'circle',
            visualData: { r, show: 'diameter', unit: 'm' },
            questionText: `Arjun needs to buy turf flooring for a circular ride of diameter ${r * 2} m. Which measure and formula should he use?`,
            options,
            correctAnswer,
            explanation: `Flooring covers a flat surface, requiring Area = πr². Since diameter is ${r * 2} m, radius is ${r} m.`,
            hint1: 'Flooring covers surface area, not rim length.',
            hint2: `Radius is half the diameter (${r * 2} ÷ 2 = ${r} m).`
          };
        },
        () => {
          const correctAnswer = 'm (metres)';
          const cand = ['m² (square metres)', 'm³ (cubic metres)', 'cm² (square centimetres)'];
          const options = rng.shuffle(ensureFourDistinctOptions(correctAnswer, cand));

          return {
            category: 'formula-units',
            visual: 'circle',
            visualData: { r: 7, unit: 'm' },
            questionText: `Hui Min wants to install safety perimeter fencing around a circular pond. What metric unit must the answer be in?`,
            options,
            correctAnswer,
            explanation: 'Perimeter fencing measures linear length along a boundary, which is measured in linear metres (m).',
            hint1: 'Fences are measured in linear length units.',
            hint2: 'Area uses square units; perimeter uses linear units.'
          };
        }
      ];
      return { id: qId, districtId: 3, ...rng.pick(templates)() };
    }

    /* ------------------------------------------------ World 4: Semicircle & Quadrant */
    case 4: {
      const isSemi = rng.next() > 0.5;
      const isPerimeter = rng.next() > 0.5;
      const r = rng.pick([7, 14]);
      const mode = rng.next() < 0.5 ? PI_MODES.TERMS : PI_MODES.SEVEN;
      const unit = isPerimeter ? 'cm' : 'cm²';

      const correctQ = isSemi
        ? (isPerimeter ? semicirclePerimeter(r) : semicircleArea(r))
        : (isPerimeter ? quadrantPerimeter(r) : quadrantArea(r));

      const convText = mode === PI_MODES.TERMS ? 'Leave your answer in terms of π.' : 'Take π = 22/7.';
      const shapeName = isSemi ? 'semicircle' : 'quadrant';
      const measureName = isPerimeter ? 'perimeter' : 'area';

      const questionText = `Find the ${measureName} of a ${shapeName} of radius ${r} cm. ${convText}`;

      const arcOnlyQ = isSemi ? arcLength(r, 180) : arcLength(r, 90);
      const fullCircleQ = isPerimeter ? circumference(r) : area(r);
      const distractors = makeDistractors(correctQ, [arcOnlyQ, fullCircleQ], rng, mode, unit);
      const formattedCorrect = fmtQuantity(correctQ, mode, unit);
      const options = rng.shuffle(
        ensureFourDistinctOptions(formattedCorrect, distractors, s => `${s * 15} ${unit}`)
      );

      return {
        id: qId,
        districtId: 4,
        category: 'semicircle-quadrant',
        visual: isSemi ? 'semicircle' : 'quadrant',
        visualData: { r, unit: 'cm', type: isSemi ? (isPerimeter ? 'semicircle-perimeter' : 'semicircle-area') : (isPerimeter ? 'quadrant-perimeter' : 'quadrant-area') },
        questionText,
        options,
        correctAnswer: formattedCorrect,
        explanation: isPerimeter
          ? `Perimeter includes both the curved arc AND straight diameter edge(s): ${formattedCorrect}.`
          : `${isSemi ? 'Semicircle area is 1/2' : 'Quadrant area is 1/4'} of the full circle area: ${formattedCorrect}.`,
        hint1: isPerimeter ? 'Do not forget the straight baseline edges!' : 'Remember to take the fraction of the full area.',
        hint2: isPerimeter ? `Perimeter = Arc + straight boundary.` : `Calculate full circle area, then divide.`
      };
    }

    /* ------------------------------------------------ World 5: Arc Length */
    case 5: {
      const deg = rng.pick([45, 60, 90, 120, 180]);
      const r = rng.pick([6, 12, 14, 18]);
      const mode = (r % 7 === 0 && rng.next() > 0.5) ? PI_MODES.SEVEN : PI_MODES.TERMS;
      const convText = mode === PI_MODES.TERMS ? 'Leave your answer in terms of π.' : 'Take π = 22/7.';

      const correctQ = arcLength(r, deg);
      const formattedCorrect = fmtQuantity(correctQ, mode, 'm');

      const candFull = circumference(r);
      const candArea = sectorArea(r, deg);
      const distractors = makeDistractors(correctQ, [candFull, candArea], rng, mode, 'm');
      const options = rng.shuffle(
        ensureFourDistinctOptions(formattedCorrect, distractors, s => `${s * 8} m`)
      );

      return {
        id: qId,
        districtId: 5,
        category: 'arc-length',
        visual: 'sector',
        visualData: { r, deg, unit: 'm', unknown: 'arc', type: 'arc' },
        questionText: `A curved track bend on a ${noun} forms a sector of central angle ${deg}° and radius ${r} m. Find its arc length. ${convText}`,
        options,
        correctAnswer: formattedCorrect,
        explanation: `Arc length = (${deg}° ÷ 360°) × 2πr = ${deg}/360 × 2 × π × ${r} = ${formattedCorrect}.`,
        hint1: 'Formula: Arc length = (Angle ÷ 360) × 2 × π × radius.',
        hint2: `Fraction is ${deg}/360. Multiply by circumference.`
      };
    }

    /* ------------------------------------------------ World 6: Sector Area */
    case 6: {
      const deg = rng.pick([60, 90, 120, 150]);
      const r = rng.pick([6, 10, 12]);
      const mode = PI_MODES.TERMS;

      const correctQ = sectorArea(r, deg);
      const formattedCorrect = fmtQuantity(correctQ, mode, 'm²');

      const candArc = arcLength(r, deg);
      const candFull = area(r);
      const distractors = makeDistractors(correctQ, [candArc, candFull], rng, mode, 'm²');
      const options = rng.shuffle(
        ensureFourDistinctOptions(formattedCorrect, distractors, s => `${s * 12}π m²`)
      );

      return {
        id: qId,
        districtId: 6,
        category: 'sector-area',
        visual: 'sector',
        visualData: { r, deg, unit: 'm', unknown: 'area', type: 'sector' },
        questionText: `A fairground sprinkler waters a sector of lawn of radius ${r} m with spray angle ${deg}°. Find the watered sector area. Leave your answer in terms of π.`,
        options,
        correctAnswer: formattedCorrect,
        explanation: `Sector area = (${deg}° ÷ 360°) × πr² = ${deg}/360 × π × ${r * r} = ${formattedCorrect}.`,
        hint1: 'Formula: Sector Area = (Angle ÷ 360) × π × radius².',
        hint2: `Multiply ${deg}/360 by the full area ${r * r}π.`
      };
    }

    /* ------------------------------------------------ World 7: Reverse Arc & Sector */
    case 7: {
      const deg = rng.pick([45, 60, 90, 120, 150, 180]);
      const r = rng.pick([6, 12, 18]);
      const arcQ = arcLength(r, deg);
      const arcStr = fmtQuantity(arcQ, PI_MODES.TERMS, 'cm');

      const correctAnswer = `${deg}°`;
      const cand = [
        `${Math.round(deg / 2)}°`,
        `${deg + 30}°`,
        `${deg + 60}°`,
        `${Math.max(15, deg - 30)}°`,
        '90°',
        '180°',
        '270°',
        '45°'
      ];
      const options = rng.shuffle(
        ensureFourDistinctOptions(correctAnswer, cand, s => `${(deg + s * 25) % 360 || 30}°`)
      );

      return {
        id: qId,
        districtId: 7,
        category: 'reverse-arc-sector',
        visual: 'sector',
        visualData: { r, deg, unit: 'cm', unknown: 'angle', type: 'arc' },
        questionText: `A sector of radius ${r} cm has an arc length of ${arcStr}. What is its central angle?`,
        options,
        correctAnswer,
        explanation: `Full circumference is ${2 * r}π cm. Fraction = ${arcStr} ÷ ${2 * r}π = ${deg}/360. Therefore, Angle = ${deg}°.`,
        hint1: 'Find what fraction the arc length is of the full circumference.',
        hint2: `Multiply the fraction by 360°.`
      };
    }

    /* ------------------------------------------------ World 8: Composite Figures */
    case 8: {
      const templates = [
        () => {
          const r = 7;
          const length = rng.pick([20, 30, 40]);
          const isArea = rng.next() > 0.5;
          const totalVal = isArea ? length * (2 * r) + 154 : 2 * length + 44;
          const unit = isArea ? 'm²' : 'm';
          const correctAnswer = `${totalVal} ${unit}`;
          const cand = [
            `${totalVal + 28} ${unit}`,
            `${totalVal - 28} ${unit}`,
            `${totalVal + 44} ${unit}`,
            `${totalVal + 56} ${unit}`
          ];
          const options = rng.shuffle(
            ensureFourDistinctOptions(correctAnswer, cand, s => `${totalVal + s * 20} ${unit}`)
          );

          return {
            category: 'composite-figures',
            visual: 'composite',
            visualData: { kind: 'stadium', r, length, unit: 'm', type: isArea ? 'stadium-area' : 'stadium-perimeter' },
            questionText: `A festival stadium running track consists of a ${length} m × 14 m rectangle with semicircular ends (r = 7 m). Find the total ${isArea ? 'turf area' : 'outer perimeter boundary'}. Take π = 22/7.`,
            options,
            correctAnswer,
            explanation: isArea
              ? `Rectangle area = ${length} × 14 = ${length * 14} m². Two semicircles make a full circle of area 154 m². Total = ${totalVal} m².`
              : `Outer perimeter = 2 straights (${2 * length} m) + 2 semicircle arcs (44 m). Interior lines are not counted! Total = ${totalVal} m.`,
            hint1: isArea ? 'Add the rectangle area and the two semicircles (one full circle).' : 'Remember: Only count the outer boundary fence, never inside lines!',
            hint2: isArea ? `Rectangle = ${length * 14} m²; Circle = 154 m².` : `Straights = ${2 * length} m; Outer curved ends = 44 m.`
          };
        },
        () => {
          const formattedCorrect = `(100 − 25π) m²`;
          const cand = ['(100 − 50π) m²', '(100 + 25π) m²', '(80 − 20π) m²', '(100 − 10π) m²'];
          const options = rng.shuffle(
            ensureFourDistinctOptions(formattedCorrect, cand)
          );

          return {
            category: 'composite-figures',
            visual: 'composite',
            visualData: { kind: 'square-quadrant', side: 10, unit: 'm', type: 'square-minus-quadrant-area' },
            questionText: `A square fairground garden of side 10 m has a quarter-circle pond of radius 10 m carved from one corner. Find the remaining garden area in terms of π.`,
            options,
            correctAnswer: formattedCorrect,
            explanation: `Total square area is 10² = 100 m². Quarter-circle pond area is 1/4 × π × 10² = 25π m². Remaining area = (100 − 25π) m².`,
            hint1: 'Subtract the quadrant area from the full square area.',
            hint2: 'Square = 100 m²; Quadrant = 25π m².'
          };
        }
      ];
      return { id: qId, districtId: 8, ...rng.pick(templates)() };
    }

    /* ------------------------------------------------ World 9: Grand Orbit Finale */
    case 9: {
      const sourceWorld = rng.pick([0, 1, 2, 4, 5, 6, 8]);
      const res = buildQuestion(sourceWorld, qIdx, rng);
      res.id = qId;
      res.districtId = 9;
      res.category = 'mixed-review';
      return res;
    }

    default:
      return {
        id: qId,
        districtId: worldId,
        category: 'circle-parts',
        visual: 'circle',
        visualData: { r: 7, show: 'radius', unit: 'cm' },
        questionText: `Find the diameter of a circle of radius 7 cm.`,
        options: ['14 cm', '7 cm', '21 cm', '28 cm'],
        correctAnswer: '14 cm',
        explanation: 'Diameter = 2 × radius = 14 cm.',
        hint1: 'Multiply radius by 2.',
        hint2: '7 × 2 = 14.'
      };
  }
}

/**
 * Generates the complete 100-question bank across all 10 worlds.
 * Ensures every single question is 100% unique!
 */
export function generateBank(seed = Date.now()) {
  const rng = createRNG(seed);
  const bank = [];
  const existingTexts = new Set();

  for (let w = 0; w < 10; w++) {
    for (let q = 0; q < 10; q++) {
      bank.push(generateQuestion(w, q, rng, existingTexts));
    }
  }

  return bank;
}
