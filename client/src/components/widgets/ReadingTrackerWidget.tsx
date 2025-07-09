import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, X, Plus, CheckCircle } from "lucide-react";
import { ReadingEntry } from "@shared/schema";

interface ReadingTrackerWidgetProps {
  currentBooks: ReadingEntry[];
  booksRead: number;
  pagesRead: number;
  onUpdateData: (data: { currentBooks: ReadingEntry[]; booksRead: number; pagesRead: number }) => void;
  onRemove: () => void;
}

export function ReadingTrackerWidget({ 
  currentBooks, 
  booksRead, 
  pagesRead, 
  onUpdateData, 
  onRemove 
}: ReadingTrackerWidgetProps) {
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookPages, setNewBookPages] = useState("");

  const addBook = () => {
    if (newBookTitle.trim() && newBookAuthor.trim() && newBookPages) {
      const newBook: ReadingEntry = {
        id: Date.now().toString(),
        bookTitle: newBookTitle.trim(),
        author: newBookAuthor.trim(),
        totalPages: parseInt(newBookPages),
        currentPage: 0,
        startedDate: new Date().toISOString().split('T')[0],
      };
      onUpdateData({
        currentBooks: [...currentBooks, newBook],
        booksRead,
        pagesRead,
      });
      setNewBookTitle("");
      setNewBookAuthor("");
      setNewBookPages("");
      setShowAddBook(false);
    }
  };

  const updateProgress = (bookId: string, newPage: number) => {
    const updatedBooks = currentBooks.map(book => {
      if (book.id === bookId) {
        return { ...book, currentPage: Math.max(0, Math.min(newPage, book.totalPages)) };
      }
      return book;
    });

    onUpdateData({
      currentBooks: updatedBooks,
      booksRead,
      pagesRead,
    });
  };

  const finishBook = (bookId: string) => {
    const book = currentBooks.find(b => b.id === bookId);
    if (!book) return;

    const updatedBooks = currentBooks.filter(b => b.id !== bookId);
    const newBooksRead = booksRead + 1;
    const newPagesRead = pagesRead + book.totalPages;

    onUpdateData({
      currentBooks: updatedBooks,
      booksRead: newBooksRead,
      pagesRead: newPagesRead,
    });
  };

  const removeBook = (bookId: string) => {
    const updatedBooks = currentBooks.filter(book => book.id !== bookId);
    onUpdateData({
      currentBooks: updatedBooks,
      booksRead,
      pagesRead,
    });
  };

  const getProgress = (book: ReadingEntry) => {
    return Math.round((book.currentPage / book.totalPages) * 100);
  };

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center doodle-icon">
            <BookOpen className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Reading</h3>
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

      <div className="flex justify-around mb-4 text-center">
        <div>
          <div className="text-lg font-bold text-warm-brown">{booksRead}</div>
          <div className="text-xs text-warm-brown/70">Books Read</div>
        </div>
        <div>
          <div className="text-lg font-bold text-warm-brown">{pagesRead.toLocaleString()}</div>
          <div className="text-xs text-warm-brown/70">Pages Read</div>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 min-h-0 overflow-y-auto">
        {currentBooks.map((book) => (
          <div key={book.id} className="bg-ivory/30 p-3 rounded-lg border-2 border-dashed border-warm-brown/20 group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-warm-brown">{book.bookTitle}</h4>
                <p className="text-xs text-warm-brown/70">by {book.author}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-warm-brown/60">
                    {book.currentPage} / {book.totalPages} pages
                  </span>
                  <span className="text-xs font-medium text-warm-brown">
                    {getProgress(book)}%
                  </span>
                </div>
              </div>
              <Button
                onClick={() => removeBook(book.id)}
                variant="ghost"
                size="sm"
                className="text-warm-brown/30 hover:text-warm-brown/60 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="w-full bg-warm-brown/20 rounded-full h-2 mb-3">
              <div 
                className="bg-sage h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress(book)}%` }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => updateProgress(book.id, book.currentPage - 10)}
                variant="ghost"
                size="sm"
                className="text-xs p-1 h-6 text-warm-brown/60 hover:text-warm-brown"
              >
                -10
              </Button>
              <Button
                onClick={() => updateProgress(book.id, book.currentPage + 10)}
                variant="ghost"
                size="sm"
                className="text-xs p-1 h-6 text-warm-brown/60 hover:text-warm-brown"
              >
                +10
              </Button>
              {book.currentPage >= book.totalPages && (
                <Button
                  onClick={() => finishBook(book.id)}
                  variant="ghost"
                  size="sm"
                  className="text-xs p-1 h-6 text-green-600 hover:text-green-700 ml-auto"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Finish
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {showAddBook ? (
          <div className="bg-ivory/60 p-3 rounded-lg border-2 border-dashed border-warm-brown/30 space-y-3">
            <Input
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              placeholder="Book title..."
              className="w-full bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
            />
            <Input
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
              placeholder="Author..."
              className="w-full bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
            />
            <Input
              type="number"
              value={newBookPages}
              onChange={(e) => setNewBookPages(e.target.value)}
              placeholder="Total pages..."
              className="w-full bg-transparent border-none text-warm-brown placeholder-warm-brown/60 focus:ring-0 focus-visible:ring-0 text-sm px-1"
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowAddBook(false);
                  setNewBookTitle("");
                  setNewBookAuthor("");
                  setNewBookPages("");
                }}
                variant="ghost"
                size="sm"
                className="text-warm-brown/60 hover:text-warm-brown text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={addBook}
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
            onClick={() => setShowAddBook(true)}
            className="w-full p-3 border-2 border-dashed border-warm-brown/30 rounded-lg text-warm-brown/60 hover:text-warm-brown hover:bg-ivory/30 transition-colors text-xs"
            variant="ghost"
          >
            <Plus className="mr-2 doodle-icon h-3 w-3" />
            Add Book
          </Button>
        )}
        
        {currentBooks.length === 0 && !showAddBook && (
          <p className="text-warm-brown/60 text-xs text-center py-4">
            No books in progress. Start reading something new!
          </p>
        )}
      </div>
    </div>
  );
}