import { FC, useEffect, useRef, useState } from "react";
import { Clrs } from "../styles/consts";
import { Animation } from "../types/AnimationTypes";

type Props = { player?: HTMLAudioElement | null; animation?: Animation };

const Visualizer: FC<Props> = ({ player, animation }) => {
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;

  useEffect(() => {
    if (player) {
      const audioCtx = new AudioContext();
      const audioSource = audioCtx.createMediaElementSource(player);
      const analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      setAnalyser(analyser);
    }
  }, [player]);

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

  return (
    <div style={{ border: `solid 3px ${Clrs.primary}`, width: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", background: "black" }}
      />
    </div>
  );
};

export default Visualizer;
