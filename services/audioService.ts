
class CryptoSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private nextNoteTime: number = 0;
  private currentStep: number = 0;
  private timerId: number | null = null;

  // C-Major Pentatonic for a "positive" crypto feel
  private scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
  private pattern = [0, 2, 4, 3, 5, 4, 2, 1];

  constructor() {}

  public start() {
    if (this.isPlaying) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) window.clearTimeout(this.timerId);
    if (this.ctx) this.ctx.close();
  }

  private playNote(freq: number, time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square'; // Bit-pop feel
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  private scheduler() {
    while (this.ctx && this.nextNoteTime < this.ctx.currentTime + 0.1) {
      const freq = this.scale[this.pattern[this.currentStep % this.pattern.length]];
      this.playNote(freq, this.nextNoteTime);
      this.nextNoteTime += 0.2; // BPM control
      this.currentStep++;
    }
    if (this.isPlaying) {
      this.timerId = window.setTimeout(() => this.scheduler(), 25);
    }
  }
}

export const synth = new CryptoSynth();
