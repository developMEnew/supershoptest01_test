import React, { useState } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import BookGrid from './components/BookGrid';
import AddItemForm from './components/AddItemForm';
import { SAMPLE_BOOKS } from './utils/constants';
import type { BookItem } from './types';

function App() {
  const [books, setBooks] = useState<BookItem[]>(SAMPLE_BOOKS);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | undefined>();

  const handleAddBook = (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    const newBook: BookItem = {
      ...bookData,
      id: books.length + 1,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBooks([...books, newBook]);
    setIsAddingItem(false);
  };

  const handleEditBook = (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    if (editingBook) {
      setBooks(books.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...bookData }
          : book
      ));
      setEditingBook(undefined);
      setIsAddingItem(false);
    }
  };

  const handleDeleteBook = (book: BookItem) => {
    setBooks(books.filter(b => b.id !== book.id));
    setEditingBook(undefined);
    setIsAddingItem(false);
  };

  const totalItems = books.reduce((sum, book) => sum + book.quantity, 0);
  const totalBooks = books.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isAddingItem={isAddingItem}
        onToggleAdd={() => {
          setIsAddingItem(!isAddingItem);
          setEditingBook(undefined);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAddingItem || editingBook ? (
          <AddItemForm
            book={editingBook}
            onSubmit={editingBook ? handleEditBook : handleAddBook}
            onDelete={handleDeleteBook}
            onCancel={() => {
              setIsAddingItem(false);
              setEditingBook(undefined);
            }}
          />
        ) : (
          <>
            <StatsCard totalItems={totalItems} totalBooks={totalBooks} />
            <BookGrid 
              books={books}
              onEditBook={(book) => {
                setEditingBook(book);
                setIsAddingItem(true);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;