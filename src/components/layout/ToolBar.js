import React, { useContext } from 'react';
import { BoardContext } from '../../context/BoardContext';
import ArrowStraightSvg from '../../assets/icons/arrow_straight.svg';
import ArrowFreeSvg from '../../assets/icons/arrow_free.svg';
import ArrowStraightDashedSvg from '../../assets/icons/arrow_straight_dash.svg';
import ArrowFreeDashedSvg from '../../assets/icons/arrow_free_dash.svg';
import BallSvg from '../../assets/icons/ball_icon.svg';
import EraserSvg from '../../assets/icons/eraser.svg';
import { Tooltip, Select, InputLabel, FormControl, MenuItem } from '@mui/material';

const ToolBar = () => {
  const { currentTool, setCurrentTool, bgMode, setBgMode, resetPositions } = useContext(BoardContext);

  const icons = [
    { src: ArrowStraightSvg, alt: 'Player Movement', tool: 'straight-arrow' },
    { src: ArrowFreeSvg, alt: 'Player Movement', tool: 'free-arrow' },
    { src: ArrowStraightDashedSvg, alt: 'Pass/Shot', tool: 'straight-arrow-dashed' },
    { src: ArrowFreeDashedSvg, alt: 'Pass/Shot', tool: 'free-arrow-dashed' },
    { src: BallSvg, alt: 'Add Balls', tool: 'ball' },
    { src: EraserSvg, alt: 'Eraser', tool: 'eraser' },
  ];

  const handleIconClick = (tool) => {
    setCurrentTool(currentTool === tool ? null : tool);
  };

  const handleBgChange = (event) => {
    setBgMode(event.target.value);
    resetPositions(event.target.value);
  };

  return (
    <div className="toolbar-container flex justify-center gap-2">
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Court</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={bgMode}
          label="Court"
          onChange={handleBgChange}
        >
          <MenuItem value={0}>Half-Court</MenuItem>
          <MenuItem value={1}>Full-Court</MenuItem>
        </Select>
      </FormControl>

      {icons.map((icon, index) => (
        <Tooltip title={icon.alt} key={index} placement="top">
          <button
            onClick={() => handleIconClick(icon.tool)}
            className={`px-2 py-1 border ${currentTool === icon.tool ? 'bg-yellow-400' : ''} text-sm rounded hover:bg-yellow-500`}
          >
            <img src={icon.src} alt={icon.alt} className="w-6 h-6" />
          </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ToolBar;
