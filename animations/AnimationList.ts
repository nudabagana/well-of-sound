import { Animation } from "../types/AnimationTypes";
import BarAnimation from "./BarAnimation";
import CircleAnimation from "./CircleAnimation";
import FuncAnimation from "./FuncAnimation";

export const Animations: Animation[] = [
  {
    id: "bars1",
    name: "Bars",
    getFunc: BarAnimation.getAnimateFunc,
    canvasStyle: BarAnimation.cssStyle,
  },
  {
    id: "circle1",
    name: "Circle",
    getFunc: CircleAnimation.getAnimateFunc,
    canvasStyle: CircleAnimation.cssStyle,
  },
  {
    id: "func1",
    name: "Sine",
    getFunc: FuncAnimation.getAnimateFunc,
    canvasStyle: FuncAnimation.cssStyle,
  },
];
