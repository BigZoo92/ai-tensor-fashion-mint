import React, { useState } from "react";
import { Layout, Spin } from "antd";
import {ImageUploader} from "./components/ImageUploader";
import {PredictionResult} from "./components/PredictionResult";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [probabilities, setProbabilities] = useState<
    { label: string; probability: number }[]
  >([]);
  console.log(prediction)
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#141414" }}>
      <Header style={{ backgroundColor: "#000", textAlign: "center" }}>
        <h1 style={{ color: "#FF4D6D", margin: 0 }}>ONNX Image Classifier</h1>
      </Header>
      <Content
        style={{
          padding: "24px",
          textAlign: "center",
          backgroundColor: "#141414",
        }}
      >
        <ImageUploader
          setPrediction={setPrediction}
          setProbabilities={setProbabilities}
        />
        {prediction && (
          <PredictionResult
          prediction={prediction}
          probabilities={probabilities}
        />
        )}
      </Content>
      <Footer style={{ textAlign: "center", color: "#C9184A", background: '#000' }}>
        ONNX Classifier ©2025
      </Footer>
    </Layout>
  );
};

export default App;
