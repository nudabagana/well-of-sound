import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { formatS } from "../utils/timeUtils";

type Props = {
  onFiles(event: ChangeEvent<HTMLInputElement>): void;
  clearFiles(): void;
  play(): void;
  pause(): void;
  volume: { val: number; set: Dispatch<SetStateAction<number>> };
  isPlaying: boolean;
  player?: HTMLAudioElement | null;
};

const Controls: FC<Props> = ({
  onFiles,
  clearFiles,
  play,
  pause,
  volume,
  isPlaying,
  player,
}) => {
  const [duration, setDuration] = useState<number>();
  const [playTime, setPlayTime] = useState<number>(0);

  useEffect(() => {
    if (player) {
      player.ondurationchange = (ev) => {
        setDuration(Math.floor(player.duration));
      };
      player.ontimeupdate = (ev) => {
        setPlayTime(Math.floor(player.currentTime));
      };
    }
  }, [player]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        alignItems: "start",
        gap: "10px",
        border: "solid 3px black",
        padding: "5px",
        marginBottom: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "start" }}>
        <input
          type="file"
          name="myImage"
          accept="*"
          multiple
          onChange={onFiles}
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            fontSize: "18px",
            width: "280px",
          }}
          onClick={(event) => {
            if (event.target instanceof HTMLInputElement) {
              event.target.value = "";
            }
          }}
        />
        <button
          style={{
            fontSize: "18px",
            padding: "5px",
          }}
          onClick={clearFiles}
        >
          Clear files
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            fontSize: "18px",
            padding: "5px",
          }}
          onClick={isPlaying ? pause : play}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="range"
            min={0}
            max={duration}
            value={playTime}
            style={{ width: "200px", margin: "10px" }}
            onChange={(e) => {
              if (player) {
                player.currentTime = Number(e.target.value);
              }
            }}
          />
          <div>
            {formatS(playTime)}/{formatS(duration)}
          </div>
        </div>
      </div>
      <div>
        <p style={{ margin: "0px" }}>Volume - {volume.val}%</p>
        <input
          type="range"
          min="0"
          max="100"
          value={volume.val}
          onChange={(e) => volume.set(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Controls;
