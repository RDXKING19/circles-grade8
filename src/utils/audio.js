/* =========================================================================
   AUDIO ENGINE  (ElevenLabs "Alice" pipeline)
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2

   Strict Rule: No browser Web Speech API fallback under any circumstance.
   If audio is missing or muted, playback silently continues/skips.
   ========================================================================= */
import { audioMap } from './audioMap.js';
import { VOICE_ID, MODEL_ID, STYLE_SETTINGS } from '../config/audio.config.js';

export { VOICE_ID, MODEL_ID, STYLE_SETTINGS };

const API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ELEVENLABS_API_KEY) || '';

/* ------------------------------------------------------------------ state */
export let audioMuted = false;
let currentAudioElement = null;
let currentQueue = 0;
const dynamicCache = new Map(); // "style::text" -> Promise<blobUrl | null>
const warmCache = new Map();    // url -> preloaded <audio>

export function setMuted(muted) {
  audioMuted = muted;
  if (muted && currentAudioElement) {
    try {
      currentAudioElement.pause();
    } catch (e) {
      // Ignore
    }
    currentAudioElement = null;
  }
}

/* ---------------------------------------------------------- URL resolution */
async function fetchDynamic(text, style) {
  const cfg = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
  const voice_settings = {
    stability: cfg.stability,
    similarity_boost: cfg.similarity_boost,
    style: cfg.style,
    use_speaker_boost: cfg.use_speaker_boost
  };
  try {
    let res;
    if (API_KEY) {
      res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
            'xi-api-key': API_KEY
          },
          body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings })
        }
      );
    } else {
      res = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: VOICE_ID, modelId: MODEL_ID, voice_settings })
      });
    }
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    return null;
  }
}

/** Resolve the audio URL for a line: static map first, then live ElevenLabs. */
export function getAudioUrl(text, style = 'statement') {
  if (!text) return Promise.resolve(null);
  if (audioMap[text]) {
    warmStatic(audioMap[text]);
    return Promise.resolve(audioMap[text]);
  }
  const key = `${style}::${text}`;
  if (!dynamicCache.has(key)) dynamicCache.set(key, fetchDynamic(text, style));
  return dynamicCache.get(key);
}

function warmStatic(url) {
  if (typeof Audio === 'undefined' || warmCache.has(url)) return;
  try {
    const a = new Audio();
    a.preload = 'auto';
    a.src = url;
    warmCache.set(url, a);
  } catch (e) {
    // Ignore warm cache errors
  }
}

/* --------------------------------------------------------------- playback */
function playUrl(url) {
  return new Promise(resolve => {
    if (typeof Audio === 'undefined' || !url) return resolve(false);
    let audio;
    try {
      audio = warmCache.get(url) || new Audio(url);
      audio.currentTime = 0;
    } catch (e) {
      return resolve(false);
    }
    currentAudioElement = audio;
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.play().catch(() => resolve(false));
  });
}

export function stopNarration() {
  currentQueue++;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
    } catch (e) {
      // Ignore
    }
    currentAudioElement = null;
  }
}

export async function narrate(segments = [], cancelExisting = true) {
  if (audioMuted || !segments || segments.length === 0) return;
  if (cancelExisting) stopNarration();
  const queueId = ++currentQueue;

  for (let i = 0; i < segments.length; i++) {
    if (queueId !== currentQueue || audioMuted) return;
    const seg = segments[i];

    // Eagerly preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }

    const url = await getAudioUrl(seg.text, seg.style);
    if (queueId !== currentQueue || audioMuted) return;
    if (url) {
      await playUrl(url);
    }
  }
}

export function preloadNarration(segments = []) {
  if (!segments) return;
  segments.forEach(seg => {
    if (seg && seg.text) getAudioUrl(seg.text, seg.style);
  });
}

/* ------------------------------------------------ Synthesized Tactile Sound */
let audioCtx = null;
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playClickSound() {
  if (audioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore audio error
  }
}

export function playSuccessChime() {
  if (audioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.25);
    });
  } catch (e) {
    // Ignore
  }
}
