import { Button } from "@/components/ui/button";
import { Heart, Calendar, Cloud, X } from "lucide-react";

interface WelcomeWidgetProps {
  onRemove: () => void;
}

export function WelcomeWidget({ onRemove }: WelcomeWidgetProps) {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dusty-pink rounded-full flex items-center justify-center doodle-icon">
            <Heart className="text-warm-brown h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold text-warm-brown">Welcome back!</h2>
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
      <div className="space-y-3">
        <p className="text-warm-brown/80 leading-relaxed">
          Good day! Today is a perfect day to be productive and mindful. 
          Your cozy workspace is ready for whatever you want to accomplish.
        </p>
        <div className="flex items-center space-x-4 text-sm text-warm-brown/70">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 doodle-icon" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cloud className="h-4 w-4 doodle-icon" />
            <span>Productive vibes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
