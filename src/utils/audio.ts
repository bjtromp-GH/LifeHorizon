// A lightweight synthesizer for a UI click sound using the Web Audio API
// This avoids the need for external sound files and loads instantly.

let audioCtx: AudioContext | null = null;

export const playClickSound = () => {
  try {
    // Initialize AudioContext only on first user interaction
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    
    // Resume context if suspended (common browser autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    
    // Create oscillator and gain node
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // UI "pop" sound: quick pitch drop
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
    
    // Quick volume envelope
    gainNode.gain.setValueAtTime(0.15, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    // Connect and play
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.05);
  } catch (e) {
    console.warn("Audio playback failed", e);
  }
};

export const playChimeSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const t = audioCtx.currentTime;
    
    // First note (E5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, t); // E5
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.1, t + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(t);
    osc1.stop(t + 0.5);

    // Second note (B5) slightly later
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, t + 0.1); // B5
    gain2.gain.setValueAtTime(0, t + 0.1);
    gain2.gain.linearRampToValueAtTime(0.15, t + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.8);

  } catch (e) {
    console.warn("Audio playback failed", e);
  }
};

export const setupGlobalClickListener = () => {
  if (typeof window === 'undefined') return;
  
  const handleClick = (e: MouseEvent) => {
    // Check if the clicked element or its parent is a button or interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('.cursor-pointer');
    
    if (isInteractive) {
      playClickSound();
    }
  };

  document.addEventListener('click', handleClick);
  
  return () => {
    document.removeEventListener('click', handleClick);
  };
};
