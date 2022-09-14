import { FC, useCallback, useEffect, useState } from "react";
import { Animations } from "../animations/AnimationList";
import Slider from "../components/Slider";
import { Clrs } from "../styled/consts";
import FakeAnalyser from "../workshop/FakeAnalyser";

const paramMin = 0;
const paramMax = 1000;

const animation = Animations[4];

const Workshop: FC = () => {
  const [param1, setParam1] = useState(0);
  const [param2, setParam2] = useState(0);
  const [param3, setParam3] = useState(0);
  const [param4, setParam4] = useState(0);
  const [param5, setParam5] = useState(0);

  const [canvas, setElement] = useState<HTMLCanvasElement>();
  const handleMount = useCallback((node: HTMLCanvasElement) => {
    setElement(node);
  }, []);

  useEffect(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }

    const { start, stop } = animation.getFunc(
      {
        ctx,
        analyser: FakeAnalyser.create(256),
        canvas,
      },
      {
        deg: param1 * 0.36,
        deg2: param2 * 0.36,
        hue1: param3 * 0.36,
        hue2: param4 * 0.36,
        hue3: param5 * 0.36,
      }
    );

    start();
    return stop;
  }, [canvas, param1, param2, param3, param4, param5]);

  return (
    <div
      style={{
        border: `solid 3px ${Clrs.primary}`,
        height: "100%",
        position: "relative",
      }}
    >
      <canvas
        ref={handleMount}
        style={{
          width: "100%",
          height: "100%",
          background: "black",
          left: 0,
          top: 0,
          zIndex: 10,
          ...animation.canvasStyle,
        }}
      />
      <div style={{ position: "absolute", right: 20, top: 20 }}>
        <Slider
          name="Param1"
          max={paramMax}
          min={paramMin}
          value={param1}
          setValue={setParam1}
        />
        <Slider
          name="Param2"
          max={paramMax}
          min={paramMin}
          value={param2}
          setValue={setParam2}
        />
        <Slider
          name="Param3"
          max={paramMax}
          min={paramMin}
          value={param3}
          setValue={setParam3}
        />
        <Slider
          name="Param4"
          max={paramMax}
          min={paramMin}
          value={param4}
          setValue={setParam4}
        />
        <Slider
          name="Param5"
          max={paramMax}
          min={paramMin}
          value={param5}
          setValue={setParam5}
        />
      </div>
    </div>
  );
};

export default Workshop;
