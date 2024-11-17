import { useState, useEffect, useCallback } from 'react';
import { fetchBooks, saveBooks, uploadImageToGitHub } from '../services/githubStorage';
import type { BookItem } from '../types';
import toast from 'react-hot-toast';

export function useBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load books');
      console.error('Error loading books:', error);
      setError(error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = async (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    try {
      setError(null);
      let imageUrl = bookData.imageUrl;
      
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = `book_${Date.now()}.${blob.type.split('/')[1]}`;
        imageUrl = await uploadImageToGitHub(blob, fileName);
      }

      // Fetch latest books before adding
      const currentBooks = await fetchBooks();
      
      const newBook: BookItem = {
        ...bookData,
        id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dateAdded: new Date().toISOString(),
        imageUrl
      };

      const updatedBooks = [...currentBooks, newBook];
      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
      toast.success('Book added successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add book');
      console.error('Error adding book:', error);
      setError(error);
      toast.error('Failed to add book');
      throw error;
    }
  };

  const updateBook = async (id: string, bookData: Partial<BookItem>) => {
    try {
      setError(null);
      let imageUrl = bookData.imageUrl;
      
      if (imageUrl?.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = `book_${Date.now()}.${blob.type.split('/')[1]}`;
        imageUrl = await uploadImageToGitHub(blob, fileName);
      }

      // Fetch latest books before updating
      const currentBooks = await fetchBooks();
      
      const updatedBooks = currentBooks.map(book => 
        book.id === id 
          ? { ...book, ...bookData, ...(imageUrl && { imageUrl }) }
          : book
      );

      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
      toast.success('Book updated successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update book');
      console.error('Error updating book:', error);
      setError(error);
      toast.error('Failed to update book');
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setError(null);
      // Fetch latest books before deleting
      const currentBooks = await fetchBooks();
      const updatedBooks = currentBooks.filter(book => book.id !== id);
      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
      toast.success('Book deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete book');
      console.error('Error deleting book:', error);
      setError(error);
      toast.error('Failed to delete book');
      throw error;
    }
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refreshBooks: loadBooks,
  };
}