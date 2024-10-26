class Pen {
  constructor(startX, startY) {
    this.id = new Date().getTime();
    this.points = [{ x: startX, y: startY }];
    this.threshold = 12; // Adjust this value for more or less smoothing
  }

  addPoint(x, y) {
    const lastPoint = this.points[this.points.length - 1];
    const distance = Math.hypot(x - lastPoint.x, y - lastPoint.y);

    // Only add a new point if the distance exceeds the threshold
    if (distance > this.threshold) {
      this.points.push({ x, y });
    }
  }

  draw(context) {
    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);

    // Use quadratic curves to draw smooth lines
    for (let i = 1; i < this.points.length - 1; i++) {
      const currentPoint = this.points[i];
      const nextPoint = this.points[i + 1];

      // Calculate control point
      const controlPointX = (currentPoint.x + nextPoint.x) / 2;
      const controlPointY = (currentPoint.y + nextPoint.y) / 2;

      context.quadraticCurveTo(currentPoint.x, currentPoint.y, controlPointX, controlPointY);
    }

    // Draw the last segment as a straight line to the final point
    const lastPoint = this.points[this.points.length - 1];
    context.lineTo(lastPoint.x, lastPoint.y);

    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();
  }
}

export default Pen;
