const {Divinity} = require('./divinity');
const {Unit} = require('./unit');
const {Game} = require('./game.js');
const EventEmitter = require('events');
let colors = require('colors');

class Polis {
  constructor(a, b) {
    this.reserveArmy_ = [];
    this.defendingArmy_ = [];
    this.attackingArmy_ = [];

    this.corn_ = 1000;
    this.gold_ = 1000;

    this.unitCost_ = 10;

    this.chanceOfBeingRobbed_ = 0.4;

    this.numberOfPolis_ = a;
    this.polisID_ = b;

    this.attackInterval_ = 1000;
    this.tradeInterval_ = 1000;
    this.engageInterval_ = 1500;
    this.farmingInterval_ = 2000;

    this.worldEvent_ = new EventEmitter();
    for (let i = 0; i < 100; i++) {
      this.reserveArmy.push(new Unit());
    }
    this.divinity_ = new Divinity();
  }

  init()  {
    this.tradeInterval_ = setInterval(() => {
      this.worldEvent_.emit('trade', {
        a : this.polisID_
      })
    }, this.tradeInterval_);

    this.engageInterval_ = setInterval(() => {
      this.engageSoldier();
    }, this.engageInterval_);

    this.farmingInterval_ = setInterval(() => {
      this.farming();
    }, this.farmingInterval_);

    this.attackInterval_ = setInterval(() => {
      this.worldEvent_.emit('attack', {
        a : this.polisID_,
        b : this.selectAttackTarget()
      });
    }, this.attackInterval_);
  }

  selectAttackTarget() {
    let attackTarget = Math.floor(Math.random() * (this.numberOfPolis_));
    return (attackTarget == this.polisID_) ? this.selectAttackTarget() : attackTarget;
  }

  searchForSurvivor() {
    let woundedCount = 0;
    let deadCount = 0;

    woundedCount = this.reserveArmy.filter(unit => unit.wounded).length;
    deadCount = this.reserveArmy.filter(unit => unit.dead).length;

    this.reserveArmy = this.reserveArmy.filter(unit => !unit.dead);

    console.log(woundedCount + ' bléssés'.yellow + ' || ' + deadCount +  ' tués'.red + ' || ' + this.reserveArmy.length + ' restants'.blue);

  }

  prepareForAttackAndDefend() {
    this.attackingArmy.forEach(unit => unit.fight());
    polisTarget.defendingArmy.forEach(unit => unit.fight());

    if(this.attackingArmy.length > polisTarget.reserveArmy.length)  {
      this.gold += polisTarget.gold*0.3;
      polisTarget.gold -= polisTarget.gold*0.3;
      console.log("Attaque réussie ! Ville pillée !")
    } else  {
      this.attackingArmy =
        this.attackingArmy.slice(this.attackingArmy.length * 0.6);
      console.log("Attaque ratée ! Armée d'attaque perd 40% de ses effectifs !")
    }
  }

  reserveArmySplitForAttack() {
    this.attackingArmy =
      this.reserveArmy_.splice(0, Math.floor(this.reserveArmy.length * 0.5));

    this.attackingArmy.forEach(u => {u.isDefence = false});
  }

  reserveArmySplitForDefence() {
    this.defendingArmy =
      this.reserveArmy.splice(0, Math.floor(this.reserveArmy.length * 0.5));

    this.defendingArmy.forEach(function(u) {u.isDefence = true});
  }

  defenceArmyBackToReserve() {
    this.reserveArmy_ = this.reserveArmy.concat(this.defendingArmy);

    this.defendingArmy = [];
  }

  attackArmyBackToReserve() {
    this.reserveArmy = this.reserveArmy.concat(this.attackingArmy);

    this.attackingArmy = [];
  }

  engageSoldier() {
    let goldAvailableForArmy = Math.floor(this.gold * 0.2);
    let unitsEngaged = Math.floor(goldAvailableForArmy/this.unitCost_);
    for (let i = 0; i < unitsEngaged; i++) {
      this.reserveArmy.push(new Unit());
      this.gold -= this.unitCost_;
    }
    console.log("Ville " + this.polisID_ + " : " + unitsEngaged + " engagées || " + this.reserveArmy.length + " unités");
  }

  giftToDivinity() {
    let cornGift = this.corn * 0.4;
    let goldGift = this.gold * 0.2;
    this.gold -= goldGift;
    this.corn -= cornGift;
    this.divinity_.offeringCorn(cornGift);
    this.divinity_.offeringGold(goldGift);
  }

  divinityTouch() {
    let woundedCount = 0;
    let deadCount = 0;
    for (let i = 0; i < this.reserveArmy.length; i++) {
      if (this.reserveArmy[i].wounded && this.reserveArmy[i].dead == false) {
        if (Math.random() < 0.5) {
          this.reserveArmy[i].dead = true;
          deadCount++;
        }
        else {
          this.reserveArmy[i].wounded = false;
          woundedCount++;
        }
      }
    }

    this.reserveArmy = this.reserveArmy.filter(Unit => Unit.dead == false);

    console.log(woundedCount + ' soignés'.green + ' || ' + deadCount + ' succombent'.red + ' || ' + this.reserveArmy.length + ' restants'.blue);
  }

  trade() {
    this.corn_ -= Math.floor(this.corn_ * 0.25);
    if(Math.random() > this.chanceOfBeingRobbed_)  {
      this.gold += Math.floor(this.gold_ * 0.25);
      console.log(`La caravane reviens les poches pleines !`);
    } else  {
      console.log(`La caravane s'est faite dépouillée au retour`)
    }
    console.log('Il reste à la ville ' + this.gold_ + ' or après retour du marchand');
  }

  farming() {
    this.corn_ += Math.floor(this.corn_ * 0.25);
    console.log(`Récolte ! ${this.corn_} nourriture`);
  }

  isDead() {
    if(this.gold < 100)  {
      return true;
    }
    if(this.reserveArmy_.length < 10)  {
      return true;
    }

  }

  get reserveArmy() {
    return this.reserveArmy_;
  }

  set reserveArmy(value) {
    this.reserveArmy_ = value;
  }

  get attackingArmy() {
    return this.attackingArmy_;
  }

  set attackingArmy(value) {
    this.attackingArmy_ = value;
  }

  get defendingArmy() {
    return this.defendingArmy_;
  }

  set defendingArmy(value) {
    this.defendingArmy_ = value;
  }

  get gold() {
    return this.gold_;
  }

  set gold(value) {
    this.gold_ = value;
  }

  get corn() {
    return this.corn_;
  }

  set corn(value) {
    this.corn_ = value;
  }

  get numberOfPolis() {
    return this.numberOfPolis_;
  }

  set numberOfPolis(value) {
    this.numberOfPolis_ = value;
  }

  endPolis()  {
    clearInterval(this.attackInterval_);
    clearInterval(this.tradeInterval_);
  }
}

module.exports = {Polis};