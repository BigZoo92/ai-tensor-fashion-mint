import React, { useRef, useState } from "react";
import { Button, Upload, UploadProps, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as ort from "onnxruntime-web";
import { normalizeImage } from "../../helpers";

interface Props {
  setPrediction: (prediction: string | null) => void;
  setProbabilities: (probabilities: { label: string; probability: number }[]) => void;
}

export const ImageUploader: React.FC<Props> = ({
  setPrediction,
  setProbabilities,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file as Blob);

      setPreviewImage(img.src);

      img.onload = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = 28;
            canvas.height = 28;
            ctx.drawImage(img, 0, 0, 28, 28);

            const imageData = ctx.getImageData(0, 0, 28, 28);

            await predict(imageData);
            if (onSuccess) onSuccess("ok");
          }
        }
      };
    } catch (error) {
      message.error("Error processing the image.");
      if (onError) onError(error as Error);
    }
  };

  const predict = async (imageData: ImageData) => {
    try {
      const classLabels = [
        "T-shirt/top",
        "Trouser",
        "Pullover",
        "Dress",
        "Coat",
        "Sandal",
        "Shirt",
        "Sneaker",
        "Ankle boot",
        "Bag",
      ];
      const modelUrl = "./model/model.onnx";
      const session = await ort.InferenceSession.create(modelUrl);

      const normalizedImage = normalizeImage(imageData);
      const inputTensor = new ort.Tensor("float32", normalizedImage, [1, 1, 28, 28]);

      const feeds: Record<string, ort.Tensor> = {};
      feeds[session.inputNames[0]] = inputTensor;

      const results = await session.run(feeds);
      const output = results[session.outputNames[0]].data as Float32Array;

      const validOutput: number[] = Array.from(output).map((value) => (value < 0 ? 0 : value));

      const sum = validOutput.reduce((a, b) => a + Math.exp(b), 0);
      const probabilities = validOutput.map((value, index) => ({
        label: classLabels[index],
        probability: (Math.exp(value) / sum) * 100,
      }));

      probabilities.sort((a, b) => b.probability - a.probability);

      setProbabilities(probabilities);
      setPrediction(probabilities[0]?.label || "No valid prediction");
    } catch (error) {
      console.error("Error during inference:", error);
      setPrediction("Error during prediction.");
    }
  };

  return (
    <div style={{ textAlign: "center", display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexDirection: 'column' }}>
      <Upload
        customRequest={handleFileUpload}
        maxCount={1}
        showUploadList={false}
      >
        <Button
          icon={<UploadOutlined />}
          style={{
            backgroundColor: "#FF4D6D",
            border: "none",
            color: "#fff",
            marginBottom: "16px",
          }}
        >
          Upload Image
        </Button>
      </Upload>
      {previewImage && (
        <div
          style={{
            margin: "16px 0",
            padding: "8px",
            border: "2px solid #FF4D6D",
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          <img
            src={previewImage}
            alt="Uploaded preview"
            style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
          />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};
