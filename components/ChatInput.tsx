import React, { useState, useRef, useCallback } from 'react';
import type { UploadedImage } from '../types';
import { Icon } from './Icon';

interface ChatInputProps {
  onSendMessage: (prompt: string, image?: UploadedImage) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSendMessage = useCallback(() => {
    if ((!prompt.trim() && !image) || isLoading) return;
    onSendMessage(prompt, image ?? undefined);
    setPrompt('');
    setImage(null);
    setError(null);
    if(textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  }, [prompt, image, isLoading, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        setError('File is too large. Max size is 4MB.');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const data = base64String.split(',')[1];
      setImage({
        mimeType: file.type,
        data,
        previewUrl: URL.createObjectURL(file)
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
        <div className="relative bg-gray-800/80 rounded-2xl shadow-lg p-2 flex items-end border border-gray-700 focus-within:border-blue-500 transition-colors">
            {image && (
                <div className="absolute bottom-full left-4 mb-2 p-1.5 bg-gray-700 rounded-lg shadow-md">
                    <div className="relative">
                        <img src={image.previewUrl} alt="upload preview" className="w-20 h-20 object-cover rounded" />
                        <button 
                            onClick={() => setImage(null)}
                            className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors"
                        >
                            <Icon name="close" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Upload image"
            >
                <Icon name="upload" className="w-6 h-6" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Gemini..."
                className="flex-1 bg-transparent resize-none outline-none mx-2 text-lg placeholder-gray-500 max-h-48"
                rows={1}
            />
            <button
                onClick={handleSendMessage}
                disabled={(!prompt.trim() && !image) || isLoading}
                className="p-3 bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed group transition-all enabled:hover:bg-gradient-to-br from-blue-500 to-purple-600"
                aria-label="Send message"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <Icon name="send" className="w-6 h-6 text-gray-300 transition-colors group-hover:text-white" />
                )}
            </button>
        </div>
    </div>
  );
};