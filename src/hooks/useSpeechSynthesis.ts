import { useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const lastSpokenRef = useRef<string | null>(null);
  const cooldownRef = useRef<number>(0);

  const speak = useCallback((text: string) => {
    if (!text || !window.speechSynthesis) return;

    const now = Date.now();
    
    // Prevent speaking the same text within 2 seconds
    if (text === lastSpokenRef.current && now - cooldownRef.current < 2000) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes('Google') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex') ||
        voice.lang.startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    lastSpokenRef.current = text;
    cooldownRef.current = now;
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
};
