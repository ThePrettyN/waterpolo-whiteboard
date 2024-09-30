class BoardObject {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.initialPosition = { x, y };
  }

  // Method to draw on the canvas - should be overridden by subclasses
  draw(context) {}

  // Method to check if an object was clicked on
  handleMouseDown(offsetX, offsetY) {
    const hitRange = window.innerWidth <= 640 ? 32 : 20;
    const isClicked = Math.hypot(this.x - offsetX, this.y - offsetY) < hitRange;
    if (isClicked) {
      this.isDragging = true;
      this.offset = { x: offsetX - this.x, y: offsetY - this.y };
    }

    return isClicked;
  }

  // Method to move the object when dragging
  handleMouseMove(offsetX, offsetY) {
    if (this.isDragging) {
      this.x = offsetX - this.offset.x;
      this.y = offsetY - this.offset.y;
    }
  }

  // Stop dragging
  handleMouseUp() {
    this.isDragging = false;
  }

  // Reset to initial position
  resetPosition() {
    this.x = this.initialPosition.x;
    this.y = this.initialPosition.y;
  }
}

export default BoardObject;
