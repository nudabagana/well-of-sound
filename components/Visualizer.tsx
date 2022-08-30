import { FC, useState, useEffect, LegacyRef } from "react";
import { Clrs } from "../styles/consts";

type Props = { canvasRef: LegacyRef<HTMLCanvasElement> | undefined };

const Visualizer: FC<Props> = ({ canvasRef }) => {
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
