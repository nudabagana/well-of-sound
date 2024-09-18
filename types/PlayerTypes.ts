export type AudioTrack = { id: string; url: string; name: string };
export type VoidOrNull = (() => void) | null;
export type Player = {
  htmlAudioElement?: HTMLAudioElement;

  getDuration: () => Promise<number>;
  getCurrentTime: () => Promise<number>;
  setCurrentTime: (time: number) => void;

  getVolume: () => Promise<number>;
  setVolume: (val: number) => Promise<void>;

  isShuffling: () => Promise<boolean>;
  setShuffling: (val: boolean) => void;

  isPaused: () => Promise<boolean>;

  getTrack: () => Promise<AudioTrack | null>;
  setTrack: (uuid: string) => boolean;
  getTracks: () => AudioTrack[];
  setTracks: (tracks: AudioTrack[]) => void;

  play: () => void;
  pause: () => void;

  onDurationChange: VoidOrNull;
  onPauseChange: ((isPaused: boolean) => void) | null;
  onTracksChange: VoidOrNull;
  onTrackChange: ((track: AudioTrack | null) => void) | null;
};
