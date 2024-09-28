import React, { useContext } from 'react';
import { BoardContext } from '../../context/BoardContext';

function ToolBar() {
  const { currentTool, setCurrentTool } = useContext(BoardContext);

  const icons = [
    { src: '/assets/icons/arrow_straight.svg', alt: 'Straight arrow', tool: 'straight-arrow' },
    { src: '/assets/icons/arrow_free.svg', alt: 'Free arrow', tool: 'free-arrow' },
    { src: '/assets/icons/arrow_straight_dash.svg', alt: 'Dashed straight arrow', tool: 'straight-arrow-dashed' },
    { src: '/assets/icons/arrow_free_dash.svg', alt: 'Dashed free arrow', tool: 'free-arrow-dashed' },
    { src: '/assets/icons/eraser.svg', alt: 'Eraser', tool: 'eraser' },
  ];

  const handleIconClick = (tool) => {
    setCurrentTool(currentTool === tool ? null : tool);
  };

  return (
    <div className="toolbar-container flex justify-center gap-2">
      {icons.map((icon, index) => (
        <button
          key={index}
          onClick={() => handleIconClick(icon.tool)}
          className={`px-2 py-1 border ${currentTool === icon.tool ? 'bg-yellow-400' : ''} text-sm rounded hover:bg-yellow-500`}
        >
          <img src={icon.src} alt={icon.alt} className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
}

export default ToolBar;
