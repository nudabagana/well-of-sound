export type VoidOrNull = (() => void) | null;
export type Player = {
  src?: string;
  htmlAudioElement?: HTMLAudioElement;

  getDuration: () => Promise<number>;
  getVolume: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  isPaused: () => Promise<boolean>;
  isEnded: () => Promise<boolean>;

  setVolume: (val: number) => Promise<void>;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;

  onPause: VoidOrNull;
  onPlay: VoidOrNull;
  onDurationChange: VoidOrNull;
  onEnded: VoidOrNull;
  onTrackChange: ((name: string) => void) | null;
};
