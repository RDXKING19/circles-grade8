export const STORY_PANELS = [
  {
    panel: 1,
    id: 'fair-arrival',
    title: 'The Orbit Night Fair',
    text: 'Every ride, stall, and stage at the Orbit Night Fair is built from circles! As junior fair planners, Hui Min sketches the layouts while Arjun computes materials for fairy lights, boundary fences, and turf flooring.',
    highlight: 'Every attraction starts with a circle: from giant wheels to spinning carousels!',
    character: 'huimin',
    characterEmoji: '👧',
    bubble: 'Hui Min: Look at the Giant Wheel and carousel! Circles make every ride spin smoothly.',
    image: '/assets/story/story_1.png',
    visualType: 'wheel-arc',
    visualData: {}
  },
  {
    panel: 2,
    id: 'rim-and-floor',
    title: 'Know Your Circle: Rim & Floor',
    text: 'Diameter is twice the radius (d = 2r). The outer rim is the Circumference: C = 2πr = πd. The surface is the Area: A = πr². With radius 7 m and π = 22/7, Circumference is 44 m and Area is 154 m².',
    highlight: 'Circumference is the fence around the rim; Area is the floor you walk on!',
    character: 'arjun',
    characterEmoji: '👦',
    bubble: 'Arjun: Always check whether a plan gives you the radius or the diameter before calculating!',
    image: '/assets/story/story_2.png',
    visualType: 'circle',
    visualData: { r: 7, unit: 'm', subtext: 'r = 7 m · C = 44 m · A = 154 m²' }
  },
  {
    panel: 3,
    id: 'arcs-and-sectors',
    title: 'Slices of the Circle: Arcs & Sectors',
    text: 'A central angle cuts a slice called a sector. The fraction of the circle is Angle ÷ 360°. Arc length is Fraction × Circumference, while Sector Area is Fraction × Area. A 90° turn on the 14 m Giant Wheel is 1/4 × 88 = 22 m!',
    highlight: 'The central angle gives the fraction of the whole circle: 90° ÷ 360° = 1/4!',
    character: 'tally',
    characterEmoji: '🦉',
    bubble: 'Tally: That solves our Giant Wheel riddle! The cabin travels exactly 22 metres from 12 to 3 o\'clock.',
    image: '/assets/story/story_3.png',
    visualType: 'sector',
    visualData: { r: 14, deg: 90, unit: 'm', arcLabel: 'Arc = 22 m' }
  },
  {
    panel: 4,
    id: 'composite-plans',
    title: 'Mastering Composites & Real Fair Plans',
    text: 'Real fairground stages and gardens combine rectangles, semicircles, and quadrants. Add areas to buy turf and paint. For perimeter fencing, count ONLY the outer boundary—interior lines never count in perimeter fences!',
    highlight: 'Combine the pieces for turf area, but only fence the outer boundary!',
    character: 'tally',
    characterEmoji: '🦉',
    bubble: 'Tally: Blueprints approved! Let us head into the Ride Lab to calibrate the interactive stations.',
    image: '/assets/story/story_4.png',
    visualType: 'composite',
    visualData: { kind: 'rect-semi', length: 10, width: 6, unit: 'm' }
  }
];
