import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const { main, weather: weatherDetails, wind, name, sys } = weather;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherDetails[0].icon}@2x.png`;

  return (
    <div className="w-full max-w-md bg-white mt-6 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-2">
        {name}, {sys.country}
      </h2>
      <img
        src={iconUrl}
        alt={weatherDetails[0].description}
        className="mx-auto animate-bounce-slow"
      />
      <p className="text-xl mt-2 font-semibold">
        {Math.round(main.temp)}°C - {weatherDetails[0].main}
      </p>
      <p className="mt-1 text-gray-700 capitalize">{weatherDetails[0].description}</p>
      <p className="mt-1 text-gray-600">
        Humidity: {main.humidity}% | Wind: {wind.speed} m/s
      </p>
    </div>
  );
};

export default WeatherCard;
