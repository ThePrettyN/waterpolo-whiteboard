import BoardObject from './BoardObject';

class Player extends BoardObject {
  constructor(id, x, y, team, label) {
    super(id, x, y);
    this.team = team;
    this.label = label;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    context.fillStyle = this.team === 'A' ? '#406ab8' : '#a5395f';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
    context.fillStyle = 'white';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.label, this.x, this.y + 1);
  }
}

export default Player;
