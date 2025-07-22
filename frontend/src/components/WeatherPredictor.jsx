import { useState, useRef } from "react";

function WeatherPredictor() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // 👈 from .env

    const handleCheckWeather = async () => {
        if (!city.trim()) {
            setError("Please enter a city name.");
            setWeather(null);
            return;
        }

        try {
            const res = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
            );
            const data = await res.json();

            if (data.error) {
                setError(data.error.message || "City not found.");
                setWeather(null);
                return;
            }

            setError(null);
            setWeather({
                temp: data.current.temp_c,
                humidity: data.current.humidity,
                condition: data.current.condition.text,
            });
        } catch (err) {
            setError("Failed to fetch weather data.");
            setWeather(null);
        }
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-xl shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">🌦️ Weather Predictor</h3>

            <div className="relative mb-2">
                <input
                ref={inputRef}
                    type="text"
                    placeholder="Enter City Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border p-2 pr-10 rounded"
                />
                {city && (
                    <button
                        onClick={() => {
                            setCity("");
                            setWeather(null);
                            setError(null);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                    >
                        ❌
                    </button>
                )}
            </div>

            <button
                onClick={handleCheckWeather}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
                Check Weather
            </button>

            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

            {weather && (
                <div className="mt-4 text-gray-700 space-y-1 text-sm">
                    <p>🌡️ Temperature: {weather.temp} °C</p>
                    <p>💧 Humidity: {weather.humidity}%</p>
                    <p>☁️ Condition: {weather.condition}</p>
                </div>
            )}
        </div>
    );
}

export default WeatherPredictor;
