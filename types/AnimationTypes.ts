import { CSSProperties } from "react";

export type Analyser = Pick<
  AnalyserNode,
  "getByteFrequencyData" | "fftSize" | "frequencyBinCount"
>;

export type AnimationProps = {
  ctx: CanvasRenderingContext2D;
  analyser: Analyser;
  canvas: HTMLCanvasElement;
};

export type GetFuncType = (
  p: AnimationProps,
  params?: number[]
) => { start(): void; stop(): void };

export type Animation = {
  id: string;
  name: string;
  getFunc: GetFuncType;
  canvasStyle: CSSProperties;
};
