import StraightArrow from '../components/StraightArrow'
import FreeArrow from '../components/FreeArrow'

export const drawBoard = (context, image, objects, draggedObject, shapes, tempShape) => {
  // Clear the canvas
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  // Draw the playground background
  context.drawImage(image, 100, 50, 800, 500);

  // Draw all objects except the one being dragged
  shapes.forEach((shape) => {
    shape.draw(context);
  });

  objects.forEach((obj) => {
    if (obj !== draggedObject) {
      obj.draw(context);
    }
  });

  // Draw the dragged object last for z-index behavior
  if (draggedObject) {
    draggedObject.draw(context);
  }

  if (tempShape) {
    tempShape.draw(context);
  }
};

export const getMousePosition = (event, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Check if the event is a touch event or mouse event
  let clientX, clientY;

  if (event.touches && event.touches.length > 0) {
    // Touch event
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    // Mouse event
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Calculate offset position based on the canvas scale
  const offsetX = (clientX - rect.left) * scaleX;
  const offsetY = (clientY - rect.top) * scaleY;

  return { offsetX, offsetY };
};

export const isOutsidePlayground = (x, y) => {
  const playgroundBounds = { x: 150, y: 50, width: 700, height: 500 };

  return (
    x < playgroundBounds.x ||
    x > playgroundBounds.x + playgroundBounds.width ||
    y < playgroundBounds.y ||
    y > playgroundBounds.y + playgroundBounds.height
  );
};

export const isEraserOverShape = (eraserX, eraserY, shape) => {
  // Define the tolerance for erasing (adjust as needed)
  const hitRange = window.innerWidth <= 640 ? 32 : 20;
  const eraserRadius = hitRange;

  // Check overlap with straight arrows
  if (shape instanceof StraightArrow) {
    // Check if the eraser is close to any part of the line
    const distanceToLine = Math.abs(
      (shape.endY - shape.startY) * eraserX - (shape.endX - shape.startX) * eraserY + shape.endX * shape.startY - shape.endY * shape.startX
    ) / Math.hypot(shape.endY - shape.startY, shape.endX - shape.startX);

    return distanceToLine <= eraserRadius;
  }

  // Check overlap with free arrows
  if (shape instanceof FreeArrow) {
    return shape.points.some(point => {
      const distance = Math.hypot(point.x - eraserX, point.y - eraserY);
      return distance <= eraserRadius;
    });
  }

  return false;
};
