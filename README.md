# OrbitQuest — Grade 8 Circles & Mensuration

**Theme:** The Orbit Night Fair  
**Cast:** Hui Min, Arjun, and Chief Ride Engineer Tally 🦉  
**Pedagogical Journey:** Wonder → Story (4 Slides) → Simulate (3 Stations) → Practice (10 Worlds) → Reflect  

---

## 🎪 Overview

**OrbitQuest** is an educational mathematics web application for Grade 8 students (Secondary 2), bridging primary circle concepts into Secondary 3 mensuration (circumference, area, arc length, sector area, and composite figures).

Set in the lively atmosphere of the **Orbit Night Fair**, every ride, booth, garden bed, and stadium stage is built from circular geometry. Students pair with junior fair planners **Hui Min** and **Arjun** under the guidance of **Chief Ride Engineer Tally** to calculate fairy lights, boundary fences, turf, and decorative water coverage.

---

## 🌟 Key Features & Requirements

### 1. 🔍 Phase 1: Wonder
- **The Mystery of the Giant Wheel:** Explores the fair's Giant Wheel ($r = 14\text{ m}$).
- Poses the central driving question: *"What if you could measure a curved path just by knowing what fraction of the circle it covers?"*

### 2. 📖 Phase 2: Story (4 Slides — Zero Page Scrolling)
- Designed to fit the viewport without scrolling.
- **Slide 1: The Orbit Night Fair:** Introduction to circular rides and attractions.
- **Slide 2: Know Your Circle (Rim & Floor):** Circle parts, $C = 2\pi r = \pi d$, and $A = \pi r^2$ with worked example ($r = 7\text{ m}, \pi = 22/7 \implies C = 44\text{ m}, A = 154\text{ m}^2$).
- **Slide 3: Slices of the Circle (Arcs & Sectors):** Central angle $\theta$, fraction $\theta/360^\circ$, arc length and sector area formulas. Answers the Wonder riddle ($90^\circ$ turn on $r = 14\text{ m} \implies \text{arc} = 22\text{ m}$).
- **Slide 4: Mastering Composites & Real Fair Plans:** Combining rectangles, semicircles, and quadrants for turf area and outer perimeter fencing rules.

### 3. 🧪 Phase 3: Simulate (3 Real-World Stations — Zero Page Scrolling)
- **Station A: Giant Wheel Unroll Lab (Concept Discovery):**
  - Interactive angular slider ($15^\circ$ to $345^\circ$) and radius selector ($7\text{ m}, 14\text{ m}, 21\text{ m}$).
  - Live animated sector and real-time curved rim unrolling into a straight bar beside the full circumference bar.
  - Discovery zone counter and gate confirmation question.
- **Station B: Lawn Sprinkler Setup (Build-to-Target):**
  - Calibrate fairground lawn sprinkler spray angle ($30^\circ$ to $360^\circ$) and range ($2\text{ m}$ to $14\text{ m}$).
  - Live animated water spray sector over lawn grass.
  - Live tolerance gauge (amber within 20%, green on exact match) across 3 cases.
- **Station C: Track & Garden Builder (Composite Figures):**
  - Round 1: Running track stadium ($30\text{ m} \times 14\text{ m}$ rectangle + two semicircles of $r = 7\text{ m}$).
  - Round 2: Garden fountain plaza ($10\text{ m} \times 10\text{ m}$ square with quadrant pond cutout).
  - Interactive Turf Area Ledger and Outer Perimeter Fencing selector with interior boundary warning.

### 4. 🎮 Phase 4: Practice (10 Fair Worlds — 100% Unique Questions)
- **10 Worlds:**
  1. *Carousel Corner* (Circle Parts)
  2. *Ferris Wheel Plaza* (Circumference & Area)
  3. *Backwards Boulevard* (Reverse Circumference & Area)
  4. *Formula Fair* (Formulas & Units)
  5. *Half-Moon Stage* (Semicircle & Quadrant)
  6. *Arc Avenue* (Arc Length)
  7. *Sprinkler Sector Park* (Sector Area)
  8. *Dial Decoder* (Reverse Arc & Sector)
  9. *Track & Garden Works* (Composite Figures)
  10. *Grand Orbit Finale* (Mixed Grand Review Boss Battle)
- **4 Game Modes:** Guided Practice (5Q with hints), Independent Practice (10Q), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Unique Question Guarantee:** Statistically tested across 300+ randomized seeds (30,000 questions verified) with 0 duplicate questions, 4 unique options, and clear diagrams.
- **Crystal-Clear Visuals:** High-contrast SVG diagrams with labels, arrows, radius lines, and dimension text.

### 5. 📝 Phase 5: Reflect
- 3 core concept recap questions addressing common student misconceptions.
- Fair Plan Scorecard tracking Total XP, Stars (out of 30), and Best Streak.
- Open reflection prompt to Chief Ride Engineer Tally.
- Celebration screen with particle confetti.

---

## 🛠️ Technology Stack

- **Framework:** React 18, Vite 5
- **Styling:** Tailwind CSS 3.4, Vanilla CSS tokens, Dark Glassmorphism Design System
- **Icons & Graphics:** Pure SVG geometry diagram renderer (`CircleVisual.jsx`)
- **Animation & Effects:** Canvas Confetti, Web Audio API synthetic tactile clicks
- **Narration:** ElevenLabs Alice educator voice pipeline (`Xb7hH8MSUJpSbSDYk0k2`)

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Running QA & Validation Scripts
```bash
# Stress-test procedural question bank across 300 randomized seeds
npm run test:bank

# Verify simulation station logic
npm run test:stations
```
