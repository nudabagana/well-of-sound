export const formatS = (s?: number) =>
  s ? `${zeroPad(Math.floor(s / 60), 2)}:${zeroPad(s % 60, 2)}` : `00:00`;

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export const MS_IN_S = 1000;
export const MS_IN_MIN = MS_IN_S * 60;
export const MS_IN_H = MS_IN_MIN * 60;
export const MS_IN_DAY = MS_IN_H * 24;
export const MS_IN_WEEK = MS_IN_DAY * 7;
