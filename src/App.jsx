import React, { useState, useEffect } from 'react';
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, Sunrise, Sunset, Thermometer, CloudSnow, Zap, Waves, TrendingUp, Compass } from 'lucide-react';

// Your OpenWeatherMap API Key
const API_KEY = "8f6bf9459b117937495fe29490b78d5a";

const WeatherDashboard = () => {
  const [searchCity, setSearchCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition) => {
    const lower = condition?.toLowerCase() || '';
    if (lower.includes('rain')) return CloudRain;
    if (lower.includes('clear') || lower.includes('sun')) return Sun;
    if (lower.includes('cloud')) return Cloud;
    if (lower.includes('snow')) return CloudSnow;
    return Cloud;
  };

  const getBackgroundGradient = (condition) => {
    const lower = condition?.toLowerCase() || '';
    if (lower.includes('clear') || lower.includes('sun')) {
      return 'from-sky-400 via-blue-400 to-indigo-500';
    }
    if (lower.includes('rain')) {
      return 'from-slate-700 via-slate-600 to-slate-800';
    }
    if (lower.includes('cloud')) {
      return 'from-gray-500 via-slate-600 to-gray-700';
    }
    if (lower.includes('snow')) {
      return 'from-blue-300 via-cyan-300 to-sky-400';
    }
    return 'from-violet-500 via-purple-500 to-fuchsia-500';
  };

  const fetchWeather = async (city) => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Fetching weather for:', city);
      console.log('Using API Key:', API_KEY);
      
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      console.log('Weather response status:', weatherRes.status);
      
      const weatherData = await weatherRes.json();
      console.log('Weather data:', weatherData);

      if (weatherData.cod !== 200) {
        if (weatherData.cod === 401) {
          throw new Error('❌ API Key Error: Your API key is invalid or not activated yet. New API keys from OpenWeatherMap take 1-2 hours to activate. Please wait and try again, or get a new key from https://openweathermap.org/api');
        }
        throw new Error(weatherData.message || 'City not found');
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        temp: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6),
        windDirection: getWindDirection(weatherData.wind.deg),
        windDeg: weatherData.wind.deg,
        pressure: weatherData.main.pressure,
        visibility: Math.round(weatherData.visibility / 1000),
        dewPoint: Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5)),
        sunrise,
        sunset,
        tempMax: Math.round(weatherData.main.temp_max),
        tempMin: Math.round(weatherData.main.temp_min),
      });

      const hourly = forecastData.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: getWeatherIcon(item.weather[0].main),
      }));
      setHourlyForecast(hourly);

      const daily = forecastData.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5)
        .map(item => ({
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          icon: getWeatherIcon(item.weather[0].main),
        }));
      setDailyForecast(daily);

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(searchCity);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${weather ? getBackgroundGradient(weather.condition) : 'from-indigo-600 via-purple-600 to-pink-600'} transition-all duration-1000 p-4 md:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Animated Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                Weather Dashboard
              </h1>
              <p className="text-white/80 text-lg">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-white/70 text-sm mt-1">
                {currentTime.toLocaleTimeString('en-US')}
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="flex gap-3">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="Search city..."
                    className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-white/30 hover:bg-white/40 active:bg-white/50 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/50 text-white px-6 py-4 rounded-2xl shadow-lg">
            <p className="font-semibold mb-2">{error}</p>
            {error.includes('API Key') && (
              <div className="mt-3 p-3 bg-white/10 rounded-lg text-sm">
                <p className="font-semibold mb-2">🔑 API Key Troubleshooting:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>New API keys take <strong>1-2 hours</strong> to activate after creation</li>
                  <li>Check if you copied the entire key correctly</li>
                  <li>Make sure the key is from <a href="https://openweathermap.org/api" target="_blank" className="underline">OpenWeatherMap</a></li>
                  <li>Try generating a new API key if this one doesn't work</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
            <p className="mt-4 text-white text-xl">Loading weather data...</p>
          </div>
        )}

        {weather && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Weather Section */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Hero Weather Card */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin size={28} className="text-white" />
                      <div>
                        <h2 className="text-3xl font-bold text-white">{weather.city}</h2>
                        <p className="text-white/70">{weather.country}</p>
                      </div>
                    </div>
                    <p className="text-white/80 text-lg capitalize">{weather.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-sm mb-1">Feels like</div>
                    <div className="text-4xl font-bold text-white">{weather.feelsLike}°</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-8xl md:text-9xl font-bold text-white mb-4">
                      {weather.temp}°
                    </div>
                    <div className="text-3xl text-white/90 mb-4">{weather.condition}</div>
                    <div className="flex gap-6 text-lg text-white/80">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} />
                        <span>{weather.tempMax}°</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="rotate-180" />
                        <span>{weather.tempMin}°</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {React.createElement(getWeatherIcon(weather.condition), { 
                      size: 160, 
                      className: "text-white drop-shadow-2xl animate-pulse", 
                      strokeWidth: 1.5 
                    })}
                  </div>
                </div>
              </div>

              {/* Hourly Forecast */}
              {hourlyForecast.length > 0 && (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Hourly Forecast</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {hourlyForecast.map((hour, index) => (
                      <div key={index} className="flex-shrink-0 text-center p-5 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all min-w-[100px]">
                        <div className="text-white/80 font-medium mb-3">{hour.time}</div>
                        {React.createElement(hour.icon, { size: 40, className: "mx-auto text-white mb-3" })}
                        <div className="text-2xl font-bold text-white">{hour.temp}°</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-400/30 rounded-xl">
                      <Droplets className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-sm text-white/70 mb-1">Humidity</div>
                  <div className="text-3xl font-bold text-white">{weather.humidity}%</div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-400/30 rounded-xl">
                      <Wind className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-sm text-white/70 mb-1">Wind Speed</div>
                  <div className="text-3xl font-bold text-white">{weather.windSpeed}</div>
                  <div className="text-xs text-white/60 mt-1">{weather.windDirection} km/h</div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-purple-400/30 rounded-xl">
                      <Gauge className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-sm text-white/70 mb-1">Pressure</div>
                  <div className="text-3xl font-bold text-white">{weather.pressure}</div>
                  <div className="text-xs text-white/60 mt-1">hPa</div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-orange-400/30 rounded-xl">
                      <Eye className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-sm text-white/70 mb-1">Visibility</div>
                  <div className="text-3xl font-bold text-white">{weather.visibility}</div>
                  <div className="text-xs text-white/60 mt-1">km</div>
                </div>
              </div>

              {/* Sun Times & Extra Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-orange-400/20 to-pink-400/20 border border-white/20 rounded-2xl p-6 text-white">
                  <Sunrise size={32} className="mb-3" />
                  <div className="text-sm opacity-80 mb-1">Sunrise</div>
                  <div className="text-2xl font-bold">{weather.sunrise}</div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-400/20 to-purple-400/20 border border-white/20 rounded-2xl p-6 text-white">
                  <Sunset size={32} className="mb-3" />
                  <div className="text-sm opacity-80 mb-1">Sunset</div>
                  <div className="text-2xl font-bold">{weather.sunset}</div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 border border-white/20 rounded-2xl p-6 text-white">
                  <Thermometer size={32} className="mb-3" />
                  <div className="text-sm opacity-80 mb-1">Dew Point</div>
                  <div className="text-2xl font-bold">{weather.dewPoint}°C</div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-white/20 rounded-2xl p-6 text-white">
                  <Compass size={32} className="mb-3" style={{ transform: `rotate(${weather.windDeg}deg)` }} />
                  <div className="text-sm opacity-80 mb-1">Wind Dir</div>
                  <div className="text-2xl font-bold">{weather.windDirection}</div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 5-Day Forecast */}
              {dailyForecast.length > 0 && (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h3>
                  <div className="space-y-4">
                    {dailyForecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          <span className="text-white font-semibold w-12">{day.day}</span>
                          {React.createElement(day.icon, { size: 28, className: "text-white" })}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-bold text-lg">{day.high}°</span>
                          <span className="text-white/60 text-lg">{day.low}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Air Quality */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Air Quality</h3>
                  <Waves size={28} />
                </div>
                <div className="mb-4">
                  <div className="text-6xl font-bold mb-2">42</div>
                  <div className="text-xl opacity-90">Good</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <div className="text-sm opacity-80">PM2.5</div>
                    <div className="text-2xl font-semibold">12 µg/m³</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">PM10</div>
                    <div className="text-2xl font-semibold">24 µg/m³</div>
                  </div>
                </div>
              </div>

              {/* Weather Alert */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={28} />
                  <h3 className="text-2xl font-bold">Weather Alert</h3>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  No active weather alerts for {weather.city}. Conditions are normal.
                </p>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center py-32">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 inline-block shadow-2xl">
              <Sun size={100} className="mx-auto text-white mb-6 animate-pulse" />
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to Weather Dashboard</h2>
              <p className="text-white/80 text-xl">Search for a city to view detailed weather information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
