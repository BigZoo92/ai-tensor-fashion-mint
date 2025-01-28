import { InferenceSession, Tensor as T, type Tensor } from "onnxruntime-web";
import React, { useEffect, useState } from "react";

interface Props {
  grayscaleImage: ImageData;
}

const modelUrl = "./model/model.onnx";
export const ModelInference: React.FC<Props> = ({ grayscaleImage }) => {
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    const runInference = async () => {
      try {
        console.log(modelUrl)
        const session = await InferenceSession.create(modelUrl);

        console.log({session})

        const normalizedImage = new Float32Array(28 * 28);
        for (let i = 0; i < grayscaleImage.data.length; i += 4) {
          const grayscale = grayscaleImage.data[i] / 255.0
          normalizedImage[i / 4] = grayscale;
        }

        const inputTensor = new T("float32", normalizedImage, [1, 1, 28, 28]);
        const feeds: Record<string, Tensor> = {};
        feeds[session.inputNames[0]] = inputTensor;

        const results = await session.run(feeds);
        const output = results[session.outputNames[0]].data as Float32Array;

        const predictedClass = output.indexOf(Math.max(...output));
        setPrediction(`Prediction: ${predictedClass}`);
      } catch (error) {
        console.error("Error during inference:", error);
        setPrediction("Error during prediction.");
      }
    };

    runInference();
  }, [grayscaleImage]);

  return <div>{prediction || "Loading prediction..."}</div>;
};
