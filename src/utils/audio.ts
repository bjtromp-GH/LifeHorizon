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
