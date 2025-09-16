import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Help Center"
        className="fixed bottom-6 left-6 w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors z-50"
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 bg-gray-800 text-white rounded-xl shadow-xl z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Help Center</h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Help Center"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Having trouble in learning? Please contact us for more questions.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-white text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Go To Help Center
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpCenter;
