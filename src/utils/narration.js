/* =========================================================================
   NARRATION SCRIPTS & SPEAK ENGINE
   Strict 1:1 parity with UI components.
   Voice: Alice (Clear, Engaging Educator)
   ========================================================================= */

export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'encouragement' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });

/* ------------------------------------------------ numberToWords helper */
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(num) {
  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'zero';
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ONES[n % 10] : '');
  if (n < 1000) {
    const rem = n % 100;
    return ONES[Math.floor(n / 100)] + ' hundred' + (rem !== 0 ? ' and ' + numberToWords(rem) : '');
  }
  if (n < 1000000) {
    const thousands = Math.floor(n / 1000);
    const rem = n % 1000;
    return numberToWords(thousands) + ' thousand' + (rem !== 0 ? ' ' + numberToWords(rem) : '');
  }
  return n.toString();
}

/**
 * Turns mathematical UI strings into their spoken forms for ElevenLabs Alice.
 */
export function speak(text) {
  if (!text) return '';
  let str = String(text);

  // 1. Units with powers
  str = str.replace(/cm²/g, ' square centimetres');
  str = str.replace(/m²/g, ' square metres');
  str = str.replace(/(\d+)\s*cm\b/g, '$1 centimetres');
  str = str.replace(/(\d+)\s*m\b/g, '$1 metres');

  // 2. Algebraic circle terms
  str = str.replace(/πr²/g, 'pi times radius squared');
  str = str.replace(/2πr/g, 'two times pi times the radius');
  str = str.replace(/πd/g, 'pi times the diameter');
  str = str.replace(/r²/g, 'radius squared');

  // 3. Greek letter pi coefficients
  str = str.replace(/(\d+(?:\.\d+)?)\s*π/g, (match, p1) => {
    return `${speak(p1)} pi`;
  });
  str = str.replace(/π/g, 'pi');

  // 4. Fractions a/b
  str = str.replace(/(\d+)\/(\d+)/g, (match, a, b) => {
    return `${numberToWords(parseInt(a, 10))} over ${numberToWords(parseInt(b, 10))}`;
  });

  // 5. Degrees
  str = str.replace(/(\d+)°/g, (match, d) => `${numberToWords(parseInt(d, 10))} degrees`);
  str = str.replace(/x°/g, 'x degrees');

  // 6. Decimals (e.g. 3.14 -> three point one four)
  str = str.replace(/(\d+)\.(\d+)/g, (match, whole, dec) => {
    const wholeWord = numberToWords(parseInt(whole, 10));
    const decWords = dec.split('').map(digit => ONES[parseInt(digit, 10)] || 'zero').join(' ');
    return `${wholeWord} point ${decWords}`;
  });

  // 7. Plain integers
  str = str.replace(/\b\d+\b/g, match => numberToWords(parseInt(match, 10)));

  // 8. Math operators
  str = str.replace(/×/g, ' times ');
  str = str.replace(/÷/g, ' divided by ');
  str = str.replace(/[−-]/g, ' minus ');
  str = str.replace(/\+/g, ' plus ');
  str = str.replace(/=/g, ' equals ');

  // Clean extra spaces
  return str.replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------ Phase Narrations */

export function wonderNarration() {
  return [
    say("Welcome to Phase 1: Wonder and Curiosity at the Orbit Night Fair!"),
    say("Hui Min and Arjun are inspecting the Orbit Giant Wheel with a radius of fourteen metres."),
    say("A photo cabin travels from the twelve o'clock position to three o'clock."),
    think("What if you could measure a curved path just by knowing what fraction of the circle it covers?")
  ];
}

// 4 Slides Story Narration as requested by user
export function storyNarration(panelIdx) {
  const scripts = [
    // Slide 1
    [
      say("The Orbit Night Fair has arrived! Every ride, stall, and stage is crafted from circles."),
      say("Hui Min sketches the designs while Arjun calculates the materials needed for lighting, paint, and turf."),
      think("Chief Ride Engineer Tally says: To build every attraction safely, we must master the geometry of circles!")
    ],
    // Slide 2
    [
      say("Slide two: Know Your Circle, Rim and Floor."),
      say("The rim is the circumference: C equals two pi r, which is also pi times diameter."),
      say("The floor area is pi times radius squared. For radius seven metres with pi as twenty-two over seven, circumference is forty-four metres and area is one hundred and fifty-four square metres!"),
      emphasize("Remember: Circumference measures outer boundary length, while area measures surface space.")
    ],
    // Slide 3
    [
      say("Slide three: Slices of the Circle, Arcs and Sectors."),
      say("A sector is a slice with a central angle. The fraction of the circle is the angle divided by three hundred and sixty degrees."),
      say("Arc length is the fraction times circumference. Sector area is the fraction times area."),
      cheer("On the Giant Wheel with radius fourteen metres, a ninety degree turn is one quarter of eighty-eight, which is exactly twenty-two metres!")
    ],
    // Slide 4
    [
      say("Slide four: Mastering Composites and Fairground Plans."),
      say("Real fair attractions combine rectangles, squares, semicircles, and quadrants."),
      say("To find total area, add and subtract the pieces. For perimeter, count only the outer boundary fence!"),
      celebrate("Your blueprints are approved! Let us head into the Ride Lab to test out the simulations.")
    ]
  ];

  return scripts[panelIdx] || scripts[0];
}

// 3 Stations as requested by user: A, B, and C
export function simStationIntro(stationIdx) {
  const intros = [
    // Station A
    [
      say("Station A: The Giant Wheel Unroll Lab!"),
      say("Drag the sector handle around the wheel to discover how central angles determine arc length and sector area."),
      say("Notice how unrolling the curved rim creates a straight line proportional to the full circumference!")
    ],
    // Station B
    [
      say("Station B: Lawn Sprinkler Setup!"),
      say("Adjust the spray angle and spray range sliders to water the target fairground lawn area."),
      say("Watch the live gauge turn amber as you get close, and green when your calibration is exact!")
    ],
    // Station C
    [
      say("Station C: Fairground Track and Garden Builder!"),
      say("Build composite attractions on the fairground grid. Calculate the turf area ledger and select outer perimeter boundary edges for fencing.")
    ]
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(q) {
  if (!q) return [];
  return [ask(speak(q.questionText))];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [celebrate(`Incredible streak of ${streak}! You have mastered this curve!`)];
  }
  return [cheer("Spot on! That calculation is exactly right!")];
}

export function playWrongNarration(qIdx = 0) {
  return [think("Not quite. Review the formula and check whether you used radius or diameter!")];
}

export function playHint1Narration(hint1) {
  return [say(hint1 || "Check the relevant circle formula for this problem.")];
}

export function playHint2Narration(hint2) {
  return [say(hint2 || "Substitute the given numbers carefully into the equation.")];
}

export function districtCompleteNarration(worldName) {
  return [celebrate(`Fantastic work! You have cleared ${worldName} with flying colours!`)];
}

export function bossWinNarration(bossName) {
  return [celebrate(`Sensational! You calibrated ${bossName} and claimed the boss reward!`)];
}

export function reflectNarration() {
  return [
    say("Welcome to Phase 5: Reflect!"),
    say("Review your circle knowledge across the fair attractions and consolidate what you have learned.")
  ];
}

export function reflectCompleteNarration() {
  return [
    celebrate("Outstanding work! You have completed the OrbitQuest journey and mastered Grade 8 Circles!")
  ];
}

export function getAllNarration() {
  const phrases = [];
  const add = (text, style = 'statement') => {
    if (text) phrases.push({ text, style });
  };

  wonderNarration().forEach(s => add(s.text, s.style));
  for (let i = 0; i < 4; i++) {
    storyNarration(i).forEach(s => add(s.text, s.style));
  }
  for (let j = 0; j < 3; j++) {
    simStationIntro(j).forEach(s => add(s.text, s.style));
  }
  reflectNarration().forEach(s => add(s.text, s.style));
  reflectCompleteNarration().forEach(s => add(s.text, s.style));

  return phrases;
}
