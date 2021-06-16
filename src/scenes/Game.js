import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{
    constructor(){
        super('game')
    }

    preload(){
        this.load.image('background', 'assets/white.png')
        this.load.image('boundary' , 'assets/floor.png')
        this.load.image('wall' , 'assets/YkHgvD.png')
    }

    create(){
        this.add.image(260, 320, 'background').setScale(4)

        this.physics.add.staticImage(-176, 130, 'wall').setBodySize(450,1200).setDisplaySize(450,1200)
        this.physics.add.staticImage(1278, 130, 'wall').setBodySize(450,1200).setDisplaySize(450,1200).setAngle(180)

        this.physics.add.staticImage(15, 20, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)
        this.physics.add.staticImage(15, 680, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)
        
        
        
        //const player 
    }

    update(){

    }
}