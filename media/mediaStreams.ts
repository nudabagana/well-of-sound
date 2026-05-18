export const stopMediaStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};
