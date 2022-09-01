export type AnimationProps = {
  ctx: CanvasRenderingContext2D;
  analyser: AnalyserNode;
  canvas: HTMLCanvasElement;
};

export type Animation = {
  id: string;
  name: string;
  getFunc: (p: AnimationProps) => { start(): void; stop(): void };
};
