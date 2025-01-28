export const normalizeImage = (imageData: ImageData): Float32Array => {
  const { data, width, height } = imageData;
  const normalized = new Float32Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const grayscale = data[i] / 255.0; // Prend la valeur du canal rouge
    normalized[i / 4] = (grayscale - 0.5) / 0.5; // Normalisation
  }

  return normalized;
};
