import React, { useContext } from 'react';
import { BoardContext } from '../../context/BoardContext';
import ArrowStraightSvg from '../../assets/icons/arrow_straight.svg';
import ArrowFreeSvg from '../../assets/icons/arrow_free.svg';
import ArrowStraightDashedSvg from '../../assets/icons/arrow_straight_dash.svg';
import ArrowFreeDashedSvg from '../../assets/icons/arrow_free_dash.svg';
import BallSvg from '../../assets/icons/ball_icon.svg';
import EraserSvg from '../../assets/icons/eraser.svg';

const ToolBar = () => {
  const { currentTool, setCurrentTool } = useContext(BoardContext);

  const icons = [
    { src: ArrowStraightSvg, alt: 'Straight arrow', tool: 'straight-arrow' },
    { src: ArrowFreeSvg, alt: 'Free arrow', tool: 'free-arrow' },
    { src: ArrowStraightDashedSvg, alt: 'Dashed straight arrow', tool: 'straight-arrow-dashed' },
    { src: ArrowFreeDashedSvg, alt: 'Dashed free arrow', tool: 'free-arrow-dashed' },
    { src: BallSvg, alt: 'Ball', tool: 'ball' },
    { src: EraserSvg, alt: 'Eraser', tool: 'eraser' },
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
};

export default ToolBar;
