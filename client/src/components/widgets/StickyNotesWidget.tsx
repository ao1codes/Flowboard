import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus, X, Edit2, Check } from "lucide-react";
import { StickyNote as StickyNoteType } from "@shared/schema";

interface StickyNotesWidgetProps {
  notes: StickyNoteType[];
  onUpdateNotes: (notes: StickyNoteType[]) => void;
  onRemove: () => void;
}

const NOTE_COLORS = ['dusty-pink', 'sage', 'pastel-teal', 'ivory'];

export function StickyNotesWidget({ notes, onUpdateNotes, onRemove }: StickyNotesWidgetProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const addNote = () => {
    console.log('Adding sticky note:', newNoteText); // Debug log
    if (newNoteText.trim()) {
      const newNote: StickyNoteType = {
        id: Date.now().toString(),
        text: newNoteText.trim(),
        color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
        createdAt: new Date().toISOString(),
      };
      onUpdateNotes([...notes, newNote]);
      setNewNoteText("");
      setShowAddNote(false);
    }
  };

  const removeNote = (id: string) => {
    onUpdateNotes(notes.filter(note => note.id !== id));
  };

  const startEditing = (note: StickyNoteType) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = () => {
    if (editingText.trim() && editingNoteId) {
      onUpdateNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, text: editingText.trim() }
          : note
      ));
      setEditingNoteId(null);
      setEditingText("");
    }
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditingText("");
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'dusty-pink': return 'bg-dusty-pink/20 border-dusty-pink/30';
      case 'sage': return 'bg-sage/20 border-sage/30';
      case 'pastel-teal': return 'bg-pastel-teal/20 border-pastel-teal/30';
      default: return 'bg-ivory/60 border-ivory/80';
    }
  };

  const getRotation = (index: number) => {
    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
    return rotations[index % rotations.length];
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center doodle-icon">
            <StickyNote className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Sticky Notes</h3>
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
        {notes.map((note, index) => (
          <div 
            key={note.id} 
            className={`${getColorClass(note.color)} p-3 rounded-lg border-2 border-dashed transform ${getRotation(index)} hover:rotate-0 transition-transform relative group`}
          >
            {editingNoteId === note.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full bg-transparent border-none resize-none text-warm-brown text-sm focus:ring-0 focus-visible:ring-0 p-0"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      saveEdit();
                    }
                  }}
                />
                <div className="flex justify-end space-x-1">
                  <Button
                    onClick={cancelEdit}
                    variant="ghost"
                    size="sm"
                    className="text-warm-brown/60 hover:text-warm-brown p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={saveEdit}
                    variant="ghost"
                    size="sm"
                    className="text-warm-brown/60 hover:text-warm-brown p-1"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p 
                  className="text-warm-brown text-sm pr-12 cursor-pointer"
                  onDoubleClick={() => startEditing(note)}
                  title="Double-click to edit"
                >
                  {note.text}
                </p>
                <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => startEditing(note)}
                    variant="ghost"
                    size="sm"
                    className="text-warm-brown/30 hover:text-warm-brown/60 p-1"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => removeNote(note.id)}
                    variant="ghost"
                    size="sm"
                    className="text-warm-brown/30 hover:text-warm-brown/60 p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {showAddNote ? (
          <div className="bg-ivory/60 p-3 rounded-lg border-2 border-dashed border-warm-brown/30 space-y-2">
            <Textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write your note..."
              className="w-full bg-transparent border-none resize-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0"
              rows={2}
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNoteText("");
                }}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown"
              >
                Cancel
              </Button>
              <Button
                onClick={addNote}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown"
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddNote(true)}
            className="w-full p-3 border-2 border-dashed border-warm-brown/30 rounded-lg text-warm-brown/60 hover:text-warm-brown hover:bg-ivory/30 transition-colors"
            variant="ghost"
          >
            <Plus className="mr-2 doodle-icon h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>
    </div>
  );
}
