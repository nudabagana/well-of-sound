export const formatS = (s?: number) =>
  s ? `${zeroPad(Math.floor(s / 60), 2)}:${zeroPad(s % 60, 2)}` : `00:00`;

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");
