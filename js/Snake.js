import {BoardElement} from "./BoardElement.js";
import {EventBus} from "./EventBus.js";

export class Snake extends BoardElement{
  head;
  body;
  direction;
  obstacles = {};

  constructor({ctx, boardSize, border, step, color = 'red'}) {
    super({ctx, boardSize, border, step, color});
    this.head = {x: this._border + this._step, y: this._border + this._step};
    this.body = [];
    this.direction = 'right';

    EventBus.subscribe('new-obstacle-coordinates', (data) => this.updateObstacleCoordinates(data))
    EventBus.subscribe('snake-coordinates', (data) => this.ranIntoSomething(data))
  }

  _calcCurrentCoordinates() {
    // Calculation snake body coordinates
    for(let i = this.body.length - 1; i >= 0; i--) {
      if(i > 0) {
        this.body[i] = this.body[i - 1];
      } else {
        this.body[i] = {x: this.head.x, y: this.head.y};
      }
    }

    // If the board is finished start showing snake at the beginning of the board
    if(this.direction === 'top') {
      this.head.y <= 0 ? this.head.y = this._boardSize - this._step : this.head.y -= this._step
    }

    if(this.direction === 'bottom') {
      this.head.y >= this._boardSize - this._step ? this.head.y = 0 : this.head.y += this._step
    }

    if(this.direction === 'right') {
      this.head.x >= this._boardSize - this._step ? this.head.x = 0 : this.head.x += this._step
    }

    if(this.direction === 'left') {
      this.head.x <= 0 ? this.head.x = this._boardSize - this._step : this.head.x -= this._step
    }

    EventBus.publish('snake-coordinates', {head: this.head, body: this.body});
  }

  changeDirection (e) {
    if(e.code == "ArrowUp" && this.direction !== "bottom") {
      this.direction = "top"
    } else if(e.code == "ArrowDown" && this.direction !== "top") {
      this.direction = "bottom"
    } else if(e.code == "ArrowLeft" && this.direction !== "right") {
      this.direction = "left"
    } else if(e.code == "ArrowRight" && this.direction !== "left") {
      this.direction = "right"
    }
  }

  draw() {
    // update board, without it, snake will include old coordinates
    this._ctx.fillStyle = 'white';
    this._ctx.fillRect(0, 0, this._boardSize, this._boardSize);

    this._calcCurrentCoordinates(this._boardSize, this._step)

    this._ctx.fillStyle = "green";
    // Draw snake head
    this._ctx.fillRect(this.head.x, this.head.y, this._step, this._step)

    // Draw snake body
    for(let i = 0; i < this.body.length; i++) {
      this._ctx.fillRect(this.body[i].x, this.body[i].y, this._step, this._step)
    }
  }

  ranIntoSomething({head, body}) {
    if(this.obstacles['food'].x == head.x && this.obstacles['food'].y == head.y) {
      this.body.push({x: head.x, y: head.y});
      return EventBus.publish('snake-found-food');
    } if(this.obstacles['border']) {
      for(let i = 0; i < this.obstacles['border'].list.length; i++) {
        if(this.obstacles['border'].list[i].x === head.x && this.obstacles['border'].list[i].y === head.y) {
          return EventBus.publish('snake-died');
        }
      }
    }
    this.checkKillYourself({head, body})
  }

  updateObstacleCoordinates(obstacle) {
    this.obstacles[obstacle.name] = obstacle;
  }

  checkKillYourself({head, body}) {
    for (let i = 0; i < body.length; i++) {
      if (head.x == body[i].x && head.y == body[i].y) {
        EventBus.publish('snake-died');
      }
    }
  }
}