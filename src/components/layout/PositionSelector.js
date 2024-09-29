import React, { useContext } from 'react';
import { PositionContext } from '../../context/PositionContext';
import { BoardContext } from '../../context/BoardContext';

const PositionSelector = () => {
  const { updatePositions } = useContext(PositionContext);
  const { resetPositions } = useContext(BoardContext);

  const positionSet = [
    { label: 'Clear' },
    { label: '6-on-6' },
    { label: '6-on-5' },
    { label: 'Sidelines' },
    { label: 'Counterattack' },
  ];

  const handlePositionChange = (position) => {
    if (position === 'Clear') {
      resetPositions();
    } else {
      updatePositions(position); // Call function from PositionContext to update the positions
    }
  };

  return (
    <div className="position-selector flex justify-center gap-1">
      {positionSet.map((pos, index) => (
        <button
          key={index}
          onClick={() => handlePositionChange(pos.label)}
          className="px-2 py-1 bg-yellow-400 text-sm rounded hover:bg-yellow-500"
        >
          {pos.label}
        </button>
      ))}
    </div>
  );
};

export default PositionSelector;
