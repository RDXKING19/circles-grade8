import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  wonderNarration,
  storyNarration,
  simStationIntro,
  reflectNarration,
  reflectCompleteNarration,
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossWinNarration
} from '../src/utils/narration.js';
import { WORLDS } from '../src/config/worlds.config.js';
import { STYLE_SETTINGS } from '../src/config/audio.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'sk_3fea6cc505b5de9c781221c2054c95da74f94423f735d9a8';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';

const AUDIO_DIR = path.resolve(__dirname, '../public/assets/audio');
const AUDIO_MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.js');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

function collectAllPhrases() {
  const map = new Map();

  function add(seg) {
    if (seg && seg.text && !map.has(seg.text)) {
      map.set(seg.text, seg.style || 'statement');
    }
  }

  // 1. Wonder Phase
  wonderNarration().forEach(add);

  // 2. Story Phase (4 slides)
  for (let s = 0; s < 4; s++) {
    storyNarration(s).forEach(add);
  }

  // 3. Simulate Phase (3 stations)
  for (let st = 0; st < 3; st++) {
    simStationIntro(st).forEach(add);
  }

  // 4. Reflect Phase
  reflectNarration().forEach(add);
  reflectCompleteNarration().forEach(add);

  // 5. Feedback lines
  playCorrectNarration(1).forEach(add);
  playCorrectNarration(5).forEach(add);
  playWrongNarration(0).forEach(add);
  playHint1Narration("").forEach(add);
  playHint2Narration("").forEach(add);

  // 6. District Complete & Boss Win for all 10 worlds
  WORLDS.forEach(w => {
    districtCompleteNarration(w.name).forEach(add);
    bossWinNarration(w.boss.name).forEach(add);
  });

  return Array.from(map.entries()).map(([text, style]) => ({ text, style }));
}

function createFilename(text, idx) {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 32)
    .replace(/_$/, '');
  return `audio_${clean}_${idx}.mp3`;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchAudio(text, style) {
  const cfg = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
  const voice_settings = {
    stability: cfg.stability,
    similarity_boost: cfg.similarity_boost,
    style: cfg.style,
    use_speaker_boost: cfg.use_speaker_boost
  };

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function run() {
  console.log('🎙️ Starting ElevenLabs Audio Generation...');
  console.log(`Voice ID: ${VOICE_ID} (Alice)`);
  console.log(`Model ID: ${MODEL_ID}\n`);

  const phrases = collectAllPhrases();
  console.log(`Found ${phrases.length} unique narration phrases to generate.\n`);

  // Load existing audioMap if present
  let currentMap = {};
  if (fs.existsSync(AUDIO_MAP_FILE)) {
    try {
      const content = fs.readFileSync(AUDIO_MAP_FILE, 'utf8');
      const match = content.match(/export const audioMap = (\{[\s\S]*?\});/);
      if (match) {
        currentMap = eval('(' + match[1] + ')');
      }
    } catch (e) {
      currentMap = {};
    }
  }

  const updatedMap = { ...currentMap };
  let generatedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const existingFile = updatedMap[text];
    const targetFile = existingFile ? path.resolve(__dirname, '../public', existingFile.replace(/^\//, '')) : null;

    if (existingFile && fs.existsSync(targetFile)) {
      skippedCount++;
      console.log(`[${i + 1}/${phrases.length}] ⏭️  Skipped (already exists): "${text.slice(0, 45)}..."`);
      continue;
    }

    const filename = createFilename(text, i);
    const destPath = path.join(AUDIO_DIR, filename);

    try {
      console.log(`[${i + 1}/${phrases.length}] 🔊 Generating (${style}): "${text.slice(0, 50)}..."`);
      const buffer = await fetchAudio(text, style);
      fs.writeFileSync(destPath, buffer);
      updatedMap[text] = `/assets/audio/${filename}`;
      generatedCount++;
      console.log(`   ✓ Saved ${filename} (${buffer.length} bytes)`);

      // Gentle pause to respect rate limits
      await sleep(250);
    } catch (err) {
      console.error(`   ❌ Failed for "${text}":`, err.message);
    }
  }

  // Write updated audioMap.js
  const mapCode = `// Auto-generated by scripts/generate_audio.js for OrbitQuest
// Voice: Alice (${VOICE_ID}) | Model: ${MODEL_ID}
export const audioMap = ${JSON.stringify(updatedMap, null, 2)};
`;

  fs.writeFileSync(AUDIO_MAP_FILE, mapCode, 'utf8');
  console.log(`\n🎉 Audio Generation Finished!`);
  console.log(`Generated: ${generatedCount} files`);
  console.log(`Skipped (already present): ${skippedCount} files`);
  console.log(`Updated audioMap saved to: src/utils/audioMap.js\n`);
}

run().catch(err => {
  console.error('Fatal error during audio generation:', err);
  process.exit(1);
});
