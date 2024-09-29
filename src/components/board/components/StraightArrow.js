class StraightArrow {
  constructor(startX, startY, isDashed = false) {
    this.id = new Date().getTime();
    this.startX = startX;
    this.startY = startY;
    this.endX = startX;
    this.endY = startY;
    this.isDashed = isDashed;
  }

  addPoint(x, y) {
    // Update the end point
    this.endX = x;
    this.endY = y;
  }

  draw(context) {
    if (this.isDashed) {
      context.setLineDash([10, 5]);
    } else {
      context.setLineDash([]);
    }

    const distance = Math.hypot(this.startX - this.endX, this.startY - this.endY);
    if (distance < 10) {
      return;
    }
    // Draw the main line
    context.beginPath();
    context.moveTo(this.startX, this.startY);
    context.lineTo(this.endX, this.endY);
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();

    // Draw the arrowhead wings
    context.setLineDash([]);
    this.drawArrowhead(context, this.startX, this.startY, this.endX, this.endY);
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

export default StraightArrow;
