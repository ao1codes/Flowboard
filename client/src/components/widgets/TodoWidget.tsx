import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Plus, X, Trash2 } from "lucide-react";
import { TodoItem } from "@shared/schema";

interface TodoWidgetProps {
  items: TodoItem[];
  onUpdateItems: (items: TodoItem[]) => void;
  onRemove: () => void;
}

export function TodoWidget({ items, onUpdateItems, onRemove }: TodoWidgetProps) {
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    console.log('Adding task:', newTask); // Debug log
    if (newTask.trim()) {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      console.log('New item:', newItem); // Debug log
      onUpdateItems([...items, newItem]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => {
    console.log('Toggling task:', id); // Debug log
    onUpdateItems(
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeTask = (id: string) => {
    onUpdateItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    onUpdateItems(items.filter(item => !item.completed));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center doodle-icon">
            <Check className="text-warm-brown h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-warm-brown">To-Do List</h3>
            {totalCount > 0 && (
              <div className="flex items-center space-x-2">
                <p className="text-xs text-warm-brown/60">
                  {completedCount}/{totalCount} completed ({completionPercentage}%)
                </p>
                {completedCount > 0 && (
                  <Button
                    onClick={clearCompleted}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-warm-brown/40 hover:text-warm-brown/60 p-1"
                    title="Clear completed tasks"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
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
      
      <div className="flex-1 space-y-3 min-h-0 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-ivory/50 rounded-lg transition-colors">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleTask(item.id)}
              className="data-[state=checked]:bg-sage data-[state=checked]:border-sage"
            />
            <span className={`flex-1 ${item.completed ? 'text-warm-brown/60 line-through' : 'text-warm-brown'}`}>
              {item.text}
            </span>
            <Button
              onClick={() => removeTask(item.id)}
              variant="ghost"
              size="sm"
              className="text-warm-brown/30 hover:text-warm-brown/60 p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        <div className="flex items-center space-x-3 p-2 border-2 border-dashed border-warm-brown/30 rounded-lg">
          <Input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 p-0"
          />
          <Button
            onClick={addTask}
            variant="ghost"
            size="sm"
            className="text-warm-brown/60 hover:text-warm-brown p-1"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
