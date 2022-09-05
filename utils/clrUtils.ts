const getRandomClr = () => {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
};

const getHSL = (h: number, s: number, l: number) =>
  `hsl(${h.toFixed(0)},${s}%,${l}%)`;

const clrUtils = { getRandomClr, getHSL };

export default clrUtils;
