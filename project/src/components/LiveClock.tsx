import React, { useState, useEffect } from 'react';

const LiveClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-500">
        {formatDate(currentTime)}
      </div>
      <div className="text-sm text-blue-600 font-mono font-semibold bg-blue-50 px-2 py-1 rounded">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default LiveClock;
