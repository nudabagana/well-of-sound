import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

type Props = {
  onFiles(event: ChangeEvent<HTMLInputElement>): void;
  clearFiles(): void;
  play(): void;
  pause(): void;
  volume: { val: number; set: Dispatch<SetStateAction<number>> };
  isPlaying: boolean;
};

const Controls: FC<Props> = ({
  onFiles,
  clearFiles,
  play,
  pause,
  volume,
  isPlaying,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
      }}
    >
      <input
        type="file"
        name="myImage"
        accept="*"
        multiple
        onChange={onFiles}
        style={{ marginTop: "auto", marginBottom: "auto" }}
        onClick={(event) => {
          if (event.target instanceof HTMLInputElement) {
            event.target.value = "";
          }
        }}
      />
      <button
        style={{
          margin: "30px",
          fontSize: "20px",
          padding: "5px 60px",
        }}
        onClick={clearFiles}
      >
        Clear files
      </button>
      <button
        style={{
          margin: "30px",
          fontSize: "20px",
          padding: "5px 60px",
        }}
        onClick={isPlaying ? pause : play}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <p>Volume - {volume.val}%</p>
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
