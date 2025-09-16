import React from 'react';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  title: string;
  category: string;
  progress: number;
  timeLeft: string;
  image: string;
  teamMembers?: string[];
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  category,
  progress,
  timeLeft,
  image,
  teamMembers = [],
  onClick
}) => {
  return (
    <div
      className="flex-shrink-0 w-full sm:w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden task-card-hover cursor-pointer touch-manipulation"
      onClick={onClick}
    >
      {/* Image */}
      <div className="h-40 sm:h-48 bg-gray-200 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-3 sm:mb-4">{category}</p>

        {/* Progress Bar */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Time */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{timeLeft}</span>
          </div>

          {/* Team Members */}
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 3).map((member, index) => (
              <div
                key={index}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
              >
                <img
                  src={member}
                  alt={`Team member ${index + 1}`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ))}
            {teamMembers.length > 3 && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{teamMembers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
