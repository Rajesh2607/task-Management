import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollSectionProps {
  title: string;
  children: React.ReactNode;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ title, children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="hidden sm:flex space-x-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="grid grid-cols-1 sm:flex sm:space-x-4 lg:space-x-6 sm:overflow-x-auto scrollbar-hide pb-4 gap-4 sm:gap-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollSection;
