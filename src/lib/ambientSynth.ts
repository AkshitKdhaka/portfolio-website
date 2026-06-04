class AmbientSynth {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  public start() {
    if (this.ctx) return;

    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      // Create Nodes
      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      this.filter = this.ctx.createBiquadFilter();
      this.gainNode = this.ctx.createGain();
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();

      // Osc 1: Base Warm Sine/Triangle Blend
      this.osc1.type = 'triangle';
      this.osc1.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2 chord frequency

      // Osc 2: Beating Detune Sub Frequency
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(65.75, this.ctx.currentTime); // Soft chorus drift

      // Lowpass Filter: Soft atmospheric cushion
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Controlled baseline gain (very faint background hum, completely safe for audio output)
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.2);

      // Low-Frequency Oscillator (LFO): Organic breathing cadence
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.09, this.ctx.currentTime); // Slow breathing cycle
      this.lfoGain.gain.setValueAtTime(0.015, this.ctx.currentTime); // Tiny volume modulations

      // Connecting pipeline
      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      // Modulate the main gain with our LFO
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.gainNode.gain);

      // Play audio sequence
      this.osc1.start();
      this.osc2.start();
      this.lfo.start();
    } catch (e) {
      console.error('Ambient Audio context failed to trigger:', e);
    }
  }

  public stop() {
    if (!this.ctx) return;

    try {
      const curTime = this.ctx.currentTime;
      if (this.gainNode) {
        this.gainNode.gain.cancelScheduledValues(curTime);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, curTime);
        this.gainNode.gain.linearRampToValueAtTime(0, curTime + 0.4);
      }

      const activeContext = this.ctx;
      const osc1Copy = this.osc1;
      const osc2Copy = this.osc2;
      const lfoCopy = this.lfo;

      setTimeout(() => {
        try {
          if (osc1Copy) { osc1Copy.stop(); osc1Copy.disconnect(); }
          if (osc2Copy) { osc2Copy.stop(); osc2Copy.disconnect(); }
          if (lfoCopy) { lfoCopy.stop(); lfoCopy.disconnect(); }
          if (this.filter) this.filter.disconnect();
          if (this.gainNode) this.gainNode.disconnect();
          if (this.lfoGain) this.lfoGain.disconnect();
          activeContext.close();
        } catch (err) {
          console.warn('Nodes cleanup error:', err);
        }
      }, 500);
    } catch (e) {
      console.error('Audio synthesizer stop failure:', e);
    } finally {
      this.ctx = null;
      this.osc1 = null;
      this.osc2 = null;
      this.filter = null;
      this.gainNode = null;
      this.lfo = null;
      this.lfoGain = null;
    }
  }

  public playTransitionSound() {
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioContextClass) return;

      const tempCtx = new AudioContextClass();
      
      const osc = tempCtx.createOscillator();
      const gain = tempCtx.createGain();
      const filter = tempCtx.createBiquadFilter();

      // Cyberpunk clean, soft transition pulse
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, tempCtx.currentTime); // High pitch note
      osc.frequency.exponentialRampToValueAtTime(1100, tempCtx.currentTime + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, tempCtx.currentTime);

      gain.gain.setValueAtTime(0, tempCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.012, tempCtx.currentTime + 0.02); // Ultra faint (1.2% volume)
      gain.gain.exponentialRampToValueAtTime(0.0001, tempCtx.currentTime + 0.22); // Smoothly decay down

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(tempCtx.destination);

      osc.start();
      osc.stop(tempCtx.currentTime + 0.25);

      setTimeout(() => {
        try {
          tempCtx.close();
        } catch (_) {}
      }, 300);
    } catch (_) {
      // Intentionally silent
    }
  }

  public playClickPingSound() {
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioContextClass) return;

      const tempCtx = new AudioContextClass();
      
      const osc = tempCtx.createOscillator();
      const gain = tempCtx.createGain();

      // Sharp, clean high-frequency haptic acoustic ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2500, tempCtx.currentTime); // Crisp top frequency
      osc.frequency.exponentialRampToValueAtTime(1250, tempCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0, tempCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.008, tempCtx.currentTime + 0.003); // Non-intrusive safe click gain (0.8% volume level)
      gain.gain.exponentialRampToValueAtTime(0.0001, tempCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(tempCtx.destination);

      osc.start();
      osc.stop(tempCtx.currentTime + 0.07);

      setTimeout(() => {
        try {
          tempCtx.close();
        } catch (_) {}
      }, 100);
    } catch (_) {
      // Intentionally silent
    }
  }
}

export const ambientSynth = new AmbientSynth();
