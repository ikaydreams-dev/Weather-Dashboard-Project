import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";

const API_KEY = "8f6bf9459b117937495fe29490b78d5a";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const fetchWeather = async (searchCity) => {
    try {
      // 1️⃣ Geocoding API to get lat/lon
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          searchCity
        )}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        setError("City not found");
        setWeather(null);
        setForecast([]);
        return;
      }

      const { lat, lon, name } = geoData[0];

      // 2️⃣ Current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData);
      setError("");

      // 3️⃣ 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      const dailyForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather");
      setWeather(null);
      setForecast([]);
    }
  };

  const handleSearch = () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city");
      return;
    }
    fetchWeather(trimmedCity);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 p-4">
      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
        error={error}
      />

      {weather && <WeatherCard weather={weather} />}
      {forecast.length > 0 && <ForecastCard forecast={forecast} />}
    </div>
  );
}

export default App;
