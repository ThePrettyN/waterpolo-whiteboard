import { useContext, useCallback } from 'react';
import { BoardContext } from '../context/BoardContext';

// Hook for managing board actions
const useBoard = () => {
  const { objects, setObjects } = useContext(BoardContext);

  // Function to reset the objects to their initial positions
  const resetBoard = useCallback(() => {
    setObjects((prevObjects) => prevObjects.map((obj) => obj.resetPosition()));
  }, [setObjects]);

  return { objects, resetBoard };
};

export default useBoard;
