import React, { useRef, useState, useEffect, useContext } from 'react';
import { BoardContext } from '../../context/BoardContext';
import { drawBoard, getMousePosition, isOutsidePlayground, isEraserOverShape } from './utils/boardUtils';
import StraightArrow from './components/StraightArrow';
import FreeArrow from './components/FreeArrow';

const Board = () => {
  const canvasRef = useRef();
  const { currentTool, setCurrentTool } = useContext(BoardContext);
  const { objects, setObjects } = useContext(BoardContext);
  const { shapes, setShapes } = useContext(BoardContext);
  const [draggedObject, setDraggedObject] = useState(null);
  const [boardImgLoaded, setBoardImgLoaded] = useState(false);
  const [tempShape, setTempShape] = useState(null);
  const boardImg = useRef(new Image());

  useEffect(() => {
    boardImg.current.src = '/assets/ground.svg';
    boardImg.current.onload = () => {
      setBoardImgLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!boardImgLoaded) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawBoard(context, boardImg.current, objects, draggedObject, shapes, tempShape);
  }, [objects, draggedObject, shapes, tempShape, boardImgLoaded]);

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = getMousePosition(event, canvasRef.current);

    if (isOutsidePlayground(offsetX, offsetY)) {
      setCurrentTool(null);
    }

    let objectClicked = false;
    for (let obj of objects) {
      const clicked = obj.handleMouseDown(offsetX, offsetY);
      if (clicked) {
        setDraggedObject(obj);
        objectClicked = true;
        setCurrentTool(null);
        break;
      }
    }

    if (!objectClicked && !isOutsidePlayground(offsetX, offsetY)) {
      if (currentTool === 'straight-arrow') {
        const newArrow = new StraightArrow(offsetX, offsetY);
        setTempShape(newArrow);
      } else if (currentTool === 'free-arrow') {
        const newArrow = new FreeArrow(offsetX, offsetY);
        setTempShape(newArrow);
      } else if (currentTool === 'straight-arrow-dashed') {
        const newArrow = new StraightArrow(offsetX, offsetY, true);
        setTempShape(newArrow);
      } else if (currentTool === 'free-arrow-dashed') {
        const newArrow = new FreeArrow(offsetX, offsetY, true);
        setTempShape(newArrow);
      } else if (currentTool === 'eraser') {
        const filteredShapes = shapes.filter(shape => !isEraserOverShape(offsetX, offsetY, shape));
        setShapes(filteredShapes);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        drawBoard(context, boardImg.current, objects, draggedObject, filteredShapes, tempShape);
      }
    }
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = getMousePosition(event, canvasRef.current);

    let cursorOverShape = false;

    for (let shape of shapes) {
      if (isEraserOverShape(offsetX, offsetY, shape)) {
        cursorOverShape = true;
        break;
      }
    }
    for (let obj of objects) {
      const distance = Math.hypot(obj.x - offsetX, obj.y - offsetY);
      if (distance <= 20) {
        cursorOverShape = true;
        break;
      }
    }
    canvasRef.current.style.cursor = cursorOverShape || draggedObject ? 'pointer' : 'default';

    // Handle drawing
    if (tempShape && !isOutsidePlayground(offsetX, offsetY)) {
      tempShape.addPoint(offsetX, offsetY);
      setTempShape(tempShape);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      drawBoard(context, boardImg.current, objects, draggedObject, shapes, tempShape);

      return;
    }

    // Handle dragging objects
    if (draggedObject) {
      draggedObject.handleMouseMove(offsetX, offsetY);
      setObjects([...objects]);
    }
  };

  const handleMouseUp = () => {
    if (tempShape) {
      // Finalize the arrow drawing
      setShapes([...shapes, tempShape]);
      setTempShape(null);
    } else if (draggedObject) {
      // Handle dragging object
      if (isOutsidePlayground(draggedObject.x, draggedObject.y)) {
        draggedObject.resetPosition();
      }
      setDraggedObject(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={600}
      style={{ border: '2px solid black', width: '100%', height: 'auto' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Board;
