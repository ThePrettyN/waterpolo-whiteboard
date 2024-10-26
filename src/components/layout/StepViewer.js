import React, { useContext, useEffect, useRef, useState } from "react";
import { BoardContext } from "../../context/BoardContext";
import HalfCourt from '../../assets/half-court.svg';
import FullCourt from '../../assets/full-court.svg';

const StepViewer = () => {
  const { steps, setSteps } = useContext(BoardContext);
  const { bgMode } = useContext(BoardContext);
  const [thumbnails, setThumbnails] = useState([]);
  const canvasRef = useRef();
  const [boardImage, setBoardImage] = useState();

  useEffect(() => {
    const img = new Image();
    const bgImages = [ HalfCourt, FullCourt ];
    img.src = bgImages[bgMode];
    img.onload = () => setBoardImage(img);
  }, [bgMode]);

  useEffect(() => {
    // Generate thumbnails for each step when the component mounts or steps change
    const generateThumbnails = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const tempThumbnails = steps.map((step) => {
        renderBoard(context, step.objects, step.shapes, boardImage);

        return canvas.toDataURL();
      });

      setThumbnails(tempThumbnails);
    };

    generateThumbnails();
  }, [steps, boardImage]);

  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, stepIndex) => stepIndex !== index);
    setSteps(updatedSteps);
  };

  return (
    <div className="flex h-36 overflow-x-scroll gap-4 p-2 border">
      {thumbnails.map((thumbnail, index) => (
        <div key={index} className="relative flex-shrink-0">
          {/* Render the thumbnail as an image */}
          <img
            src={thumbnail}
            alt={`Step ${index + 1}`}
            className="w-48 h-28 object-cover border border-gray-300 rounded-md"
          />

          <button
            onClick={() => removeStep(index)}
            className="absolute top-0 right-0 rounded-md bg-red-500 text-white px-1 hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      ))}
      {thumbnails.length === 0 && <p className="text-gray-500">Steps will be added here...</p>}
      <canvas ref={canvasRef} style={{ display: 'none' }} width={1000} height={600} />
    </div>
  );
};

// Helper function to render the board content to canvas
const renderBoard = (context, objects, shapes, boardImage) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  if (boardImage) {
    context.drawImage(boardImage, 100, 50, 800, 500);
  }

  // Draw each object (e.g., players, ball)
  objects.forEach((obj) => {
    obj.draw(context);
  });

  // Draw each shape (e.g., arrows)
  shapes.forEach((shape) => {
    shape.draw(context);
  });
};

export default StepViewer;
