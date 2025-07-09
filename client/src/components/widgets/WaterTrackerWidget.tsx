import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplets, X, Plus, Minus } from "lucide-react";
import { WaterEntry } from "@shared/schema";

interface WaterTrackerWidgetProps {
  dailyTarget: number;
  todayAmount: number;
  history: WaterEntry[];
  onUpdateData: (data: { dailyTarget: number; todayAmount: number; history: WaterEntry[] }) => void;
  onRemove: () => void;
}

export function WaterTrackerWidget({ 
  dailyTarget, 
  todayAmount, 
  history, 
  onUpdateData, 
  onRemove 
}: WaterTrackerWidgetProps) {
  const today = new Date().toISOString().split('T')[0];
  const progress = Math.min((todayAmount / dailyTarget) * 100, 100);

  const addWater = () => {
    const newAmount = todayAmount + 1;
    const updatedHistory = history.filter(entry => entry.date !== today);
    updatedHistory.push({
      date: today,
      amount: newAmount,
      target: dailyTarget,
    });

    onUpdateData({
      dailyTarget,
      todayAmount: newAmount,
      history: updatedHistory,
    });
  };

  const removeWater = () => {
    if (todayAmount > 0) {
      const newAmount = todayAmount - 1;
      const updatedHistory = history.filter(entry => entry.date !== today);
      if (newAmount > 0) {
        updatedHistory.push({
          date: today,
          amount: newAmount,
          target: dailyTarget,
        });
      }

      onUpdateData({
        dailyTarget,
        todayAmount: newAmount,
        history: updatedHistory,
      });
    }
  };

  const getWaterEmoji = () => {
    if (progress >= 100) return "🏆";
    if (progress >= 75) return "💧";
    if (progress >= 50) return "🌊";
    if (progress >= 25) return "💦";
    return "🥤";
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pastel-teal rounded-full flex items-center justify-center doodle-icon">
            <Droplets className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Water</h3>
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
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{getWaterEmoji()}</div>
          <div className="text-2xl font-bold text-warm-brown">
            {todayAmount}<span className="text-sm font-normal">/{dailyTarget}</span>
          </div>
          <p className="text-sm text-warm-brown/70">glasses today</p>
        </div>

        <div className="w-full bg-warm-brown/20 rounded-full h-3 mb-4">
          <div 
            className="bg-pastel-teal h-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={removeWater}
            disabled={todayAmount === 0}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-warm-brown/10 hover:bg-warm-brown/20 disabled:opacity-30"
          >
            <Minus className="h-4 w-4 text-warm-brown" />
          </Button>
          
          <Button
            onClick={addWater}
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-pastel-teal/20 hover:bg-pastel-teal/30 font-bold text-warm-brown"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {progress >= 100 && (
          <p className="text-xs text-pastel-teal font-medium animate-bounce">
            Daily goal achieved! 🎉
          </p>
        )}
      </div>
    </div>
  );
}