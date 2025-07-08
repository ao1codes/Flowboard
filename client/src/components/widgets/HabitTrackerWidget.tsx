import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sprout, X, Plus, Edit2, Check } from "lucide-react";
import { Habit } from "@shared/schema";

interface HabitTrackerWidgetProps {
  habits: Habit[];
  onUpdateHabits: (habits: Habit[]) => void;
  onRemove: () => void;
}

export function HabitTrackerWidget({ habits, onUpdateHabits, onRemove }: HabitTrackerWidgetProps) {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const today = new Date().toISOString().split('T')[0];

  const addHabit = () => {
    if (newHabitName.trim()) {
      const colors = ['sage', 'dusty-pink', 'pastel-teal'];
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        color: colors[habits.length % colors.length],
        completedDays: [],
      };
      onUpdateHabits([...habits, newHabit]);
      setNewHabitName("");
      setShowAddHabit(false);
    }
  };

  const removeHabit = (habitId: string) => {
    onUpdateHabits(habits.filter(habit => habit.id !== habitId));
  };
  
  const toggleHabitDay = (habitId: string, date: string) => {
    console.log('Toggling habit for date:', habitId, date); // Debug log
    onUpdateHabits(
      habits.map(habit => {
        if (habit.id === habitId) {
          const completedDays = habit.completedDays.includes(date)
            ? habit.completedDays.filter(d => d !== date)
            : [...habit.completedDays, date];
          return { ...habit, completedDays };
        }
        return habit;
      })
    );
  };

  const getColorClass = (color: string, completed: boolean) => {
    if (!completed) return 'border-2 border-warm-brown/30 bg-white hover:border-warm-brown/50';
    
    // All completed habits use a nice green that fits the cozy aesthetic
    return 'bg-green-500 border-2 border-green-600 hover:bg-green-600 shadow-sm';
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              console.log('blue circle clicked - adding habit'); // debug
              setShowAddHabit(true);
            }}
            className="w-8 h-8 bg-dusty-pink rounded-full flex items-center justify-center doodle-icon hover:scale-110 transition-transform cursor-pointer"
            title="Add new habit"
          >
            <Sprout className="text-warm-brown h-4 w-4" />
          </button>
          <h3 className="text-lg font-bold text-warm-brown">Habits</h3>
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
      
      <div className="flex-1 space-y-3 min-h-0 overflow-y-auto">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between group">
            <span className="text-warm-brown text-sm font-medium flex-1 pr-2">{habit.name}</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1 relative z-10">
                <div
                  onClick={() => {
                    console.log('habit circle clicked', habit.id, today); // debug
                    toggleHabitDay(habit.id, today);
                  }}
                  className={`w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center ${
                    getColorClass(habit.color, habit.completedDays.includes(today))
                  } hover:scale-110 cursor-pointer shadow-sm`}
                  title={`click to toggle today ${habit.completedDays.includes(today) ? '(done)' : '(not done)'}`}
                >
                  {habit.completedDays.includes(today) && (
                    <Check className="h-4 w-4 text-white font-bold drop-shadow-md animate-in zoom-in-50 duration-300" strokeWidth={3} />
                  )}
                </div>
              </div>
              <Button
                onClick={() => removeHabit(habit.id)}
                variant="ghost"
                size="sm"
                className="text-warm-brown/30 hover:text-warm-brown/60 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {showAddHabit ? (
          <div className="bg-ivory/60 p-2 rounded-lg border-2 border-dashed border-warm-brown/30 space-y-2 mx-1">
            <Input
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="habit name..."
              className="w-full bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowAddHabit(false);
                  setNewHabitName("");
                }}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={addHabit}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddHabit(true)}
            className="w-full p-2 border-2 border-dashed border-warm-brown/30 rounded-lg text-warm-brown/60 hover:text-warm-brown hover:bg-ivory/30 transition-colors text-xs"
            variant="ghost"
          >
            <Plus className="mr-1 doodle-icon h-3 w-3" />
            Add Habit
          </Button>
        )}
        
        {habits.length === 0 && !showAddHabit && (
          <p className="text-warm-brown/60 text-xs text-center py-2">
            No habits yet. Start building healthy routines!
          </p>
        )}
      </div>
    </div>
  );
}
