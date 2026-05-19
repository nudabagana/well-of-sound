import { FC, useCallback, useEffect, useState } from "react";
import Slider from "../components/Slider";
import { Borders } from "../styled/borders";

const SAMPLE_COUNT = 256;
const BIN_COUNT = 48;
const MIN_FREQ = 1;
const MAX_LOW_FREQ = 12;
const MAX_HIGH_FREQ = 40;
const MAX_AMP = 100;

const getSignal = (
  index: number,
  frame: number,
  lowFreq: number,
  highFreq: number,
  lowAmp: number,
  highAmp: number
) => {
  const phase = frame * 0.04;
  const low =
    (lowAmp / MAX_AMP) * Math.sin((2 * Math.PI * lowFreq * index) / SAMPLE_COUNT + phase);
  const high =
    (highAmp / MAX_AMP) *
    Math.sin((2 * Math.PI * highFreq * index) / SAMPLE_COUNT - phase * 1.7);
  return low + high;
};

const getMagnitudes = (samples: number[]) => {
  const magnitudes: number[] = [];

  for (let bin = 0; bin < BIN_COUNT; bin++) {
    let real = 0;
    let imag = 0;

    for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex++) {
      const angle = (2 * Math.PI * bin * sampleIndex) / samples.length;
      real += samples[sampleIndex] * Math.cos(angle);
      imag -= samples[sampleIndex] * Math.sin(angle);
    }

    magnitudes.push(Math.sqrt(real * real + imag * imag) / samples.length);
  }

  return magnitudes;
};

const Workshop2: FC = () => {
  const [lowFreq, setLowFreq] = useState(3);
  const [highFreq, setHighFreq] = useState(17);
  const [lowAmp, setLowAmp] = useState(85);
  const [highAmp, setHighAmp] = useState(35);

  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const handleMount = useCallback((node: HTMLCanvasElement) => {
    setCanvas(node ?? undefined);
  }, []);

  useEffect(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }

    let frame = 0;
    let requestId = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const samples = Array.from({ length: SAMPLE_COUNT }, (_, index) =>
        getSignal(index, frame, lowFreq, highFreq, lowAmp, highAmp)
      );
      const magnitudes = getMagnitudes(samples);
      const maxMagnitude = Math.max(...magnitudes, 0.0001);

      const paneGap = width * 0.03;
      const paneWidth = (width - paneGap * 3) / 2;
      const paneHeight = height - 140;
      const top = 56;
      const leftX = paneGap;
      const rightX = leftX + paneWidth + paneGap;
      const centerY = top + paneHeight / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#05070b";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#f4f0e8";
      ctx.font = `${Math.max(14, Math.floor(width * 0.015))}px monospace`;
      ctx.fillText("Time domain: one combined waveform", leftX, 30);
      ctx.fillText("Frequency domain: separate energy by bin", rightX, 30);

      ctx.strokeStyle = "#263247";
      ctx.lineWidth = 2;
      ctx.strokeRect(leftX, top, paneWidth, paneHeight);
      ctx.strokeRect(rightX, top, paneWidth, paneHeight);

      ctx.strokeStyle = "#18202d";
      ctx.beginPath();
      ctx.moveTo(leftX, centerY);
      ctx.lineTo(leftX + paneWidth, centerY);
      ctx.stroke();

      ctx.strokeStyle = "#74c0fc";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let index = 0; index < samples.length; index++) {
        const x = leftX + (index / (samples.length - 1)) * paneWidth;
        const y = centerY - samples[index] * (paneHeight * 0.38);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      const barGap = 2 * dpr;
      const barWidth = (paneWidth - barGap * (BIN_COUNT - 1)) / BIN_COUNT;
      for (let bin = 0; bin < BIN_COUNT; bin++) {
        const ratio = magnitudes[bin] / maxMagnitude;
        const barHeight = ratio * (paneHeight - 30);
        const x = rightX + bin * (barWidth + barGap);
        const y = top + paneHeight - barHeight;
        const activeBin = bin === lowFreq || bin === highFreq;

        ctx.fillStyle = activeBin ? "#ff8fab" : "#f6bd60";
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.fillStyle = "#cbd5e1";
      ctx.font = `${Math.max(12, Math.floor(width * 0.011))}px monospace`;
      ctx.fillText(
        `low sine: ${lowFreq} cycles/window, amp ${lowAmp}`,
        leftX,
        height - 78
      );
      ctx.fillText(
        `high sine: ${highFreq} cycles/window, amp ${highAmp}`,
        leftX,
        height - 54
      );
      ctx.fillText("single line on left = low + high added together", leftX, height - 30);
      ctx.fillText("two peaks on right = same signal split back apart", rightX, height - 30);

      frame++;
      requestId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(requestId);
  }, [canvas, highAmp, highFreq, lowAmp, lowFreq]);

  return (
    <div
      style={{
        border: Borders.primary,
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
          position: "absolute",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 20,
          zIndex: 10,
          background: "rgba(0, 0, 0, 0.55)",
          padding: 12,
        }}
      >
        <Slider
          name="Low freq"
          max={MAX_LOW_FREQ}
          min={MIN_FREQ}
          value={lowFreq}
          setValue={setLowFreq}
        />
        <Slider
          name="High freq"
          max={MAX_HIGH_FREQ}
          min={2}
          value={highFreq}
          setValue={setHighFreq}
        />
        <Slider
          name="Low amp"
          max={MAX_AMP}
          min={0}
          value={lowAmp}
          setValue={setLowAmp}
        />
        <Slider
          name="High amp"
          max={MAX_AMP}
          min={0}
          value={highAmp}
          setValue={setHighAmp}
        />
      </div>
    </div>
  );
};

export default Workshop2;
