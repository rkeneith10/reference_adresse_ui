import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

interface TooltipIconProps {
  field: string;
  tooltipMessage: string;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ field, tooltipMessage }) => {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);

  const handleTooltipToggle = () => {
    setVisibleTooltip(field);
  };

  const handleTooltipHide = () => {
    setVisibleTooltip(null);
  };

  return (
    <div
      className="ml-2 inline-block cursor-pointer relative ml-8"
      onMouseEnter={handleTooltipToggle}
      onMouseLeave={handleTooltipHide}
    >
      <FaQuestionCircle className="text-gray-500" size={15} />
      {visibleTooltip === field && (
        <div className="absolute z-10 bg-gray-900 text-white text-md rounded-lg shadow-lg p-3 -top-12 left-5 transform -translate-x-1/2 w-72 text-center">
          {tooltipMessage}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 bottom-[-5px]"></div>
        </div>
      )}
    </div>
  );
};

export default TooltipIcon;
