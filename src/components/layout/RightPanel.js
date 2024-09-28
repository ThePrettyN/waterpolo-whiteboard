import React, { useRef, useContext } from 'react';
import { BoardContext } from '../../context/BoardContext';
import GIF from 'gif.js.optimized';

const RightPanel = () => {
  const { steps, saveStep } = useContext(BoardContext);
  const canvasRef = useRef();

  const generatePreview = () => {
    // Create the off-screen canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Create a new GIF instance
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
    });

    // Loop through steps and add each step as a frame to the GIF
    steps.forEach((step) => {
      renderBoard(context, step.objects, step.shapes);
      gif.addFrame(context);
    });

    // Once the GIF is ready, set the URL to the preview image
    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob);
      const previewImage = document.getElementById('preview-img');
      previewImage.src = url;
    });

    // Render the GIF
    gif.render();
  };

  return (
    // <></>
    <div className="p-4">
      {/* Title Input */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter title..."
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Type a description..."
          rows="4"
          className="w-full p-2 border border-gray-300 rounded resize-none"
        />
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={saveStep}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 w-full"
        >
          + Add Step
        </button>
        <button onClick={generatePreview}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
          Generate Preview
        </button>
      </div>

      {/* Preview Section */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">Preview</div>
        <div className="w-full h-32 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
          <img id="preview-img" alt="Preview" className="w-full h-auto" />
        </div>
      </div>

      {/* Start Over Button */}
      <div>
        <button className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">
          Start Over
        </button>
      </div>
      {/* <canvas ref={canvasRef} style={{ display: 'none' }} width={1000} height={600} /> */}
      <canvas ref={canvasRef} width={1000} height={600} />
    </div>
  );
};

// Helper function to render a step on the canvas
const renderBoard = (context, objects, shapes) => {
  objects.forEach((obj) => {
    obj.draw(context); // Assuming `draw()` exists on each object
  });

  shapes.forEach((shape) => {
    shape.draw(context); // Assuming `draw()` exists on each shape
  });
};

export default RightPanel;
