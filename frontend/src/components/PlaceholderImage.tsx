// Placeholder image component for development
import React from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  type?: 'avatar' | 'task' | 'profile' | 'hero';
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  width = 200, 
  height = 200, 
  className = '', 
  alt = 'Placeholder',
  type = 'task'
}) => {
  const getPlaceholderContent = () => {
    switch (type) {
      case 'avatar':
        return (
          <div className={`bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${className}`}>
            <span className="text-white font-semibold text-lg">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
        );
      case 'profile':
        return (
          <div className={`bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center ${className}`}>
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'hero':
        return (
          <div className={`bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center ${className}`}>
            <div className="text-center text-white">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Task Preview</span>
            </div>
          </div>
        );
      default:
        return (
          <div className={`bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center ${className}`}>
            <div className="text-center text-white">
              <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Design</span>
            </div>
          </div>
        );
    }
  };

  return getPlaceholderContent();
};

export default PlaceholderImage;
