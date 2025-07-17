from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import pickle
import numpy as np
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load ML model and encoders
model = pickle.load(open("crop_yield_model.pkl", "rb"))
crop_encoder = pickle.load(open("crop_encoder.pkl", "rb"))
fertilizer_encoder = pickle.load(open("fert_encoder.pkl", "rb"))

# Initialize FastAPI app
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Agri chatbot API is running."}


# -----------------------------
# 1. Chatbot Endpoint (Gemini)
# -----------------------------
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(chat_req: ChatRequest):
    user_msg = chat_req.message
    try:
        model_gemini = genai.GenerativeModel("gemini-2.0-flash")
        response = model_gemini.generate_content(user_msg)
        reply = response.text.strip() if response.text else "🤖 Gemini didn't return a response."
    except Exception as e:
        reply = f"❌ Gemini API Error: {str(e)}"
    return {"reply": reply}


# -----------------------------
# 2. Crop Yield Prediction
# -----------------------------
class PredictionInput(BaseModel):
    crop: str
    rainfall: float
    temperature: float
    fertilizer: str

@app.post("/predict")
async def predict_yield(data: PredictionInput):
    try:
        crop_input = data.crop.lower().strip()
        fert_input = data.fertilizer.lower().strip()

        crop_encoded = crop_encoder.transform([crop_input])[0]
        fert_encoded = fertilizer_encoder.transform([fert_input])[0]

        features = np.array([[crop_encoded, data.rainfall, data.temperature, fert_encoded]])
        prediction = model.predict(features)[0]
        return {"predicted_yield": round(prediction, 2)}
    except Exception as e:
        return {"error": str(e)}
