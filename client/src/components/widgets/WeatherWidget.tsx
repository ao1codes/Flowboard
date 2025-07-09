import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, X, MapPin, Sun, CloudRain, CloudSnow, Zap } from "lucide-react";

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
  const [newLocation, setNewLocation] = useState(location || "");

  const saveLocation = () => {
    if (newLocation.trim()) {
      // basic weather based on location and season  
      const location = newLocation.trim().toLowerCase();
      const month = new Date().getMonth(); // 0-11
      
      let weather = 'sunny';
      let temp = 20;
      
      // winter months (dec, jan, feb)
      if (month === 11 || month === 0 || month === 1) {
        if (location.includes('london') || location.includes('seattle') || location.includes('portland')) {
          weather = 'rainy';
          temp = Math.floor(Math.random() * 10) + 5; // 5-15°C
        } else if (location.includes('new york') || location.includes('chicago') || location.includes('toronto')) {
          weather = 'snowy';
          temp = Math.floor(Math.random() * 8) - 2; // -2 to 6°C
        } else {
          weather = 'cloudy';
          temp = Math.floor(Math.random() * 15) + 8; // 8-23°C
        }
      }
      // summer months (jun, jul, aug)
      else if (month >= 5 && month <= 7) {
        if (location.includes('miami') || location.includes('phoenix') || location.includes('las vegas')) {
          weather = 'sunny';
          temp = Math.floor(Math.random() * 15) + 28; // 28-43°C
        } else if (location.includes('san francisco')) {
          weather = 'cloudy';
          temp = Math.floor(Math.random() * 8) + 18; // 18-26°C
        } else {
          weather = 'sunny';
          temp = Math.floor(Math.random() * 12) + 22; // 22-34°C
        }
      }
      // spring/fall
      else {
        if (location.includes('seattle') || location.includes('london')) {
          weather = 'rainy';
          temp = Math.floor(Math.random() * 10) + 12; // 12-22°C
        } else {
          weather = Math.random() > 0.5 ? 'sunny' : 'cloudy';
          temp = Math.floor(Math.random() * 15) + 15; // 15-30°C
        }
      }
      
      onUpdateData({
        location: newLocation.trim(),
        currentWeather: weather,
        temperature: temp,
      });
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
            <span className="text-xs text-warm-brown/50">simulated data</span>
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
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-0 overflow-hidden">
        {location && currentWeather && temperature ? (
          <>
            <div className="text-center">
              <div className="text-4xl mb-2">{getWeatherEmoji(currentWeather)}</div>
              <div className="text-3xl font-bold text-warm-brown mb-1">
                {temperature}°C
              </div>
              <p className="text-sm text-warm-brown/70 capitalize mb-2">{currentWeather}</p>
            </div>
            
            <Button
              onClick={() => setEditingLocation(true)}
              variant="ghost"
              className="flex items-center space-x-2 text-warm-brown/60 hover:text-warm-brown text-xs max-w-full"
            >
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
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
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter city name..."
                className="w-full bg-white/50 border border-warm-brown/20 rounded text-warm-brown placeholder-warm-brown/60 focus:border-warm-brown focus:ring-1 focus:ring-warm-brown/20 text-sm px-3 py-2"
                onKeyPress={(e) => e.key === 'Enter' && saveLocation()}
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setEditingLocation(false);
                  setNewLocation(location || "");
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