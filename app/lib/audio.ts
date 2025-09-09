/* eslint-disable @typescript-eslint/no-unused-vars */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<{ success: boolean; error?: string }> {
    try {
      // Request microphone permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType(),
      });

      this.audioChunks = [];

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms

      return { success: true };
    } catch (error) {
      console.error("Error starting recording:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to start recording",
      };
    }
  }

  async stopRecording(): Promise<{
    success: boolean;
    audioBlob?: Blob;
    error?: string;
  }> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ success: false, error: "No active recording" });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.getSupportedMimeType(),
        });

        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }

        resolve({ success: true, audioBlob });
      };

      this.mediaRecorder.stop();
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
    }
  }

  getRecordingState(): string {
    return this.mediaRecorder?.state || "inactive";
  }

  private getSupportedMimeType(): string {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "audio/webm"; // Fallback
  }

  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function" &&
      typeof window.MediaRecorder === "function"
    );
  }

  static async checkPermissions(): Promise<{
    granted: boolean;
    error?: string;
  }> {
    try {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      return { granted: result.state === "granted" };
    } catch (error) {
      // Fallback: try to access microphone directly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return { granted: true };
      } catch (micError) {
        return {
          granted: false,
          error:
            micError instanceof Error
              ? micError.message
              : "Microphone access denied",
        };
      }
    }
  }
}

export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private onTimeUpdate?: (currentTime: number, duration: number) => void;
  private onEnded?: () => void;

  constructor(
    onTimeUpdate?: (currentTime: number, duration: number) => void,
    onEnded?: () => void
  ) {
    this.onTimeUpdate = onTimeUpdate;
    this.onEnded = onEnded;
  }

  loadAudio(audioUrl: string): void {
    this.audio = new Audio(audioUrl);

    if (this.onTimeUpdate) {
      this.audio.addEventListener("timeupdate", () => {
        if (this.audio && this.onTimeUpdate) {
          this.onTimeUpdate(this.audio.currentTime, this.audio.duration);
        }
      });
    }

    if (this.onEnded) {
      this.audio.addEventListener("ended", () => {
        if (this.onEnded) {
          this.onEnded();
        }
      });
    }
  }

  async play(): Promise<void> {
    if (this.audio) {
      try {
        await this.audio.play();
      } catch (error) {
        console.error("Error playing audio:", error);
        throw error;
      }
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  setCurrentTime(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener("timeupdate", () => {});
      this.audio.removeEventListener("ended", () => {});
      this.audio = null;
    }
  }
}

// Utility functions
export function formatAudioDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function createAudioWaveform(
  audioBuffer: AudioBuffer,
  width: number = 200,
  height: number = 40
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  const data = audioBuffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const amp = height / 2;

  ctx.fillStyle = "#3b82f6";
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;

    for (let j = 0; j < step; j++) {
      const datum = data[i * step + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }

    const barHeight = (max - min) * amp;
    ctx.fillRect(i, amp - barHeight / 2, 1, barHeight);
  }

  return canvas.toDataURL();
}

export async function compressAudio(
  audioBlob: Blob,
  quality: number = 0.7
): Promise<Blob> {
  // This is a simplified compression - in a real app you might want to use a library like lamejs
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // For now, just return the original blob
      // In production, you'd implement actual audio compression here
      resolve(audioBlob);
    };
    reader.readAsArrayBuffer(audioBlob);
  });
}
