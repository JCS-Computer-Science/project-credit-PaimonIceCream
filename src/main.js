import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'


export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1100,
    height: 700,
    scene: Game,
    backgroundColor:'#000000',
    physics:{
        default: 'arcade',
        arcade:{
            debug: false
        }
    }
})

//Note: for darkmode change colour to #000000, or #FCFEFF