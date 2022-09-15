export const getUrlParam = (name: string) => {
  let paramVal = "";
  if (typeof window !== "undefined") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    paramVal = urlSearchParams.get(name) ?? "";
  }
  return paramVal;
};
