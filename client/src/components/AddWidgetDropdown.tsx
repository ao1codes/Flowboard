import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown } from "lucide-react";
import { WidgetType } from "@shared/schema";
import { WIDGET_CONFIGS } from "../types/widgets";
import { 
  Heart, 
  CheckSquare, 
  Timer, 
  Quote, 
  StickyNote, 
  Sprout, 
  Smile,
  Cloud,
  Calendar,
  Trophy,
  Droplets,
  BookOpen,
  DollarSign
} from "lucide-react";

function getWidgetIcon(type: WidgetType) {
  switch (type) {
    case 'welcome':
      return Heart;
    case 'todo':
      return CheckSquare;
    case 'pomodoro':
      return Timer;
    case 'quote':
      return Quote;
    case 'sticky-notes':
      return StickyNote;
    case 'habit-tracker':
      return Sprout;
    case 'mood-tracker':
      return Smile;
    case 'weather':
      return Cloud;
    case 'calendar':
      return Calendar;
    case 'goals':
      return Trophy;
    case 'water-tracker':
      return Droplets;
    case 'reading-tracker':
      return BookOpen;
    case 'expense-tracker':
      return DollarSign;
    default:
      return Heart;
  }
}

interface AddWidgetDropdownProps {
  onAddWidget: (type: WidgetType) => void;
}

export function AddWidgetDropdown({ onAddWidget }: AddWidgetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddWidget = (type: WidgetType) => {
    console.log('Adding widget via dropdown:', type); // Debug log
    onAddWidget(type);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-warm-brown hover:text-warm-brown/80 hover:bg-ivory/50 doodle-icon"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 sketchy-border bg-ivory"
        sideOffset={5}
      >
        {Object.values(WIDGET_CONFIGS).map((config) => {
          const IconComponent = getWidgetIcon(config.type);
          
          return (
            <DropdownMenuItem
              key={config.type}
              onClick={() => handleAddWidget(config.type)}
              className="flex items-center space-x-3 px-3 py-2 text-warm-brown hover:bg-ivory/50 cursor-pointer transition-colors"
            >
              <IconComponent className={`h-4 w-4 ${
                config.color === 'dusty-pink' ? 'text-dusty-pink' :
                config.color === 'sage' ? 'text-sage' :
                config.color === 'pastel-teal' ? 'text-pastel-teal' :
                'text-warm-brown'
              }`} />
              <span className="text-sm font-medium">{config.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}