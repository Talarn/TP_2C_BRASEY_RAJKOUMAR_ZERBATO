const EventEmitter = require('events');
const {Polis} = require('./polis');

class Game {
  constructor() {
    this.polisList_ = [];
    this.polisNumber_ = 5;
    for (let i = 0; i < this.polisNumber_; i++) {
      this.polisList_.push(new Polis(this.polisNumber_, i));
      this.polisList_[i].init();
    }

    this.polisStateTimeFactor_ = 1000;
    this.timeFactor_ = 1000;

    this.worldEvent_ = new EventEmitter();
  }

  init() {
    this.polisList_.forEach(p => p.worldEvent_.on('trade', trade => {
      this.tradeCaravane(trade.a);
    }));

    this.polisList_.forEach(p => p.worldEvent_.on('attack', attack => {
      this.fightBetweenPolis(attack.a, attack.b);
    }));
  }

  fightBetweenPolis(a, b) {
    console.log('Armée de la ville '.red + a +
      ' marche vers ville '.red + b + ' !'.red);
    this.polisList_[a].reserveArmySplitForAttack();
    this.polisList_[b].reserveArmySplitForDefence();

    setTimeout(() => {
      this.polisList_[a].attackingArmy_.forEach(u => u.fight());
      this.polisList_[b].defendingArmy_.forEach(u => u.fight());
    }, 4 * this.timeFactor * Math.random());

    setTimeout(() => {
      console.log('== RESULTATS COMBAT ENTRE VILLE '.red +
        a + ' et '.red + b + ' =='.red);
      this.polisList_[a].attackArmyBackToReserve();
      this.polisList_[b].defenceArmyBackToReserve();
      console.log(`...........Ville ${a}...........`);
      this.polisList_[a].searchForSurvivor();
      this.polisList_[a].divinityTouch();
      console.log(`...........Ville ${b}...........`);
      this.polisList_[b].searchForSurvivor();
      this.polisList_[b].divinityTouch();
      console.log('========================================='.red);
    }, 4 * this.timeFactor * Math.random());
  }

  tradeCaravane(a) {
    console.log('Caravane au départ de '.rainbow + a + ' !'.rainbow);

    setTimeout(() => {
      this.polisList_[a].trade();
    }, 4 * this.timeFactor * Math.random());
  }
}
module.exports = {Game};

const play = new Game();
play.init();
