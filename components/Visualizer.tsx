import { FC, useCallback, useEffect, useState } from "react";
import ResizeIcon from "../icons/ResizeIcon";
import { Borders } from "../styled/borders";
import { FontSizes } from "../styled/fontSizes";
import { Space } from "../styled/space";
import { Analyser, Animation } from "../types/AnimationTypes";

type Props = {
  analyser?: Analyser;
  animation?: Animation;
};

const Visualizer: FC<Props> = ({ analyser, animation }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const handleCanvasMount = useCallback((node: HTMLCanvasElement | null) => {
    setCanvas(node);
  }, []);

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
    <div
      style={{
        border: Borders.primary,
        height: "100%",
        position: "relative",
      }}
      onDoubleClick={() => setFullScreen((f) => !f)}
    >
      {analyser ? (
        <canvas
          key={animation?.id}
          ref={handleCanvasMount}
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
      ) : (
        <div
          style={{
            position: fullScreen ? "fixed" : "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: FontSizes.lg,
            fontWeight: 700,
            letterSpacing: Space.xs,
            zIndex: 10,
          }}
        >
          [ no audio ]
        </div>
      )}

      <ResizeIcon
        active={fullScreen}
        onClick={() => setFullScreen((f) => !f)}
        style={{
          right: Space.lg,
          top: Space.lg,
          position: fullScreen ? "fixed" : "absolute",
          cursor: "pointer",
          zIndex: "11",
        }}
      />
    </div>
  );
};

export default Visualizer;
