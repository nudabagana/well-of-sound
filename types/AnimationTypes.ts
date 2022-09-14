import { CSSProperties } from "react";

export type Analyser = {
  getByteFrequencyData: (array: Uint8Array) => void;
  fftSize: number;
  frequencyBinCount: number;
};

export type AnimationProps = {
  ctx: CanvasRenderingContext2D;
  analyser: Analyser;
  canvas: HTMLCanvasElement;
};

export type Animation = {
  id: string;
  name: string;
  getFunc: (p: AnimationProps, params?: any) => { start(): void; stop(): void };
  canvasStyle: CSSProperties;
};
