import { Player, VoidOrNull } from "../types/PlayerTypes";
import {
  CBError,
  WebPlaybackState,
  WebPlaybackTrack,
} from "../typings/spotify";
import { MS_IN_S } from "../utils/timeUtils";
import { wait } from "../utils/waitUtils";

const SPOTIFY_TOKEN =
  "BQAzq3hzxMcBu6R6SKigonc21aqjtFn9XoDA5AMdmbOeOCqhgRxsrOqXJ6ZbjoWDejw6nh4juIDUbStvCoz9XYky8Ag74aZM81KEVWuHOZf74gfA_RcQ9LUVyLQNJ6w5u9KWRWuOKPhOdV7iFA25Fc8pXqUif0a53nm6OyjiaVpaP_2M24VHEBWtvHY_gjEsDmieYpI6mEfe6w_6EA";

export const makeSpotifyPlayer = (cb: (player: Player) => void) => {
  let player = new Spotify.Player({
    name: "Well of Sound",
    getOAuthToken: (cb) => {
      cb(SPOTIFY_TOKEN);
    },
    volume: 0.5,
    enableMediaSession: false,
  });

  let duration = 0;
  let trackName: string = "";
  let onEndedF: VoidOrNull = null;
  let onDurationChangeF: VoidOrNull = null;
  let onPlayF: VoidOrNull = null;
  let onPauseF: VoidOrNull = null;
  let onTrackChangeF: ((name: string) => void) | null = null;

  player.addListener("player_state_changed", (state: WebPlaybackState) => {
    if (duration !== state.duration) {
      onDurationChangeF?.();
    }
    const newTrackName = makeTrackName(state.track_window.current_track);
    if (trackName !== newTrackName) {
      trackName = newTrackName;
      onTrackChangeF?.(trackName);
    }
  });
  setupErrLogging(player);

  const playerToReturn = {
    async getVolume() {
      return player.getVolume();
    },
    async setVolume(value: number) {
      player.setVolume(value);
    },

    async getCurrentTime() {
      const state = await player.getCurrentState();
      return (state?.position ?? 0) / MS_IN_S;
    },
    async setCurrentTime(value: number) {
      await player.seek(value * MS_IN_S);
    },
    async getDuration() {
      const state = await player.getCurrentState();
      return Math.floor(state.duration / MS_IN_S);
    },
    async isEnded() {
      const state = await player.getCurrentState();
      return state.position === state.duration;
    },
    async isPaused() {
      const state = await player.getCurrentState();
      return state.paused;
    },

    play() {
      player.resume();
      onPlayF?.();
    },
    pause() {
      player.pause();
      onPauseF?.();
    },

    get onPause() {
      return onPauseF;
    },
    set onPause(f: VoidOrNull) {
      onPauseF = f;
    },
    get onPlay() {
      return onPlayF;
    },
    set onPlay(f: VoidOrNull) {
      onPlayF = f;
    },
    get onDurationChange() {
      return onDurationChangeF;
    },
    set onDurationChange(f: VoidOrNull) {
      onDurationChangeF = f;
    },
    get onEnded() {
      return onEndedF;
    },
    set onEnded(f: VoidOrNull) {
      onEndedF = f;
    },
    get onTrackChange() {
      return onTrackChangeF;
    },
    set onTrackChange(f: ((name: string) => void) | null) {
      onTrackChangeF = f;
    },
  };

  player.addListener("ready", () => {
    cb(playerToReturn);
  });
  player.connect();
};

const makeTrackName = (track?: WebPlaybackTrack | null) => {
  if (!track) {
    return "";
  }

  return `${track.artists.map(({ name }) => name).join(", ")} - ${track.name}`;
};

const setupErrLogging = (player: Spotify.Player) => {
  player.addListener("not_ready", () => {
    console.log("Spotify - Not ready");
  });

  player.addListener("initialization_error", ({ message }: CBError) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }: CBError) => {
    console.error(message);
  });

  player.addListener("account_error", ({ message }: CBError) => {
    console.error(message);
  });
};
