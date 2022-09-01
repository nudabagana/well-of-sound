const getBase = () => {
  let requestId: number | undefined = undefined;
  const stop = () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  };
  const setId = (id: number) => (requestId = id);
  return { setId, stop };
};

const exports = { getBase };
export default exports;
