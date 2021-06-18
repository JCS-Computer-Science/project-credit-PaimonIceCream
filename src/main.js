import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'


export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    scene: Game,
    backgroundColor:'#FCFEFF',
    physics:{
        default: 'arcade',
        arcade:{
            debug: false
        }
    }
})