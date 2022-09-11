import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import { Animations } from "../animations/AnimationList";
import PlayPauseIcon from "../icons/PlayPauseIcon";
import ShuffleIcon from "../icons/ShuffleIcon";
import Button from "../styled/buttons/Button";
import { FileInputWrapper } from "../styled/buttons/FileInputWrapper";
import { Clrs } from "../styled/consts";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { AudioFile } from "../types/FileTypes";
import { randomInt } from "../utils/mathUtls";
import { formatS, MS_IN_S } from "../utils/timeUtils";

const RANDOM_ID = "random";
const CHANGE_INTERVAL = 30 * MS_IN_S;

type Props = {
  player?: HTMLAudioElement | null;
  setAudioFiles: Dispatch<SetStateAction<AudioFile[]>>;
  setCurrFile: Dispatch<SetStateAction<AudioFile | undefined>>;
  currFile: AudioFile | undefined;
  setAnimation: Dispatch<SetStateAction<Animation | undefined>>;
  animation?: Animation;
  audioFiles: AudioFile[];
};

const Controls: FC<Props> = ({
  player,
  setAudioFiles,
  setCurrFile,
  currFile,
  setAnimation,
  animation,
  audioFiles,
}) => {
  const [duration, setDuration] = useState<number>();
  const [playTime, setPlayTime] = useState<number>(0);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [randomAnimation, setRandomAnimation] = useState(true);

  useEffect(() => {
    if (player) {
      player.volume = volume / 100;
    }
  }, [volume, player]);

  useEffect(() => {
    if (player) {
      player.onpause = (e) => !player.ended && setIsPlaying(false);
      player.onplay = () => setIsPlaying(true);
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.ondurationchange = () => setDuration(Math.floor(player.duration));
      player.ontimeupdate = () => setPlayTime(Math.floor(player.currentTime));
    }
  }, [player]);

  useEffect(() => {
    window.onkeydown = (e) => {
      if (player) {
        if (e.key === "ArrowLeft") {
          player.currentTime -= 15;
        } else if (e.key === "ArrowRight") {
          player.currentTime += 15;
        } else if (e.key === " ") {
          player.paused ? player.play() : player.pause();
        }
      }
    };
  }, [player]);

  useEffect(() => {
    let intervalId: number | undefined = undefined;
    const changeAnimation = () =>
      setAnimation(Animations[randomInt(Animations.length)]);
    if (randomAnimation && player) {
      intervalId = window.setInterval(changeAnimation, CHANGE_INTERVAL);
    }
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [randomAnimation, setAnimation, player]);

  useEffect(() => {
    if (player) {
      player.onended = () => {
        let nextFile =
          shuffle || !currFile
            ? audioFiles[Math.floor(Math.random() * audioFiles.length)]
            : audioFiles[audioFiles.indexOf(currFile) + 1];

        if (nextFile === currFile) {
          nextFile =
            audioFiles[audioFiles.indexOf(currFile) + 1] ??
            audioFiles[audioFiles.indexOf(currFile) - 1];
        }

        if (!nextFile) {
          setIsPlaying(false);
        } else {
          setCurrFile(nextFile);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, audioFiles, shuffle, currFile]);

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArr = [...files].map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        id: uuid(),
      }));
      setAudioFiles((existingFiles) =>
        existingFiles ? [...existingFiles, ...filesArr] : filesArr
      );
      if (!currFile) {
        setCurrFile(filesArr[Math.floor(Math.random() * filesArr.length)]);
      }
    }
  };

  const clearFiles = () => setAudioFiles([]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        alignItems: "start",
        gap: "10px",
        border: `solid 3px ${Clrs.primary}`,
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <FileInputWrapper>
          <input
            type="file"
            accept=".mp3,audio/*"
            multiple
            onChange={onFiles}
            onClick={(event) => {
              if (event.target instanceof HTMLInputElement) {
                event.target.value = "";
              }
            }}
          />
          Add Files
        </FileInputWrapper>
        <Button
          style={{
            fontSize: "18px",
            padding: "5px",
          }}
          onClick={clearFiles}
        >
          Clear files
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <PlayPauseIcon
          onClick={() => (isPlaying ? player?.pause() : player?.play())}
          active={isPlaying}
        />
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <input
            type="range"
            min={0}
            max={duration}
            value={playTime}
            style={{ width: "100%", margin: "10px" }}
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
      <FlexDiv
        style={{ justifyContent: "space-between", width: "100%", gap: "25px" }}
      >
        <div>
          <p style={{ margin: "0px 0px 5px 0" }}>Volume - {volume}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => setShuffle((s) => !s)}
        >
          <ShuffleIcon active={shuffle} />
        </div>
        <div>
          <p style={{ margin: "0px 0px 5px 0" }}>Visualizer</p>
          <select
            style={{ width: "100px", fontSize: "16px" }}
            value={randomAnimation ? RANDOM_ID : animation?.id}
            onChange={(e) => {
              const val = e.target.value;
              if (val === RANDOM_ID) {
                setRandomAnimation(true);
              } else {
                const newAnimation = Animations.find(
                  ({ id }) => id === e.target.value
                );
                setAnimation(newAnimation);
                setRandomAnimation(false);
              }
            }}
          >
            {[{ id: RANDOM_ID, name: "Random" }, ...Animations].map(
              ({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              )
            )}
          </select>
        </div>
      </FlexDiv>
    </div>
  );
};

export default Controls;
