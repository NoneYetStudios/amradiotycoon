/**
 * AM RADIO TYCOON — Web Audio API Retro Broadcast Synthesizer
 * Synthesizes dial clicks, teletype chatter, EBS alert tones, and cash register chimes without external audio files.
 */
(function (root) {
  'use strict';

  const MUTE_KEY = 'amrt_sfx_muted_v1';

  class RetroAudio {
    constructor() {
      this.ctx = null;
      this.muted = false;
      try {
        this.muted = localStorage.getItem(MUTE_KEY) === '1';
      } catch (e) {
        this.muted = false;
      }
    }

    ensureContext() {
      if (this.muted) return null;
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(function () {});
      }
      return this.ctx;
    }

    toggleMute() {
      this.muted = !this.muted;
      try {
        localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0');
      } catch (e) {}
      if (!this.muted) {
        this.playClick();
      }
      return this.muted;
    }

    playTone(freq, duration, type, volume, delay) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime + (delay || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume || 0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    playClick() {
      this.playTone(540, 0.045, 'triangle', 0.07, 0);
      this.playTone(760, 0.03, 'sine', 0.04, 0.02);
    }

    playTeletype() {
      this.playTone(1150, 0.025, 'square', 0.03, 0);
      this.playTone(980, 0.025, 'square', 0.025, 0.055);
      this.playTone(1240, 0.025, 'square', 0.03, 0.11);
    }

    playEmergencyAlert() {
      // Classic dual-tone broadcast alert flavor (853Hz + 960Hz)
      this.playTone(853, 0.24, 'sawtooth', 0.045, 0);
      this.playTone(960, 0.24, 'sawtooth', 0.045, 0);
      this.playTone(853, 0.24, 'sawtooth', 0.045, 0.30);
      this.playTone(960, 0.24, 'sawtooth', 0.045, 0.30);
    }

    playSuccess() {
      this.playTone(523.25, 0.09, 'triangle', 0.07, 0);
      this.playTone(659.25, 0.10, 'triangle', 0.07, 0.08);
      this.playTone(783.99, 0.15, 'triangle', 0.08, 0.16);
    }

    playWarning() {
      this.playTone(280, 0.14, 'sawtooth', 0.05, 0);
      this.playTone(220, 0.20, 'sawtooth', 0.05, 0.14);
    }

    playStaticBurst() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const sampleCount = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.18;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    }
  }

  root.AMRT_AUDIO = new RetroAudio();
})(typeof window !== 'undefined' ? window : globalThis);
