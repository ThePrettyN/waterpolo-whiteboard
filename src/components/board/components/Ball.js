import BoardObject from './BoardObject';
import BallSvg from '../../../assets/ball.svg';

class Ball extends BoardObject {
  constructor(id, x, y) {
    super(id, x, y);
    this.image = new Image();
    this.image.src = BallSvg;
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
