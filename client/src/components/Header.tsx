import { Button } from "@/components/ui/button";
import { Download, Grid3X3, RotateCcw, Trash2 } from "lucide-react";
import { AddWidgetDropdown } from "./AddWidgetDropdown";
import { WidgetType } from "@shared/schema";

interface HeaderProps {
  onAddWidget: (type: WidgetType) => void;
  onExportDashboard: () => void;
  onResetDashboard: () => void;
  onClearDashboard: () => void;
}

export function Header({ onAddWidget, onExportDashboard, onResetDashboard, onClearDashboard }: HeaderProps) {
  return (
    <header className="bg-ivory/80 backdrop-blur-sm border-b-2 border-dashed border-warm-brown/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center doodle-icon">
              <Grid3X3 className="text-warm-brown text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-warm-brown">Flowboard</h1>
              <p className="text-sm text-warm-brown/70">Your cozy productivity space</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={onClearDashboard}
              className="hand-drawn-button px-4 py-2 text-warm-brown font-semibold text-sm hover:scale-105 transition-transform"
              variant="ghost"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button
              onClick={onResetDashboard}
              className="hand-drawn-button px-4 py-2 text-warm-brown font-semibold text-sm hover:scale-105 transition-transform"
              variant="ghost"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={onExportDashboard}
              className="hand-drawn-button px-4 py-2 text-warm-brown font-semibold text-sm hover:scale-105 transition-transform"
              variant="ghost"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Dashboard
            </Button>
            <AddWidgetDropdown onAddWidget={onAddWidget} />
          </div>
        </div>
      </div>
    </header>
  );
}
