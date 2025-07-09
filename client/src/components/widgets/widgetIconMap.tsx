import { 
  Heart, 
  CheckSquare, 
  Timer, 
  Quote, 
  StickyNote, 
  Sprout, 
  Smile 
} from "lucide-react";
import { WidgetType } from "@shared/schema";

export function getWidgetIcon(type: WidgetType) {
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
    default:
      return Heart;
  }
}