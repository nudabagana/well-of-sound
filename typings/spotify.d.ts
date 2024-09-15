// to make TS treat this as 'local' and not ambient type def
// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts
import "";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
  namespace Spotify {
    class Player {
      constructor(options: SpotifyPlayerOptions);
      connect(): Promise<void>;
      addListener: (str: string, obj: any) => void;
      togglePlay: () => void;
      pause: () => void;
      resume: () => void;
      setVolume: (num: number) => void;
      getCurrentState: () => Promise<WebPlaybackState>;
      seek: (position_ms: number) => Promise<void>;
      getVolume: () => Promise<number>;
    }
  }
}

type SpotifyPlayerOptions = {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume: number;
  enableMediaSession?: boolean;
};

type WebPlaybackState = {
  context: {
    uri?: string;
    metadata?: any;
  };
  disallows: {
    pausing?: boolean;
    peeking_next?: boolean;
    peeking_prev?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
  };
  paused: boolean;
  position: number;
  duration: number;
  repeat_mode: 0 | 1 | 2;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack?;
    previous_tracks: WebPlaybackTrack[];
    next_tracks: WebPlaybackTrack[];
  };
};

type WebPlaybackTrack = { id: string; name: string; artists: Artist[] };

type Artist = { name: string; uri: string; url: string };

type CBError = { message: string };
