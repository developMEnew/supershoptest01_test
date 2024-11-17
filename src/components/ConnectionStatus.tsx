import React from 'react';
import { Github } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  React.useEffect(() => {
    if (!isConnected) {
      toast.error('GitHub connection lost! Please check your internet connection.', {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white py-2 px-4 flex items-center justify-center gap-2 shadow-lg">
      <Github size={20} />
      <span className="font-medium">Connection to GitHub lost</span>
    </div>
  );
}