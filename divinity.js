const EventEmitter = require('events');

class Divinity {
  constructor() {
    this.corn_ = 0;
    this.gold_ = 0;
    this.worldEvents_ = new EventEmitter();
    this.timeFactor_ = 15000;
  }

  init() {
    this.timeFactor_ = setInterval(() => {
      this.worldEvents.emit('favor', {
        corn: this.corn * 0.1,
        gold: this.gold * 0.1
      });

      if (Math.random() > 0.95) {
        this.worldEvents.emit('blessing', {
          corn: 100 * this.corn,
          gold: 100 * this.gold
        });
      }

      if (Math.random() > 0.99) {
        this.worldEvents.emit('retribution', Math.floor(10000 * Math.random()));
      }
    }, 2 * this.timeFactor * (Math.random() + 0.1));
  }

  get corn() {
    return this.corn_;
  }

  get gold() {
    return this.gold_;
  }

  get worldEvents() {
    return this.worldEvents_;
  }

  get timeFactor() {
    return this.timeFactor_;
  }
}

module.exports = {Divinity};
