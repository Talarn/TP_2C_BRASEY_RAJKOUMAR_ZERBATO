# Civilization in Javascript

This is a little civilization-like console game where cities can fight and trade between them. There is no user interaction,
everything is automatic and quite random.

---
## Prerequisite(for Windows)
* [install node 9.x.x ](https://nodejs.org/en/download/)
* [install yarn](https://yarnpkg.com/en/docs/install#windows)
* [install git](https://git-scm.com/downloads)
* install tools:
```
yarn global add grunt-cli xo mocha
```

##

## Getting Started

* Create an empty folder where you want to install it
* Open your command prompt and change directory:
```
(example)
cd D:\Dossier_Temporaire\Javascript\Test_Git
```
* Clone repository: 
```
git clone https://github.com/Talarn/TP_2C_BRASEY_RAJKOUMAR_ZERBATO.git
```
* Download/Install dependencies:
```
yarn install
```
* Launch program:
```
node game.js
```

## Files description :

* polis.js : Each polis can fight and trade between them. They all have a reserve army they can split into attack or defense.
* unit.js : An unit can fight or defend, it can be wounded or be killed during fight but cannot be killed during defense thanks to the Divinity.
* divinity.js : Reside in a polis and is used to protect the defense army. But the polis has to offer some gold and corn to the divinity or it will be wiped.
* game.js : Instantiate all objects and run the game.

## License

This project is licensed under the terms of the
[MIT license](/LICENSE.md).


