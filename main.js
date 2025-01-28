// Initialisation du modèle et des paramètres
const modelUrl = "./model/model.onnx"; // Assure-toi que ce chemin est correct
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const classLabels = [
    "T-shirt/top", // 0
    "Trouser",     // 1
    "Pullover",    // 2
    "Dress",       // 3
    "Coat",        // 4
    "Sandal",      // 5
    "Shirt",       // 6
    "Sneaker",     // 7
    "Bag",         // 8
    "Ankle boot"   // 9
  ];
  

// Gestion de l'upload de l'image
document.getElementById("imageUploader").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    // Redimensionne l'image sur le canvas à 28x28 pixels
    canvas.width = 28;
    canvas.height = 28;
    ctx.drawImage(img, 0, 0, 28, 28);

    // Convertir en noir et blanc
    const imageData = ctx.getImageData(0, 0, 28, 28);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const grayscale = 0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2];
      imageData.data[i] = grayscale; // R
      imageData.data[i + 1] = grayscale; // G
      imageData.data[i + 2] = grayscale; // B
    }
    ctx.putImageData(imageData, 0, 0);
  };
});

// Gestion de la prédiction
document.getElementById("predictButton").addEventListener("click", async () => {
  const imageData = ctx.getImageData(0, 0, 28, 28);

  // Normalisation des pixels
  const input = new Float32Array(28 * 28);
  for (let i = 0; i < imageData.data.length; i += 4) {
    input[i / 4] = (imageData.data[i] / 255.0 - 0.5) / 0.5; // Normalisation
  }

  try {
    // Charger le modèle ONNX
    const session = await ort.InferenceSession.create(modelUrl);

    // Créer le tenseur d'entrée
    const tensor = new ort.Tensor("float32", input, [1, 1, 28, 28]);

    // Effectuer l'inférence
    const results = await session.run({ [session.inputNames[0]]: tensor });
    const output = results[session.outputNames[0]].data;

    // Trouver la classe prédite
    const predictedClass = output.indexOf(Math.max(...output));
    document.getElementById("output").textContent = `Prediction: ${classLabels[predictedClass]}`;
  } catch (error) {
    console.error("Error during inference:", error);
    document.getElementById("output").textContent = "Error during prediction.";
  }
});
