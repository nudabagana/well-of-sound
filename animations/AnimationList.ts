import { Animation } from "../types/AnimationTypes";
import BarAnimation from "./BarAnimation";
import BarFatAnimation from "./BarFatAnimation";

export const Animations: Animation[] = [
  { id: "bars1", name: "Bars", getFunc: BarAnimation.getAnimateFunc },
  { id: "bars2", name: "Fat Bars", getFunc: BarFatAnimation.getAnimateFunc },
];
