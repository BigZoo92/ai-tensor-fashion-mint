import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { ModelInference } from "./components/ModelInference";

const App: React.FC = () => {
  const [grayscaleImage, setGrayscaleImage] = useState<ImageData | null>(null);

  return (
    <div>
      <h1>ONNX Image Classifier</h1>
      <ImageUploader setGrayscaleImage={setGrayscaleImage} />
      {grayscaleImage && <ModelInference grayscaleImage={grayscaleImage} />}
    </div>
  );
};

export default App;
