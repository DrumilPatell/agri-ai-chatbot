import ChatBox from "./components/chatbox";
import CropPredictor from "./components/CropPredictor";
import WeatherPredictor from "./components/WeatherPredictor"; 
import WeatherForecast from "./components/WeatherForecast";

function App() {
  return (
    <div className="min-h-screen bg-green-50 px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">🌿 Agri Assistant</h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start max-w-7xl mx-auto">
        {/* Chat Assistant */}
        <div className="flex-1">
          <ChatBox />
        </div>

        {/* Crop Predictor + Weather below it */}
        <div className="flex flex-col gap-6 w-full md:w-[400px]">
          <CropPredictor />
          <WeatherPredictor />
          <WeatherForecast />
        </div>
      </div>
    </div>
  );
}

export default App;
