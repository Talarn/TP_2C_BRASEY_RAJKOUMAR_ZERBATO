class Unit {
  constructor() {
    this.wounded_ = false;
    this.dead_ = false;
    this.isDefence_ = false;
    this.timeBioDeath_ = 10000;
  }

  init() {
    this.bioDeathTimeout_ = setTimeout(() => {
      this.dead = true;
    }, this.timeBioDeath);
  }

  fight() {
    if (Math.random() > 0.50) {
      this.wounded = true;
    }
    if (Math.random() > 0.70 && this.isDefence === false) {
      this.dead = true;
      this.wounded = false;
    }
  }

  get wounded() {
    return this.wounded_;
  }

  set wounded(value) {
    this.wounded_ = value;
  }

  get isDefence() {
    return this.isDefence_;
  }

  set isDefence(value) {
    this.isDefence_ = value;
  }

  get dead() {
    return this.dead_;
  }

  set dead(value) {
    this.dead_ = value;
  }

  get timeBioDeath() {
    return this.timeBioDeath_;
  }
}
module.exports = {Unit};
