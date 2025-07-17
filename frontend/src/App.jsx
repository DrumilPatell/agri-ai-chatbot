import ChatBox from "./components/chatbox";
import CropPredictor from "./components/CropPredictor";

function App() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">🌾 Agri Assistant</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="col-span-1">
          <ChatBox />
        </div>
        <div className="col-span-1">
          <CropPredictor />
        </div>
      </div>
    </div>
  );
}

export default App;
