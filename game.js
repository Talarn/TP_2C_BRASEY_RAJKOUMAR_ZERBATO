const EventEmitter = require('events');
const {Divinity} = require('./divinity');
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
    /*this.checkPolisStateInterval_ = setInterval(() => {
      this.checkPolisState();
    }, this.polisStateTimeFactor_);*/

    this.polisList_.forEach(p => p.worldEvent_.on('trade', trade => {
      this.tradeCaravane(trade.a);
    }));

    this.polisList_.forEach(p => p.worldEvent_.on('attack', attack => {
      this.fightBetweenPolis(attack.a, attack.b);
    }));
  }

  fightBetweenPolis(a, b) {
    console.log('== COMBAT ENTRE VILLE '.red + a + ' et '.red + b + ' =='.red);
    console.log(`Armée de la ville ${a} est sur le départ !`);
    this.polisList_[a].reserveArmySplitForAttack();
    this.polisList_[b].reserveArmySplitForDefence();

    setTimeout(() => {
      console.log(`Combat engagé entre Villes ${a} et ${b} !`);
      this.polisList_[a].attackingArmy_.forEach(u => u.fight());
      this.polisList_[b].defendingArmy_.forEach(u => u.fight());
    }, 4 * this.timeFactor * Math.random());

    setTimeout(() => {
      console.log(`Armée de la ville ${a} est de retour !`);
      console.log('== RESULTATS COMBAT ENTRE VILLE '.red + a + ' et '.red + b + ' =='.red);
      this.polisList_[a].attackArmyBackToReserve();
      this.polisList_[b].defenceArmyBackToReserve();
      console.log(`...........Ville ${a}...........`);
      this.polisList_[a].searchForSurvivor();
      this.polisList_[a].divinityTouch();
      console.log(`...........Ville ${b}...........`);
      this.polisList_[b].searchForSurvivor();
      this.polisList_[b].divinityTouch();
    }, 4 * this.timeFactor * Math.random());

  }

  tradeCaravane(a) {
    console.log(`Caravane au départ de ${a} !`);

    setTimeout(() => {
      console.log(`Caravane de la ville ${a} commerce`);
    }, 4 * this.timeFactor * Math.random());

    setTimeout(() => {
      console.log(`Caravane de la ville ${a} est de retour`);
      this.polisList_[a].trade();
    }, 4 * this.timeFactor * Math.random());

  }

  checkPolisState() {
    this.polisList_.forEach((p, polisIndex) => {
      if (p.isDead()) {
        console.log(`Ville est en ruine`);
        p.endPolis();
        this.polisList_ = this.polisList_.splice(polisIndex, 1);
        this.polisList_.forEach(p => p.numberOfPolis_ = this.polisList_.length);
        this.polisList_.forEach((p, polisIndex) => {p.polisID_ = polisIndex});
      }
    });
  }
}
module.exports = {Game};

let a = new Game();
a.init();