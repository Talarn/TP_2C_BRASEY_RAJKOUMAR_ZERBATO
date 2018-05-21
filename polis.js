const EventEmitter = require('events');
const chalk = require('chalk');
const {Divinity} = require('./divinity');
const {Unit} = require('./unit');

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

    this.attackInterval_ = 15000;
    this.tradeInterval_ = 10000;
    this.engageInterval_ = 8000;
    this.farmingInterval_ = 20000;

    this.worldEvent_ = new EventEmitter();

    for (let i = 0; i < 100; i++) {
      this.reserveArmy_.push(new Unit());
    }

    this.divinity_ = new Divinity();
    this.divinity_.init();
  }

  init() {
    this.tradeInterval_ = setInterval(() => {
      this.worldEvent.emit('trade', {
        a: this.polisID
      });
    }, 2 * this.tradeInterval * (Math.random() + 0.1));

    this.divinity_.worldEvents.on('favor', favor => {
      this.corn_ += favor.corn;
      this.gold_ += favor.gold;
      console.log(chalk.magenta('============== DIVINITE ' +
        this.polisID + ' ==============='));
      console.log(chalk.magenta('FAVEUR'));
      console.log(chalk.magenta('========================================='));
    });

    this.divinity_.worldEvents.on('blessing', blessing => {
      this.corn_ += blessing.corn;
      this.gold_ += blessing.gold;
      console.log(chalk.magenta('============== DIVINITE ' +
        this.polisID + ' ==============='));
      console.log(chalk.magenta('BLESSING'));
      console.log(chalk.magenta('========================================='));
    });

    this.divinity_.worldEvents.on('retribution', retribution => {
      this.corn_ += retribution.corn;
      this.gold_ += retribution.gold;
      console.log(chalk.magenta('============== DIVINITE ' +
        this.polisID + ' ==============='));
      console.log(chalk.magenta('RETRIBUTION'));
      console.log(chalk.magenta('========================================='));
    });

    this.engageInterval_ = setInterval(() => {
      this.engageSoldier();
    }, 2 * this.engageInterval * (Math.random() + 0.1));

    this.farmingInterval_ = setInterval(() => {
      this.farming();
    }, 2 * this.farmingInterval * (Math.random() + 0.1));

    this.attackInterval_ = setInterval(() => {
      this.worldEvent.emit('attack', {
        a: this.polisID,
        b: this.selectAttackTarget()
      });
    }, 2 * this.attackInterval * (Math.random() + 0.1));
  }

  selectAttackTarget() {
    const attackTarget = Math.floor(Math.random() * (this.numberOfPolis));
    return (attackTarget === this.polisID) ?
      this.selectAttackTarget() : attackTarget;
  }

  searchForSurvivor() {
    let woundedCount = 0;
    let deadCount = 0;

    woundedCount = this.reserveArmy.filter(unit => unit.wounded).length;
    deadCount = this.reserveArmy.filter(unit => unit.dead).length;

    this.reserveArmy_ = this.reserveArmy.filter(unit => !unit.dead);

    console.log(chalk.yellow(woundedCount + ' blessés') + ' || ' +
      chalk.red(deadCount + ' tués') + ' || ' +
      chalk.blue(this.reserveArmy.length + ' restants'));
  }

  reserveArmySplitForAttack() {
    this.attackingArmy_ =
      this.reserveArmy.splice(0, Math.floor(this.reserveArmy.length * 0.5));

    this.attackingArmy.forEach(u => {
      u.isDefence = false;
    });
  }

  reserveArmySplitForDefence() {
    this.defendingArmy_ =
      this.reserveArmy.splice(0, Math.floor(this.reserveArmy.length * 0.5));

    this.defendingArmy.forEach(u => {
      u.isDefence = true;
    });
  }

  defenceArmyBackToReserve() {
    this.reserveArmy_ = this.reserveArmy.concat(this.defendingArmy);

    this.defendingArmy_ = [];
  }

  attackArmyBackToReserve() {
    this.reserveArmy_ = this.reserveArmy.concat(this.attackingArmy);

    this.attackingArmy_ = [];
  }

  engageSoldier() {
    const goldAvailableForArmy = Math.floor(this.gold * 0.2);
    const unitsEngaged = Math.floor(goldAvailableForArmy / this.unitCost);
    for (let i = 0; i < unitsEngaged; i++) {
      this.reserveArmy.push(new Unit());
      this.gold_ -= this.unitCost;
    }
    console.log('Ville ' + this.polisID + ' : ' +
      unitsEngaged + ' engagées || ' + this.reserveArmy.length + ' unités');
  }

  divinityTouch() {
    let woundedCount = 0;
    let deadCount = 0;
    for (let i = 0; i < this.reserveArmy.length; i++) {
      if (this.reserveArmy[i].wounded && this.reserveArmy[i].dead === false) {
        if (Math.random() < 0.5) {
          this.reserveArmy[i].dead = true;
          deadCount++;
        } else {
          this.reserveArmy[i].wounded = false;
          woundedCount++;
        }
      }
    }

    this.reserveArmy_ = this.reserveArmy.filter(Unit => Unit.dead === false);

    console.log(chalk.green(woundedCount + ' soignés') + ' || ' +
      chalk.red(deadCount + ' succombent') + ' || ' +
      chalk.blue(this.reserveArmy.length + ' restants'));
  }

  trade() {
    this.corn_ -= Math.floor(this.corn * 0.25);
    console.log(chalk.cyan('====== RESULTATS CARAVANE VILLE ' +
      this.polisID + ' ======='));
    if (Math.random() > this.chanceOfBeingRobbed) {
      this.gold_ += Math.floor(this.gold * 0.25);
      console.log(chalk.green('La caravane reviens les poches pleines !'));
    } else {
      console.log(chalk.red('La caravane s`est faite dépouillée au retour'));
    }
    console.log('Il reste à la ville ' +
      this.gold + ' or après retour du marchand');
    console.log(chalk.cyan('========================================='));
  }

  farming() {
    this.corn_ += Math.floor(this.corn * 0.25);
    console.log(`Récolte ! Ville ${this.polisID} : ${this.corn} nourriture`);
  }

  get gold() {
    return this.gold_;
  }

  get corn() {
    return this.corn_;
  }

  get reserveArmy() {
    return this.reserveArmy_;
  }

  get defendingArmy() {
    return this.defendingArmy_;
  }

  get attackingArmy() {
    return this.attackingArmy_;
  }

  get numberOfPolis() {
    return this.numberOfPolis_;
  }

  get worldEvent() {
    return this.worldEvent_;
  }

  get polisID() {
    return this.polisID_;
  }

  get engageInterval() {
    return this.engageInterval_;
  }

  get farmingInterval() {
    return this.farmingInterval_;
  }

  get attackInterval() {
    return this.attackInterval_;
  }

  get tradeInterval() {
    return this.tradeInterval_;
  }

  get unitCost() {
    return this.unitCost_;
  }

  get chanceOfBeingRobbed() {
    return this.chanceOfBeingRobbed_;
  }
}

module.exports = {Polis};
