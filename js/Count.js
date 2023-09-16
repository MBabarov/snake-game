import {EventBus} from "./EventBus.js";

export class Count {

  count;
  recordNode;
  scoreNode;
  constructor(scoreNode, recordNode) {
    this.scoreNode = scoreNode;
    this.recordNode = recordNode;
    this.count = 0;
    EventBus.subscribe('snake-found-food', () => this.updateScore())
  }

  updateScore() {
    this.scoreNode.innerHTML = ++this.count;
    this.updateRecord()
  }

  loadRecord() {
    this.recordNode.innerHTML = localStorage.getItem('record') || this.count;
  }

  updateRecord() {
    if(this.count > Number.parseInt(localStorage.getItem('record'))) {
      this.recordNode.innerHTML = this.count;
      localStorage.setItem('record', this.count);
    }
  }
}