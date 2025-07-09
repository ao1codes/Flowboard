import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, X, Plus, Calendar, CheckCircle, Circle } from "lucide-react";
import { Goal } from "@shared/schema";

interface GoalsWidgetProps {
  goals: Goal[];
  onUpdateGoals: (goals: Goal[]) => void;
  onRemove: () => void;
}

export function GoalsWidget({ goals, onUpdateGoals, onRemove }: GoalsWidgetProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("");

  const addGoal = () => {
    if (newGoalTitle.trim() && newGoalDate) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim() || undefined,
        targetDate: newGoalDate,
        completed: false,
        progress: 0,
      };
      onUpdateGoals([...goals, newGoal]);
      setNewGoalTitle("");
      setNewGoalDescription("");
      setNewGoalDate("");
      setShowAddGoal(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    onUpdateGoals(
      goals.map(goal =>
        goal.id === goalId 
          ? { ...goal, completed: !goal.completed, progress: goal.completed ? 0 : 100 }
          : goal
      )
    );
  };

  const updateProgress = (goalId: string, progress: number) => {
    onUpdateGoals(
      goals.map(goal =>
        goal.id === goalId 
          ? { ...goal, progress: Math.max(0, Math.min(100, progress)) }
          : goal
      )
    );
  };

  const removeGoal = (goalId: string) => {
    onUpdateGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getDaysUntil = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days`;
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dusty-pink rounded-full flex items-center justify-center doodle-icon">
            <Trophy className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Goals</h3>
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
        {goals.map((goal) => (
          <div key={goal.id} className="bg-ivory/30 p-3 rounded-lg border-2 border-dashed border-warm-brown/20 group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-2 flex-1">
                <Button
                  onClick={() => toggleGoal(goal.id)}
                  variant="ghost"
                  size="sm"
                  className="p-0 mt-1"
                >
                  {goal.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-warm-brown/60" />
                  )}
                </Button>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium text-warm-brown ${goal.completed ? 'line-through opacity-60' : ''}`}>
                    {goal.title}
                  </h4>
                  {goal.description && (
                    <p className="text-xs text-warm-brown/70 mt-1">{goal.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <Calendar className="h-3 w-3 text-warm-brown/60" />
                    <span className="text-xs text-warm-brown/60">{getDaysUntil(goal.targetDate)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => removeGoal(goal.id)}
                variant="ghost"
                size="sm"
                className="text-warm-brown/30 hover:text-warm-brown/60 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            {!goal.completed && (
              <div className="space-y-2">
                <div className="w-full bg-warm-brown/20 rounded-full h-2">
                  <div 
                    className="bg-dusty-pink h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateProgress(goal.id, goal.progress - 10)}
                    variant="ghost"
                    size="sm"
                    className="text-xs p-1 h-6 text-warm-brown/60 hover:text-warm-brown"
                  >
                    -10%
                  </Button>
                  <span className="text-xs text-warm-brown/70 font-medium">{goal.progress}%</span>
                  <Button
                    onClick={() => updateProgress(goal.id, goal.progress + 10)}
                    variant="ghost"
                    size="sm"
                    className="text-xs p-1 h-6 text-warm-brown/60 hover:text-warm-brown"
                  >
                    +10%
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {showAddGoal ? (
          <div className="bg-ivory/60 p-3 rounded-lg border-2 border-dashed border-warm-brown/30 space-y-3">
            <Input
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="Goal title..."
              className="w-full bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
            />
            <Textarea
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full bg-transparent border-none resize-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-xs px-1"
              rows={2}
            />
            <Input
              type="date"
              value={newGoalDate}
              onChange={(e) => setNewGoalDate(e.target.value)}
              className="w-full bg-transparent border-none text-warm-brown focus:ring-0 focus-visible:ring-0 text-sm px-1"
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoalTitle("");
                  setNewGoalDescription("");
                  setNewGoalDate("");
                }}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={addGoal}
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
            onClick={() => setShowAddGoal(true)}
            className="w-full p-3 border-2 border-dashed border-warm-brown/30 rounded-lg text-warm-brown/60 hover:text-warm-brown hover:bg-ivory/30 transition-colors text-xs"
            variant="ghost"
          >
            <Plus className="mr-2 doodle-icon h-3 w-3" />
            Add Goal
          </Button>
        )}
        
        {goals.length === 0 && !showAddGoal && (
          <p className="text-warm-brown/60 text-xs text-center py-4">
            No goals yet. Set your first goal to get started!
          </p>
        )}
      </div>
    </div>
  );
}