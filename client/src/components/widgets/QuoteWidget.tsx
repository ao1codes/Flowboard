import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Quote as QuoteIcon, RefreshCw, X } from "lucide-react";
import { Quote } from "@shared/schema";

interface QuoteWidgetProps {
  currentQuote: Quote;
  onUpdateQuote: (quote: Quote) => void;
  onRemove: () => void;
}

const QUOTES: Quote[] = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The future belongs to those who prepare for it today.",
    author: "Malcolm X",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
];

export function QuoteWidget({ currentQuote, onUpdateQuote, onRemove }: QuoteWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getNewQuote = () => {
    console.log('Getting new quote...'); // Debug log
    setIsLoading(true);
    setTimeout(() => {
      const availableQuotes = QUOTES.filter(q => q.text !== currentQuote.text);
      const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
      console.log('New quote selected:', randomQuote); // Debug log
      onUpdateQuote(randomQuote);
      setIsLoading(false);
    }, 500); // Simulate loading
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pastel-teal rounded-full flex items-center justify-center doodle-icon">
            <QuoteIcon className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Daily Quote</h3>
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
      
      <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
        <blockquote className="text-warm-brown/80 italic leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        <cite className="text-sm text-warm-brown/60 block">
          — {currentQuote.author}
        </cite>
        <Button
          onClick={getNewQuote}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="text-xs text-warm-brown/50 hover:text-warm-brown transition-colors doodle-icon mt-auto"
        >
          <RefreshCw className={`mr-1 h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          New Quote
        </Button>
      </div>
    </div>
  );
}
