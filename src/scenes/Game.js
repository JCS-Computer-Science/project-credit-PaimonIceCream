import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{
    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    boundary

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    wall

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor(){
        super('game')
    }

    init(){

    }

    preload(){
        this.load.image('boundary' , 'assets/floor.png')
        this.load.image('wall' , 'assets/YkHgvD.png')
        this.load.image('player', 'assets/maroon.png')

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(){
        const leftWall = this.physics.add.staticImage(-176, 130, 'wall').setBodySize(450,1200).setDisplaySize(450,1200)
        const rightWall = this.physics.add.staticImage(1278, 130, 'wall').setBodySize(450,1200).setDisplaySize(450,1200).setAngle(180)

        const ceiling = this.physics.add.staticImage(15, 20, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)
        const floor = this.physics.add.staticImage(15, 680, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)

        this.boundary = this.physics.add.staticGroup([floor, ceiling])
        this.wall = this.physics.add.staticGroup([leftWall, rightWall])

        this.player = this.physics.add.sprite(550, 350, 'player').setScale(0.05)

        this.physics.add.collider(this.player, this.boundary)
        this.physics.add.collider(this.player, this.wall)

        
    }

    
    update(){
        const touchingLeft = this.player.body.touching.left
        const touchingRight = this.player.body.touching.right
        const touchingUp = this.player.body.touching.up
        const touchingDown = this.player.body.touching.down


        if(this.cursors.left.isDown && !touchingLeft){
            this.player.setVelocityX(-320)
        }else if(this.cursors.right.isDown && !touchingRight){
            this.player.setVelocityX(320)
        }else{
            this.player.setVelocityX(0)
        }

        const canJump = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        
        if(canJump && !touchingUp){
            this.player.setVelocityY(-450)
        }else if(this.cursors.down.isDown && !touchingDown){
            this.player.setVelocityX(0)
            this.player.setVelocityY(610)
        }
    }


}