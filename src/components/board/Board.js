import React, { useRef, useState, useEffect, useContext } from 'react';
import { BoardContext } from '../../context/BoardContext';
import { drawBoard, getMousePosition, isOutsidePlayground, isEraserOverShape } from './utils/boardUtils';
import StraightArrow from './components/StraightArrow';
import FreeArrow from './components/FreeArrow';
import Pen from './components/Pen';
import Ball from './components/Ball';
import Player from './components/Player';
import HalfCourt from '../../assets/half-court.svg';
import FullCourt from '../../assets/full-court.svg';

const Board = () => {
  const canvasRef = useRef();
  const { currentTool, setCurrentTool } = useContext(BoardContext);
  const { objects, setObjects } = useContext(BoardContext);
  const { shapes, setShapes } = useContext(BoardContext);
  const { saveStep } = useContext(BoardContext);
  const { bgMode } = useContext(BoardContext);
  const [draggedObject, setDraggedObject] = useState(null);
  const [boardImgLoaded, setBoardImgLoaded] = useState(false);
  const [tempShape, setTempShape] = useState(null);
  const boardImg = useRef(new Image());

  useEffect(() => {
    setBoardImgLoaded(false);
    const bgImages = [ HalfCourt, FullCourt ];
    boardImg.current.src = bgImages[bgMode];
    boardImg.current.onload = () => {
      setBoardImgLoaded(true);
    };
  }, [bgMode]);

  useEffect(() => {
    if (!boardImgLoaded) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawBoard(context, boardImg.current, objects, draggedObject, shapes, tempShape);
  }, [objects, draggedObject, shapes, tempShape, boardImgLoaded]);

  const handleTouchStart = (event) => {
    handleMouseDown(event);
  };

  const handleTouchMove = (event) => {
    handleMouseMove(event);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = getMousePosition(event, canvasRef.current);

    if (isOutsidePlayground(offsetX, offsetY)) {
      setCurrentTool(null);
    }

    let objectClicked = false;
    for (let obj of objects) {
      const clicked = obj.handleMouseDown(offsetX, offsetY);
      if (clicked) {
        if (obj instanceof Player || currentTool !== 'eraser') {
          setDraggedObject(obj);
          objectClicked = true;
          setCurrentTool(null);
          break;
        }
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
      } else if (currentTool === 'pen') {
        const newArrow = new Pen(offsetX, offsetY, true);
        setTempShape(newArrow);
      } else if (currentTool === 'ball') {
        let newBallId = objects[objects.length - 1].id + 1;
        if (newBallId < 101) newBallId = 101;
        const newBall = new Ball(newBallId, offsetX, offsetY);
        setObjects([...objects, newBall]);
      } else if (currentTool === 'eraser') {
        const filteredObjects = objects.filter(obj => !isEraserOverShape(offsetX, offsetY, obj));
        const filteredShapes = shapes.filter(shape => !isEraserOverShape(offsetX, offsetY, shape));
        setObjects(filteredObjects);
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

    if (currentTool === 'eraser') {
      for (let shape of shapes) {
        if (isEraserOverShape(offsetX, offsetY, shape)) {
          cursorOverShape = true;
          break;
        }
      }
    }
    for (let obj of objects) {
      const hitRange = window.innerWidth <= 640 ? 32 : 20;
      const distance = Math.hypot(obj.x - offsetX, obj.y - offsetY);
      if (distance <= hitRange) {
        cursorOverShape = true;
        break;
      }
    }
    const cursor = currentTool === 'eraser' ? 'pointer' : 'move';
    canvasRef.current.style.cursor = cursorOverShape || draggedObject ? cursor : 'default';

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
    <>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          style={{ border: '2px solid black', width: '100%', height: 'auto', touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div className="absolute bottom-0 right-0 m-2 sm:m-4 lg:hidden">
          <button onClick={saveStep} className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 sm:w-12 sm:h-12">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Board;
