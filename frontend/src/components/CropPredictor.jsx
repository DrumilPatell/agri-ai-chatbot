import { useState } from "react";

function CropPredictor() {
  const [crop, setCrop] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [temperature, setTemperature] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const cropOptions = ["rice", "wheat", "maize", "cotton", "sugarcane"];
  const fertilizerOptions = ["urea", "dap", "mop", "npk", "organic"];

  const handlePredict = async () => {
    setResult(null);
    setError(null);

    if (!crop || !fertilizer || !rainfall || !temperature) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop,
          rainfall: parseFloat(rainfall),
          temperature: parseFloat(temperature),
          fertilizer,
        }),
      });

      const data = await res.json();
      if (data.predicted_yield !== undefined) {
        setResult(`🌾 Predicted Yield: ${data.predicted_yield} tons/ha`);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-xl space-y-4 mt-6">
      <h2 className="text-xl font-bold mb-2">🌱 Crop Yield Predictor</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Crop</option>
            {cropOptions.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Fertilizer</label>
          <select
            value={fertilizer}
            onChange={(e) => setFertilizer(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Fertilizer</option>
            {fertilizerOptions.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Rainfall (mm)</label>
          <input
            type="number"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Temperature (°C)</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handlePredict}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Predict Yield
      </button>

      {result && <div className="mt-4 text-green-700 font-semibold">{result}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

export default CropPredictor;
