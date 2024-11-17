import React from 'react';
import { BOOK_IMAGES } from '../utils/constants';
import { ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  selectedUrl: string;
  onSelect: (url: string) => void;
}

export default function ImagePicker({ selectedUrl, onSelect }: ImagePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <div 
        className="relative border border-gray-300 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedUrl ? (
          <img 
            src={selectedUrl} 
            alt="Selected book"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
          <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Choose Image
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 w-full">
          <div className="grid grid-cols-3 gap-4">
            {BOOK_IMAGES.map((image) => (
              <div
                key={image.id}
                onClick={() => {
                  onSelect(image.url);
                  setIsOpen(false);
                }}
                className={`relative cursor-pointer rounded-lg overflow-hidden ${
                  selectedUrl === image.url ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={image.thumbnail}
                  alt={image.description}
                  className="w-full h-20 object-cover"
                />
                <div className="absolute inset-0 hover:bg-black hover:bg-opacity-10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}