import BoardObject from './BoardObject';

class Ball extends BoardObject {
  constructor(id, x, y) {
    super(id, x, y);
    this.image = new Image();
    this.image.src = '/assets/ball.svg';
  }

  draw(context) {
    if (this.image.complete) {
      context.drawImage(this.image, this.x - 20, this.y - 20, 40, 40);
    } else {
      this.image.onload = () => {
        context.drawImage(this.image, this.x - 20, this.y - 20, 40, 40);
      };
    }
  }
}

export default Ball;
