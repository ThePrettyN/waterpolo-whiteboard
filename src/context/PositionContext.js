import React, { createContext, useContext } from 'react';
import { BoardContext } from './BoardContext';

// Create the context
export const PositionContext = createContext();

// Create a provider component
export const PositionProvider = ({ children }) => {
  const { setObjects } = useContext(BoardContext);

  const positionPresets = {
    '6-on-6': [
      { id: 1, x: 225, y: 215 }, { id: 2, x: 350, y: 415 },
      { id: 3, x: 500, y: 430 }, { id: 4, x: 650, y: 415 },
      { id: 5, x: 775, y: 215 }, { id: 6, x: 500, y: 215 },
      // { id: 7, x: 50, y: 350 }, // Team A goalkeeper
      { id: 8, x: 300, y: 215 }, { id: 9, x: 375, y: 330 },
      { id: 10, x: 500, y: 355 }, { id: 11, x: 625, y: 330 },
      { id: 12, x: 700, y: 215 }, { id: 13, x: 560, y: 170 },
      { id: 14, x: 500, y: 100 }, // Team B goalkeeper
      { id: 101, x: 540, y: 445 }, // Ball
    ],
    '6-on-5': [
      { id: 1, x: 225, y: 215 }, { id: 2, x: 350, y: 215 },
      { id: 3, x: 650, y: 215 }, { id: 4, x: 350, y: 415 },
      { id: 5, x: 650, y: 415 }, { id: 6, x: 775, y: 215 },
      // { id: 7, x: 50, y: 350 }, // Team A goalkeeper
      { id: 8, x: 310, y: 190 }, { id: 9, x: 500, y: 215 },
      { id: 10, x: 690, y: 190 }, { id: 11, x: 400, y: 340 },
      { id: 12, x: 600, y: 340 }, { id: 13, x: 950, y: 400 },
      { id: 14, x: 500, y: 100 }, // Team B goalkeeper
      { id: 101, x: 390, y: 400 }, // Ball
    ],
    'Sidelines': [
      { id: 1, x: 750, y: 325 }, { id: 2, x: 750, y: 355 },
      { id: 3, x: 750, y: 385 }, { id: 4, x: 750, y: 415 },
      { id: 5, x: 750, y: 445 }, { id: 6, x: 750, y: 475 },
      // { id: 7, x: 50, y: 350 }, // Team A goalkeeper
      { id: 8, x: 825, y: 325 }, { id: 9, x: 825, y: 355 },
      { id: 10, x: 825, y: 385 }, { id: 11, x: 825, y: 415 },
      { id: 12, x: 825, y: 445 }, { id: 13, x: 825, y: 475 },
      { id: 14, x: 825, y: 505 }, // Team B goalkeeper
      { id: 101, x: 750, y: 505 }, // Ball
    ],
    'Counterattack': [
      { id: 1, x: 200, y: 520 }, { id: 2, x: 350, y: 520 },
      { id: 3, x: 500, y: 520 }, { id: 4, x: 650, y: 520 },
      { id: 5, x: 800, y: 520 }, { id: 6, x: 500, y: 425 },
      // { id: 7, x: 50, y: 350 }, // Team A goalkeeper
      { id: 8, x: 225, y: 275 }, { id: 9, x: 350, y: 275 },
      { id: 10, x: 500, y: 275 }, { id: 11, x: 650, y: 275 },
      { id: 12, x: 800, y: 275 }, { id: 13, x: 500, y: 225 },
      { id: 14, x: 500, y: 100 }, // Team B goalkeeper
      { id: 101, x: 225, y: 475 }, // Ball
    ],
  };

  const updatePositions = (presetKey) => {
    const newPositions = positionPresets[presetKey];
    if (!newPositions) return;

    setObjects((prevObjects) =>
      prevObjects.map((obj) => {
        const newPosition = newPositions.find((pos) => pos.id === obj.id);
        if (newPosition) {
          obj.x = newPosition.x;
          obj.y = newPosition.y;
        }
        return obj;
      })
    );
  };

  return (
    <PositionContext.Provider value={{ updatePositions, positionPresets }}>
      {children}
    </PositionContext.Provider>
  );
};

// Custom hook for accessing position context
export const usePosition = () => useContext(PositionContext);
