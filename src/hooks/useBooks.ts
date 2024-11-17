import { useState, useEffect } from 'react';
import { fetchBooks, saveBooks, uploadImageToGitHub } from '../services/githubStorage';
import type { BookItem } from '../types';
import toast from 'react-hot-toast';

export function useBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const addBook = async (bookData: Omit<BookItem, 'id' | 'dateAdded'>) => {
    try {
      let imageUrl = bookData.imageUrl;
      
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = `book_${Date.now()}.${blob.type.split('/')[1]}`;
        imageUrl = await uploadImageToGitHub(blob, fileName);
      }

      const newBook: BookItem = {
        ...bookData,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
        imageUrl
      };

      const updatedBooks = [...books, newBook];
      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
      toast.success('Book added successfully');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
      throw error;
    }
  };

  const updateBook = async (id: string, bookData: Partial<BookItem>) => {
    try {
      let imageUrl = bookData.imageUrl;
      
      if (imageUrl?.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = `book_${Date.now()}.${blob.type.split('/')[1]}`;
        imageUrl = await uploadImageToGitHub(blob, fileName);
      }

      const updatedBooks = books.map(book => 
        book.id === id 
          ? { ...book, ...bookData, ...(imageUrl && { imageUrl }) }
          : book
      );

      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
      toast.success('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const updatedBooks = books.filter(book => book.id !== id);
      await saveBooks(updatedBooks);
      setBooks(updatedBooks);
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
      throw error;
    }
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
  };
}