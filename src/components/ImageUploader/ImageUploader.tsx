import React, { useRef } from "react";

interface Props {
  setGrayscaleImage: (image: ImageData | null) => void;
}

export const ImageUploader: React.FC<Props> = ({ setGrayscaleImage }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = 28; // Resize to 28x28
            canvas.height = 28;
            ctx.drawImage(img, 0, 0, 28, 28);

            // Convert to grayscale
            const imageData = ctx.getImageData(0, 0, 28, 28);
            for (let i = 0; i < imageData.data.length; i += 4) {
              const grayscale = 0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2];
              imageData.data[i] = grayscale; // Red channel
              imageData.data[i + 1] = grayscale; // Green channel
              imageData.data[i + 2] = grayscale; // Blue channel
            }
            ctx.putImageData(imageData, 0, 0);

            setGrayscaleImage(imageData);
          }
        }
      };
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};
