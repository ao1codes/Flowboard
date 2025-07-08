import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smile, X } from "lucide-react";
import { MoodEntry } from "@shared/schema";

interface MoodTrackerWidgetProps {
  entries: MoodEntry[];
  currentMood?: string;
  onUpdateData: (data: { entries: MoodEntry[]; currentMood?: string }) => void;
  onRemove: () => void;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy & Energetic' },
  { emoji: '😌', label: 'Calm & Content' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Tired' },
  { emoji: '😞', label: 'Sad' },
];

export function MoodTrackerWidget({ entries, currentMood, onUpdateData, onRemove }: MoodTrackerWidgetProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(entry => entry.date === today);

  const selectMood = (mood: string, label: string) => {
    const newEntry: MoodEntry = {
      date: today,
      mood: mood as any,
      moodLabel: label,
    };

    const updatedEntries = entries.filter(entry => entry.date !== today);
    updatedEntries.push(newEntry);

    onUpdateData({
      entries: updatedEntries,
      currentMood: mood,
    });
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pastel-teal rounded-full flex items-center justify-center doodle-icon">
            <Smile className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Mood Check</h3>
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
      
      <div className="space-y-4">
        <p className="text-warm-brown/80 text-sm">How are you feeling today?</p>
        
        <div className="flex justify-center space-x-3">
          {MOOD_OPTIONS.map((option) => {
            const isSelected = todayEntry?.mood === option.emoji;
            return (
              <Button
                key={option.emoji}
                onClick={() => selectMood(option.emoji, option.label)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all doodle-icon ${
                  isSelected 
                    ? 'bg-dusty-pink/40 ring-2 ring-warm-brown scale-110' 
                    : 'bg-warm-brown/10 hover:bg-warm-brown/20'
                }`}
                variant="ghost"
              >
                <span className="text-2xl">{option.emoji}</span>
              </Button>
            );
          })}
        </div>
        
        {todayEntry && (
          <div className="text-center space-y-2">
            <p className="text-sm text-warm-brown/60">
              Current mood: <span className="font-semibold text-warm-brown">{todayEntry.moodLabel}</span>
            </p>
            <div className="text-xs text-warm-brown/50">
              {entries.length > 1 && (
                <p>{entries.length} mood entries tracked</p>
              )}
            </div>
          </div>
        )}
        
        {!todayEntry && (
          <div className="text-center">
            <p className="text-sm text-warm-brown/60">
              Select your mood for today
            </p>
            {entries.length > 0 && (
              <p className="text-xs text-warm-brown/50 mt-1">
                {entries.length} mood entries tracked
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
