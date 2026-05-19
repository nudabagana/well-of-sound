import { Animation } from "../types/AnimationTypes";
import BarAnimation from "./BarAnimation";
import CircleAnimation from "./CircleAnimation";
import FuncAnimation from "./SineAnimation";
import MilkdropFractalAnimation from "./MilkdropFractalAnimation";
import MilkdropRawAnimation from "./MilkdropRawAnimation";
import NewAnimation from "./NewAnimation";
import ThreeFanAnimation from "./ThreeFanAnimation";
import TwoFanAdditiveAnimation from "./TwoFanAdditiveAnimation";
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
    id: "2fan_additive",
    name: "2 Fan (additive)",
    getFunc: TwoFanAdditiveAnimation.getAnimateFunc,
    canvasStyle: TwoFanAdditiveAnimation.cssStyle,
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
  {
    id: "storm",
    name: "Storm",
    getFunc: MilkdropFractalAnimation.getAnimateFunc,
    canvasStyle: MilkdropFractalAnimation.cssStyle,
  },
  // {
  //   id: "New",
  //   name: "New",
  //   getFunc: NewAnimation.getAnimateFunc,
  //   canvasStyle: NewAnimation.cssStyle,
  // },
];
