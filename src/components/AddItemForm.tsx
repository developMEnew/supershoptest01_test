import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import type { BookItem } from '../types';
import ImagePicker from './ImagePicker';

interface AddItemFormProps {
  book?: BookItem;
  onSubmit: (book: Omit<BookItem, 'id' | 'dateAdded'>) => void;
  onCancel: () => void;
}

export default function AddItemForm({ book, onSubmit, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    category: '',
    supplier: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        purchasePrice: book.purchasePrice.toString(),
        sellingPrice: book.sellingPrice.toString(),
        quantity: book.quantity.toString(),
        category: book.category,
        supplier: book.supplier,
        imageUrl: book.imageUrl
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      category: formData.category,
      supplier: formData.supplier,
      imageUrl: formData.imageUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {book ? 'Edit Book' : 'Add New Book'}
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Title
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter book title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Image
            </label>
            <ImagePicker
              selectedUrl={formData.imageUrl}
              onSelect={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="educational">Educational</option>
              <option value="children">Children</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                required
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter supplier name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={formData.purchasePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={formData.sellingPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              required
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quantity"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {book ? 'Update Book' : 'Add Book'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}