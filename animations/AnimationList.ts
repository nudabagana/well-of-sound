import { Animation } from "../types/AnimationTypes";
import BarAnimation from "./BarAnimation";
import CircleAnimation from "./CircleAnimation";
import FuncAnimation from "./FuncAnimation";
import MilkdropRawAnimation from "./MilkdropRawAnimation";
import NewAnimation from "./NewAnimation";
import ThreeFanAnimation from "./ThreeFanAnimation";
import TwoFanAnimation from "./TwoFanAnimation";

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
  {
    id: "2fan",
    name: "2 Fan",
    getFunc: TwoFanAnimation.getAnimateFunc,
    canvasStyle: TwoFanAnimation.cssStyle,
  },
  {
    id: "dark_neon",
    name: "Dark Neon",
    getFunc: ThreeFanAnimation.getAnimateFunc,
    canvasStyle: ThreeFanAnimation.cssStyle,
  },
  {
    id: "milkdrop_raw",
    name: "Milkdrop Raw",
    getFunc: MilkdropRawAnimation.getAnimateFunc,
    canvasStyle: MilkdropRawAnimation.cssStyle,
  },
  // {
  //   id: "New",
  //   name: "New",
  //   getFunc: NewAnimation.getAnimateFunc,
  //   canvasStyle: NewAnimation.cssStyle,
  // },
];
