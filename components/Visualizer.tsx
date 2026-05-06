import { FC, useEffect, useRef, useState } from "react";
import ResizeIcon from "../icons/ResizeIcon";
import { Clrs } from "../styled/consts";
import { Analyser, Animation } from "../types/AnimationTypes";

type Props = {
  player?: HTMLAudioElement | null;
  mediaStream?: MediaStream | null;
  mediaStreamGain?: number;
  onLevel?: (level: number) => void;
  animation?: Animation;
};

const Visualizer: FC<Props> = ({
  player,
  mediaStream,
  mediaStreamGain = 1,
  onLevel,
  animation,
}) => {
  const [analyser, setAnalyser] = useState<Analyser>();
  const [fullScreen, setFullScreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;

  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [fullScreen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullScreen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (mediaStream) {
      const audioCtx = new AudioContext();
      const audioSource = audioCtx.createMediaStreamSource(mediaStream);
      const gain = audioCtx.createGain();
      const analyser = audioCtx.createAnalyser();
      analyser.smoothingTimeConstant = 0.75;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -20;
      gain.gain.value = mediaStreamGain;
      audioSource.connect(gain);
      gain.connect(analyser);
      audioCtx.resume();
      setAnalyser(analyser);

      return () => {
        audioSource.disconnect();
        gain.disconnect();
        analyser.disconnect();
        audioCtx.close();
        setAnalyser(undefined);
      };
    }

    if (player) {
      const audioCtx = new AudioContext();
      const audioSource = audioCtx.createMediaElementSource(player);
      const analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      audioCtx.resume();
      setAnalyser(analyser);

      return () => {
        audioSource.disconnect();
        analyser.disconnect();
        audioCtx.close();
        setAnalyser(undefined);
      };
    }
  }, [player, mediaStream, mediaStreamGain]);

  useEffect(() => {
    if (canvas && analyser && animation) {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const { start, stop } = animation.getFunc({
        ctx,
        analyser,
        canvas,
      });

      start();
      return stop;
    }
  }, [canvas, analyser, animation]);

  useEffect(() => {
    if (!analyser || !onLevel) {
      return;
    }
    const dataArr = new Uint8Array(analyser.fftSize);
    const intervalId = window.setInterval(() => {
      if (!analyser.getByteTimeDomainData) {
        onLevel(0);
        return;
      }
      analyser.getByteTimeDomainData(dataArr);
      let sumSquares = 0;
      for (const value of dataArr) {
        const centered = (value - 128) / 128;
        sumSquares += centered * centered;
      }
      const rms = Math.sqrt(sumSquares / dataArr.length);
      onLevel(Math.min(100, Math.round(rms * 220)));
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [analyser, onLevel]);

  return (
    <div
      style={{
        border: `solid 3px ${Clrs.primary}`,
        height: "100%",
        position: "relative",
      }}
      onDoubleClick={() => setFullScreen((f) => !f)}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          background: "black",
          left: 0,
          top: 0,
          zIndex: 10,
          position: fullScreen ? "fixed" : "absolute",
          ...animation?.canvasStyle,
        }}
      />

      <ResizeIcon
        active={fullScreen}
        onClick={() => setFullScreen((f) => !f)}
        style={{
          right: "15px",
          top: "15px",
          position: fullScreen ? "fixed" : "absolute",
          cursor: "pointer",
          zIndex: "11",
        }}
      />
    </div>
  );
};

export default Visualizer;
