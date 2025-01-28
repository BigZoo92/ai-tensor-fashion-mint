import React from "react";
import { Progress } from "antd";

interface Props {
  prediction: string | null;
  probabilities: { label: string; probability: number }[];
}

export const PredictionResult: React.FC<Props> = ({ prediction, probabilities }) => {

  return (
    <div
      style={{
        marginTop: "16px",
        backgroundColor: "#2A2A2A",
        padding: "16px",
        borderRadius: "12px",
        border: "2px solid #C9184A",
        color: "#fff",
      }}
    >
      <h2 style={{ color: "#FF4D6D", fontSize: "20px" }}>
        Prediction: {prediction || "N/A"}
      </h2>
      <div style={{ marginTop: "16px" }}>
        {probabilities.map((probability) => (
          <div
            key={probability.label}
            style={{
              marginBottom: "12px",
              backgroundColor: "#1A1A1A",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <p
              style={{
                color: "#C9184A",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              {probability.label}
            </p>
            <Progress
              percent={parseFloat(probability.probability.toFixed(2))}
              strokeColor="#FF4D6D"
              trailColor="#2A2A2A"
              showInfo={true}
              style={{ borderRadius: "8px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

