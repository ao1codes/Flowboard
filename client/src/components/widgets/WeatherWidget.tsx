import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, X, MapPin, Sun, CloudRain, CloudSnow, Zap } from "lucide-react";
import { useMemo } from "react";

interface WeatherWidgetProps {
  location?: string;
  currentWeather?: string;
  temperature?: number;
  onUpdateData: (data: { location?: string; currentWeather?: string; temperature?: number }) => void;
  onRemove: () => void;
}

export function WeatherWidget({ 
  location, 
  currentWeather, 
  temperature, 
  onUpdateData, 
  onRemove 
}: WeatherWidgetProps) {
  const [editingLocation, setEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState(location || "San Francisco");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<{
    location: string;
    currentWeather: string;
    temperature: number;
  } | null>(
    location && currentWeather && temperature
      ? { location, currentWeather, temperature }
      : null
  );
  const OPENWEATHER_API_KEY = 'ADD_YOUR_OWN!!!';

  // Fetch weather on mount if location exists but no real weather data
  useEffect(() => {
    if (location && (!weatherData)) {
      fetchWeather(location);
    }
  }, []);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    // Normalize city: trim, collapse spaces, title case
    let normalizedCity = city.trim().replace(/\s+/g, ' ');
    normalizedCity = normalizedCity
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&units=imperial&appid=${OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        // Map OpenWeatherMap weather to our widget's weather types
        let weatherType = 'cloudy';
        const main = data.weather[0].main.toLowerCase();
        if (main.includes('clear')) weatherType = 'sunny';
        else if (main.includes('rain')) weatherType = 'rainy';
        else if (main.includes('snow')) weatherType = 'snowy';
        else if (main.includes('storm') || main.includes('thunder')) weatherType = 'stormy';

        setWeatherData({
          location: normalizedCity,
          currentWeather: weatherType,
          temperature: Math.round(data.main.temp), // now in Fahrenheit
        });
        onUpdateData({
          location: normalizedCity,
          currentWeather: weatherType,
          temperature: Math.round(data.main.temp),
        });
        setError(null);
      } else {
        setWeatherData(null); // Clear weather data if fetch fails
        setError(data.message ? `Error: ${data.message}` : "City not found. Please select a valid city.");
      }
    } catch (err) {
      setWeatherData(null); // Clear weather data if fetch fails
      setError("Error fetching weather. Please try again.");
    }
    setLoading(false);
  };

  const saveLocation = () => {
    if (newLocation.trim()) {
      fetchWeather(newLocation.trim());
      setEditingLocation(false);
    }
  };

  const getWeatherIcon = (weather?: string) => {
    switch (weather) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snowy': return <CloudSnow className="h-8 w-8 text-blue-300" />;
      case 'stormy': return <Zap className="h-8 w-8 text-purple-500" />;
      default: return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  const getWeatherEmoji = (weather?: string) => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'stormy': return '⛈️';
      default: return '☁️';
    }
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pastel-teal rounded-full flex items-center justify-center doodle-icon">
            <Cloud className="text-warm-brown h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-warm-brown">Weather</h3>
            <span className="text-xs text-warm-brown/50">live data</span>
          </div>
        </div>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className="text-warm-brown/50 hover:text-warm-brown doodle-icon p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-start space-y-4 min-h-0 pt-2 overflow-y-auto w-full">
        {loading ? (
          <div className="text-center text-warm-brown/60">Loading weather...</div>
        ) : weatherData ? (
          <>
            <div className="text-center">
              <div className="text-4xl mb-2">{getWeatherEmoji(weatherData.currentWeather)}</div>
              <div className="text-3xl font-bold text-warm-brown mb-1">
                {weatherData.temperature}°F
              </div>
              <p className="text-sm text-warm-brown/70 capitalize mb-2">{weatherData.currentWeather}</p>
            </div>
            <Button
              onClick={() => setEditingLocation(true)}
              variant="ghost"
              className="flex items-center space-x-2 text-warm-brown/60 hover:text-warm-brown text-xs max-w-full"
            >
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{weatherData.location}</span>
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
            <div className="text-4xl mb-2">🌤️</div>
            <p className="text-sm text-warm-brown/70">Set your location to see weather</p>
            <Button
              onClick={() => setEditingLocation(true)}
              variant="ghost"
              className="text-warm-brown/60 hover:text-warm-brown text-sm"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Set Location
            </Button>
          </div>
        )}

        {editingLocation && (
          <div className="w-full mt-4 space-y-2">
            <div className="bg-ivory/50 p-3 rounded-lg border border-warm-brown/20">
              <label className="block text-xs text-warm-brown mb-1">Enter a city name:</label>
              <input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Type city name..."
                className="w-full bg-white/50 border border-warm-brown/20 rounded text-warm-brown placeholder-warm-brown/60 focus:border-warm-brown focus:ring-1 focus:ring-warm-brown/20 text-sm px-3 py-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveLocation();
                  }
                }}
                autoFocus
              />
            </div>
            {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setEditingLocation(false);
                  setNewLocation(location || "San Francisco");
                }}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={saveLocation}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
