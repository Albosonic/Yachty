export const getIsoDate = (inputDate) => {
  const date = inputDate || new Date();
  const dateIso = date.toISOString().slice(0, 10);
  return dateIso;
}