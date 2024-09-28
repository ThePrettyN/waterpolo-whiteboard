import React, { createContext, useState, useRef } from 'react';
import Player from '../components/board/components/Player';
import Ball from '../components/board/components/Ball';

// Create the context
export const BoardContext = createContext();

// Create a provider component
export const BoardProvider = ({ children }) => {
  // Define initial positions for all objects
  const initialPositions = [
    { id: 1, x: 50, y: 150, type: 'Player', team: 'A', label: 1 },
    { id: 2, x: 50, y: 200, type: 'Player', team: 'A', label: 2 },
    { id: 3, x: 50, y: 250, type: 'Player', team: 'A', label: 3 },
    { id: 4, x: 50, y: 300, type: 'Player', team: 'A', label: 4 },
    { id: 5, x: 50, y: 350, type: 'Player', team: 'A', label: 5 },
    { id: 6, x: 50, y: 400, type: 'Player', team: 'A', label: 6 },
    // { id: 7, x: 50, y: 350, type: 'Player', team: 'A', label: 'G' },
    { id: 8, x: 950, y: 150, type: 'Player', team: 'B', label: 1 },
    { id: 9, x: 950, y: 200, type: 'Player', team: 'B', label: 2 },
    { id: 10, x: 950, y: 250, type: 'Player', team: 'B', label: 3 },
    { id: 11, x: 950, y: 300, type: 'Player', team: 'B', label: 4 },
    { id: 12, x: 950, y: 350, type: 'Player', team: 'B', label: 5 },
    { id: 13, x: 950, y: 400, type: 'Player', team: 'B', label: 6 },
    { id: 14, x: 950, y: 450, type: 'Player', team: 'B', label: 'G' },
    { id: 101, x: 50, y: 450, type: 'Ball' },
  ];

  // Initialize the state for `objects` based on initial positions
  const [objects, setObjects] = useState(
    initialPositions.map((position) => {
      if (position.type === 'Player') {
        return new Player(position.id, position.x, position.y, position.team, position.label);
      } else if (position.type === 'Ball') {
        return new Ball(position.id, position.x, position.y);
      }
      return null;
    })
  );

  const [shapes, setShapes] = useState([]);

  // Store initial positions as a reference for resets
  const initialPositionsRef = useRef(initialPositions);

  // Function to reset objects to their initial positions
  const resetPositions = () => {
    setShapes([]);
    setObjects(
      initialPositionsRef.current.map((pos) => {
        if (pos.type === 'Player') {
          return new Player(pos.id, pos.x, pos.y, pos.team, pos.label);
        } else if (pos.type === 'Ball') {
          return new Ball(pos.id, pos.x, pos.y);
        }
        return null;
      })
    );
  };

  const [currentTool, setCurrentTool] = useState(null);

  // Store board steps as an array of snapshots
  const [steps, setSteps] = useState([]);
  const saveStep = () => {
    const currentStep = {
      objects: [...objects],
      shapes: [...shapes]
    };
    setSteps([...steps, currentStep]);
  };

  return (
    <BoardContext.Provider value={{ objects, setObjects, currentTool, setCurrentTool, resetPositions, shapes, setShapes, steps, saveStep }}>
      {children}
    </BoardContext.Provider>
  );
};
