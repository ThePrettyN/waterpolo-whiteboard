import React, { useRef, useContext, useState, useEffect } from 'react';
import { BoardContext } from '../../context/BoardContext';
import { formatDescription, renderInterpolatedFrame } from '../board/utils/generateGIF';
import ConfirmDialog from './ConfirmDialog';
import GIF from 'gif.js';
import HalfCourt from '../../assets/half-court.svg';
import FullCourt from '../../assets/full-court.svg';

const RightPanel = () => {
  const { steps, setSteps, saveStep, resetPositions, setCurrentTool } = useContext(BoardContext);
  const { bgMode } = useContext(BoardContext);
  const canvasRef = useRef();
  const [boardImage, setBoardImage] = useState();
  const [previewImageSrc, setPreviewImageSrc] = useState();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gifBlob, setGifBlob] = useState(null);
  const [invalidTitle, setInvalidTitle] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const img = new Image();
    const bgImages = [ HalfCourt, FullCourt ];
    img.src = bgImages[bgMode];
    img.onload = () => {
      setBoardImage(img);
      setPreviewImageSrc(img.src);
    };
  }, [bgMode]);

  const generatePreview = () => {
    if (!title.trim()) {
      setInvalidTitle(true);
      return;
    }
    setInvalidTitle(false);
    setLoading(true);
    setGifBlob(null);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const maxWidth = 800;
    const lineHeight = 24;
    context.font = '18px Arial';

    const lines = formatDescription(description, context, maxWidth);
    const descriptionHeight = lines.length * lineHeight;

    canvas.height = 600 + descriptionHeight;

    const gif = new GIF({
      workers: 2,
      quality: 30,
      // workerScript: 'https://waterpoloauthority.com/wp-content/uploads/2023/10/raw.githubusercontent.com_jnordberg_gif.js_master_dist_gif.worker.js', // for production
      workerScript: '/gif.worker.js',  // for development
      width: canvas.width,
      height: canvas.height,
    });

    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      const prevStep = i === 0 ? null : steps[i - 1];

      if (i > 0) {
        for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
          const t = (frameIndex + 1) / 10;
  
          renderInterpolatedFrame(context, prevStep, currentStep, t, boardImage, title, lines);
          gif.addFrame(canvas, { copy: true, delay: 50 });
        }
      }

      renderInterpolatedFrame(context, prevStep, currentStep, 1, boardImage, title, lines);
      gif.addFrame(canvas, { copy: true, delay: 1000 });
    }

    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob);
      setPreviewImageSrc(url);
      setGifBlob(blob);
      setLoading(false);
    });

    gif.render();
  };

  const startOver = () => {
    handleOpenStartOverDialog();
  };

  const handleOpenStartOverDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmAction = () => {
    setGifBlob(null);
    setSteps([]);
    const bgImages = [ HalfCourt, FullCourt ];
    setPreviewImageSrc(bgImages[bgMode]);
    resetPositions();
    setCurrentTool(null);

    handleCloseConfirmDialog(); // Close dialog after confirming
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="title" className={`block text-sm font-bold mb-2 ${!invalidTitle ? 'text-gray-700' : 'text-red-500'}`}>
          Title {invalidTitle && '*'}
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className={`w-full p-2 border rounded ${!invalidTitle ? 'border-gray-300' : 'border-red-500'}`}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-bold mb-2 text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Type a description..."
          rows="4"
          className="w-full p-2 border rounded resize-none border-gray-300"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={saveStep}
          className="hidden lg:flex flex-1 items-center justify-center px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 w-full"
        >
          + Add Step
        </button>
        <button onClick={generatePreview}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
          Generate Preview
        </button>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">Preview</div>
        <div className="w-full bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center space-x-2 my-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
              <span className="text-gray-600">Generating preview...</span>
            </div>
          ) : (
            <img id="preview-img" src={previewImageSrc} alt="Preview" className="w-1/2 h-auto" />
          )}
        </div>
      </div>

      {/* Start Over Button */}
      <div className='grid grid-flow-col gap-2'>
        <button
          onClick={startOver}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">
          Start Over
        </button>
        {gifBlob && (
          <a
            href={URL.createObjectURL(gifBlob)}
            download={`${title.trim() || 'preview'}.gif`}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            Download GIF
          </a>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} width={1000} height={600} />

      <ConfirmDialog
        open={dialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmAction}
        title="Start Over?"
        message="Are you sure you want to start over?"
      />
    </div>
  );
};

export default RightPanel;
