import StraightArrow from "../components/StraightArrow";
import FreeArrow from "../components/FreeArrow";

export const formatDescription = (text, context, maxWidth) => {
  const paragraphs = text.split('\n');
  const lines = [];

  paragraphs.forEach((paragraph) => {
    let line = '';
    const words = paragraph.split(' ');

    words.forEach((word) => {
      const testLine = line + word + ' ';
      const testWidth = context.measureText(testLine).width;

      if (testWidth > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    lines.push(line.trim());
  });

  return lines;
};

export const renderInterpolatedFrame = (context, step1, step2, t, boardImage, title, lines) => {
  // Clear canvas
  context.fillStyle = 'white';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  // Draw board image
  if (boardImage) {
    context.drawImage(boardImage, 100, 50, 800, 500);
  }

  // Draw the title
  context.fillStyle = 'black';
  context.font = 'bold 24px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(title, context.canvas.width / 2, 25);

  // Draw the description lines
  context.font = '18px Arial';
  context.textAlign = 'left';
  const startY = 590; // Initial position for description text
  lines.forEach((line, index) => {
    context.fillText(line, 150, startY + index * 24);
  });

  // First Step Case
  if (!step1) {
    step2.objects.forEach(obj => obj.draw(context));
    step2.shapes.forEach(shape => shape.draw(context));
    return;
  }

  // Interpolate positions of objects (unchanged)
  step2.objects.forEach((obj) => {
    if (step1.objects.findIndex(item => item.id === obj.id) !== -1) {
      const startObj = step1.objects.find(item => item.id === obj.id);
      const endObj = obj;

      const interpolatedX = startObj.x + t * (endObj.x - startObj.x);
      const interpolatedY = startObj.y + t * (endObj.y - startObj.y);

      const interpolatedObj = Object.create(Object.getPrototypeOf(startObj), {
        ...Object.getOwnPropertyDescriptors(startObj),
        x: { value: interpolatedX, writable: true, configurable: true },
        y: { value: interpolatedY, writable: true, configurable: true },
      });

      interpolatedObj.draw(context);
    } else {
      obj.draw(context);
    }
  });

  step1.shapes.forEach((shape1) => {
    const matchingShape = step2.shapes.find((shape2) => shape2.id === shape1.id);
    if (matchingShape) {
      shape1.draw(context);
    }
  });

  const newShapes = step2.shapes.filter(
    (shape2) => !step1.shapes.some((shape1) => shape1.id === shape2.id)
  );
  newShapes.forEach((shape) => {
    if (shape instanceof StraightArrow) {
      const interpolatedX = shape.startX + (shape.endX - shape.startX) * t;
      const interpolatedY = shape.startY + (shape.endY - shape.startY) * t;

      const interpolatedShape = Object.create(Object.getPrototypeOf(shape), {
        ...Object.getOwnPropertyDescriptors(shape),
        endX: { value: interpolatedX, writable: true, configurable: true },
        endY: { value: interpolatedY, writable: true, configurable: true },
      });

      interpolatedShape.draw(context);
    } else if (shape instanceof FreeArrow) {
      const totalPoints = shape.points.length;
      const pointsToDraw = Math.ceil(t * totalPoints);

      const interpolatedShape = Object.create(Object.getPrototypeOf(shape), {
        ...Object.getOwnPropertyDescriptors(shape),
        points: { value: shape.points.slice(0, pointsToDraw), writable: true, configurable: true },
      });

      interpolatedShape.draw(context);
    }
  });
};
