import { get, set } from "idb-keyval";

export interface BGMFile {
  id: string;
  name: string;
  buffer: ArrayBuffer;
}

class AudioManager {
  private bgmAudio!: HTMLAudioElement;
  private clickAudio!: HTMLAudioElement;
  private isBgmEnabled = false;
  private bgmFiles: BGMFile[] = [];
  private currentBgmIndex = -1;
  private listeners: Set<() => void> = new Set();
  public isClickEnabled = true;

  constructor() {
    if (typeof window !== "undefined") {
      this.bgmAudio = new Audio();
      this.bgmAudio.loop = false;
      this.bgmAudio.volume = 0.5;
      
      this.clickAudio = new Audio();
      
      this.bgmAudio.addEventListener("ended", () => {
        this.playRandomBgm();
      });
      
      this.init();
    }
  }

  async init() {
    if (typeof window === "undefined") return;
    const clickPref = localStorage.getItem("audio_click_enabled");
    if (clickPref !== null) {
      this.isClickEnabled = clickPref === "true";
    }

    const bgmPref = localStorage.getItem("audio_bgm_enabled");
    if (bgmPref !== null) {
      this.isBgmEnabled = bgmPref === "true";
    }

    const files = await get("bgm_files");
    if (files && Array.isArray(files)) {
      this.bgmFiles = files;
    }

    this.notify();

    if (this.isBgmEnabled && this.bgmFiles.length > 0) {
      this.playRandomBgm();
    }

    // Attach click listener to document
    if (typeof window !== "undefined") {
      document.addEventListener(
        "click",
        (e) => {
          const target = e.target as HTMLElement;
          const isInteractive = target.closest(
            'button, a, input, select, textarea, [role="button"], [role="tab"]',
          );
          if (isInteractive) {
            this.playClick();
          }
        },
        { capture: true },
      ); // capture phase so it happens immediately
    }
  }

  playClick() {
    if (!this.isClickEnabled) return;

    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn("AudioContext click failed", e);
    }
  }

  playRandomBgm() {
    if (this.bgmFiles.length === 0) return;
    if (!this.isBgmEnabled) return;

    // Pick a random track different from current if possible
    let nextIndex = Math.floor(Math.random() * this.bgmFiles.length);
    if (this.bgmFiles.length > 1 && nextIndex === this.currentBgmIndex) {
      nextIndex = (nextIndex + 1) % this.bgmFiles.length;
    }

    this.currentBgmIndex = nextIndex;
    const file = this.bgmFiles[this.currentBgmIndex];

    const blob = new Blob([file.buffer], { type: "audio/mpeg" }); // assume mp3/m4a
    const url = URL.createObjectURL(blob);

    if (this.bgmAudio.src && this.bgmAudio.src.startsWith('blob:')) {
      URL.revokeObjectURL(this.bgmAudio.src);
    }
    this.bgmAudio.src = url;
    this.bgmAudio.play().catch((e) => console.warn("Autoplay prevented", e));
  }

  setBgmEnabled(enabled: boolean) {
    this.isBgmEnabled = enabled;
    if (typeof window !== "undefined") localStorage.setItem("audio_bgm_enabled", String(enabled));
    if (enabled) {
      this.playRandomBgm();
    } else {
      this.bgmAudio.pause();
    }
    this.notify();
  }

  setClickEnabled(enabled: boolean) {
    this.isClickEnabled = enabled;
    if (typeof window !== "undefined") localStorage.setItem("audio_click_enabled", String(enabled));
    this.notify();
  }

  async addBgmFile(name: string, buffer: ArrayBuffer) {
    const newFile = { id: crypto.randomUUID(), name, buffer };
    this.bgmFiles.push(newFile);
    await set("bgm_files", this.bgmFiles);
    this.notify();

    if (this.isBgmEnabled && this.bgmAudio.paused) {
      this.playRandomBgm();
    }
  }

  async removeBgmFile(id: string) {
    this.bgmFiles = this.bgmFiles.filter((f) => f.id !== id);
    await set("bgm_files", this.bgmFiles);

    if (this.bgmFiles.length === 0) {
      this.bgmAudio.pause();
      this.currentBgmIndex = -1;
    } else if (this.bgmFiles[this.currentBgmIndex]?.id === id) {
      // currently playing file was removed
      this.playRandomBgm();
    }

    this.notify();
  }

  getBgmFiles() {
    return this.bgmFiles;
  }

  getBgmEnabled() {
    return this.isBgmEnabled;
  }

  getClickEnabled() {
    return this.isClickEnabled;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const audioManager = new AudioManager();
