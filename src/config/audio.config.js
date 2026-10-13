/* =========================================================================
   AUDIO CONFIGURATION (ElevenLabs Alice Profile)
   ========================================================================= */

export const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
export const MODEL_ID = 'eleven_multilingual_v2';

export const STYLE_SETTINGS = {
  statement: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.15,
    use_speaker_boost: true
  },
  question: {
    stability: 0.45,
    similarity_boost: 0.85,
    style: 0.35,
    use_speaker_boost: true
  },
  encouragement: {
    stability: 0.4,
    similarity_boost: 0.85,
    style: 0.55,
    use_speaker_boost: true
  },
  emphasis: {
    stability: 0.6,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true
  },
  thinking: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.2,
    use_speaker_boost: true
  },
  celebration: {
    stability: 0.35,
    similarity_boost: 0.9,
    style: 0.65,
    use_speaker_boost: true
  }
};
