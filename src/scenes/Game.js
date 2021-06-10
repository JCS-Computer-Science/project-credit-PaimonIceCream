import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{
    constructor(){
        super('game')
    }

    preload(){
        this.load.image('background', 'assets/white.png')
    }

    create(){
        this.add.image(260, 320, 'background')
    }
}