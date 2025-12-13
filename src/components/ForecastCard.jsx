import React from "react";

const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">5-Day Forecast</h2>
      <div className="flex gap-4 overflow-x-auto py-2 snap-x snap-mandatory scroll-smooth">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
          const temp = day.main.temp;

          let cardBg = "bg-white";
          let textColor = "text-gray-800";

          if (temp >= 30) cardBg = "bg-red-400 text-white";
          else if (temp >= 20) cardBg = "bg-yellow-300";
          else if (temp >= 10) cardBg = "bg-green-200";
          else cardBg = "bg-blue-400 text-white";

          return (
            <div
              key={index}
              className={`flex-none w-32 p-4 rounded-lg shadow hover:scale-105 transition transform text-center snap-center ${cardBg} ${textColor}`}
            >
              <p className="font-semibold">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <img
                src={iconUrl}
                alt={day.weather[0].description}
                className="mx-auto animate-bounce-slow"
              />
              <p className="mt-2">{Math.round(temp)}°C</p>
              <p className="capitalize text-sm">{day.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
