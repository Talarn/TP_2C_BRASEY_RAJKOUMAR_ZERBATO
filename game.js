const chalk = require('chalk');
const {Polis} = require('./polis');

class Game {
  constructor() {
    this.polisList_ = [];
    this.polisNumber_ = 5;

    for (let i = 0; i < this.polisNumber; i++) {
      this.polisList.push(new Polis(this.polisNumber, i));
      this.polisList[i].init();
    }

    this.timeFactor_ = 10000;
  }

  init() {
    this.polisList.forEach(p => p.worldEvent.on('trade', trade => {
      this.tradeCaravane(trade.a);
    }));

    this.polisList.forEach(p => p.worldEvent.on('attack', attack => {
      this.fightBetweenPolis(attack.a, attack.b);
    }));
  }

  fightBetweenPolis(a, b) {
    console.log(chalk.red('Armée de la ville ' + a +
      ' marche vers ville ' + b + ' !'));
    this.polisList[a].reserveArmySplitForAttack();
    this.polisList[b].reserveArmySplitForDefence();

    setTimeout(() => {
      this.polisList[a].attackingArmy.forEach(u => u.fight());
      this.polisList[b].defendingArmy.forEach(u => u.fight());
    }, this.timeFactor);

    setTimeout(() => {
      console.log(chalk.red('== RESULTATS COMBAT ENTRE VILLE ' +
        a + ' et ' + b + ' =='));
      this.polisList[a].attackArmyBackToReserve();
      this.polisList[b].defenceArmyBackToReserve();
      console.log(`...........Ville ${a}...........`);
      this.polisList[a].searchForSurvivor();
      this.polisList[a].divinityTouch();
      console.log(`...........Ville ${b}...........`);
      this.polisList[b].searchForSurvivor();
      this.polisList[b].divinityTouch();
      console.log(chalk.red('========================================='));
    }, this.timeFactor);
  }

  tradeCaravane(a) {
    console.log(chalk.cyan('Caravane au départ de ' + a + ' !'));

    setTimeout(() => {
      this.polisList[a].trade();
    }, 2 * this.timeFactor * (Math.random() + 0.1));
  }

  get timeFactor() {
    return this.timeFactor_;
  }

  get polisList() {
    return this.polisList_;
  }

  get polisNumber() {
    return this.polisNumber_;
  }
}
module.exports = {Game};

const play = new Game();
play.init();
