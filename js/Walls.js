import {BoardElement} from "./BoardElement.js";
import {EventBus} from "./EventBus.js";

export class Walls extends BoardElement{

  walls;
  constructor({ctx, boardSize, step, border, color = 'brown'}) {
    super({ctx, boardSize, border, step, color});

    if(this._border) {
      this.walls = this.generateWallsCoordinates(this._boardSize, this._step, this._border)
      EventBus.publish('new-obstacle-coordinates',
        {name: 'border', list: this.walls}
      );
    }
  }
  generateWallsCoordinates () {
    const sides = 4;
    return  Array.from(Array(((this._boardSize-this._border)/this._step)*sides)).reduce((acc, el, i) => {
      if(i <= (this._boardSize)/this._step) {
        acc.push({x: 0, y: i*this._border})
        acc.push({x: i*this._border, y: 0})
        acc.push({x: (this._boardSize-this._border), y: i*this._border})
        acc.push({x: i*this._border, y: (this._boardSize-this._border)})
      }
      return acc;
    }, []);
  }

  draw() {
    if(this.walls) {
      this._ctx.fillStyle = this._color;
      for(let i = 0; i < this.walls.length; i++) {
        this._ctx.fillRect(
          this.walls[i].x,
          this.walls[i].y,
          this._border,
          this._border
        )
      }
    }
  }
}
