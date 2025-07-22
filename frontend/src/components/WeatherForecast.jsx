import { useState, useRef } from "react";

function WeatherForecast() {
    const [city, setCity] = useState("");
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const fetchForecast = async () => {
        if (!city.trim()) {
            setError("Please enter a city name.");
            setForecast([]);
            return;
        }

        try {
            const res = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
            );
            const data = await res.json();

            if (data.error) {
                setError(data.error.message);
                setForecast([]);
                return;
            }

            setError(null);
            setForecast(data.forecast.forecastday);
        } catch (err) {
            setError("Failed to fetch forecast.");
            setForecast([]);
        }
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-xl shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">📆 3-Day Weather Forecast</h3>

            {/* Input with clear button */}
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
                            setForecast([]);
                            setError(null);
                            inputRef.current?.focus();
                            
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                    >
                        ❌
                    </button>
                )}
            </div>

            {/* Button below input (like Weather Predictor) */}
            <button
                onClick={fetchForecast}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
                Get Forecast
            </button>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            {/* Forecast Cards */}
            {forecast.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                    {forecast.map((day) => (
                        <div
                            key={day.date}
                            className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                        >
                            <p className="font-semibold">{day.date}</p>
                            <p>🌤️ {day.day.condition.text}</p>
                            <p>🌡️ Max: {day.day.maxtemp_c} °C</p>
                            <p>❄️ Min: {day.day.mintemp_c} °C</p>
                            <p>💧 Humidity: {day.day.avghumidity}%</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WeatherForecast;
