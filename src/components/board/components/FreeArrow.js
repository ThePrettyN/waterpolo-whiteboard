class FreeArrow {
  constructor(startX, startY, isDashed = false) {
    this.points = [{ x: startX, y: startY }];
    this.threshold = 10; // Adjust this value for more or less smoothing
    this.isDashed = isDashed;
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
    if (this.points.length < 2) return;

    if (this.isDashed) {
      context.setLineDash([10, 5]);
    } else {
      context.setLineDash([]);
    }

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

    const secondLastPoint = this.points[this.points.length - 2];

    context.setLineDash([]);
    this.drawArrowhead(context, secondLastPoint.x, secondLastPoint.y, lastPoint.x, lastPoint.y);
  }

  drawArrowhead(context, startX, startY, endX, endY) {
    const arrowLength = 10; // Length of the arrow wings
    const angle = Math.atan2(endY - startY, endX - startX);

    // Calculate the angles for the arrow wings
    const wingAngle1 = angle - Math.PI / 4; // Angle for the upper wing
    const wingAngle2 = angle + Math.PI / 4; // Angle for the lower wing

    // Calculate the end points of the wings
    const arrowWing1X = endX - arrowLength * Math.cos(wingAngle1);
    const arrowWing1Y = endY - arrowLength * Math.sin(wingAngle1);
    const arrowWing2X = endX - arrowLength * Math.cos(wingAngle2);
    const arrowWing2Y = endY - arrowLength * Math.sin(wingAngle2);

    // Draw the wings
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(arrowWing1X, arrowWing1Y);
    context.moveTo(endX, endY);
    context.lineTo(arrowWing2X, arrowWing2Y);
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.stroke();
  }
}

export default FreeArrow;
