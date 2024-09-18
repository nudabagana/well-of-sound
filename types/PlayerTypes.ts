import { AudioFile } from "./FileTypes";

export type VoidOrNull = (() => void) | null;
export type Player = {
  src?: string;
  htmlAudioElement?: HTMLAudioElement;

  getDuration: () => Promise<number>;
  getVolume: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  isPaused: () => Promise<boolean>;
  isEnded: () => Promise<boolean>;
  isShuffling: () => Promise<boolean>;

  setShuffling: (val: boolean) => void;
  setVolume: (val: number) => Promise<void>;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  playTrack: (uuid: string) => void;

  getTrack: () => AudioFile | null;
  setTracks: (tracks: AudioFile[]) => void;
  getTracks: () => AudioFile[];

  onTracksChange: VoidOrNull;
  onPause: VoidOrNull;
  onPlay: VoidOrNull;
  onDurationChange: VoidOrNull;
  onTrackChange: ((name: string) => void) | null;
};
