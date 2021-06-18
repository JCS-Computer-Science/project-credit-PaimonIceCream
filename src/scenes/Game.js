import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    boundary

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    wall

    /** @type {Phaser.Physics.Arcade.World} */
    timer

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    constructor() {
        super('game')
    }

    init() {

    }

    preload() {
        this.load.image('boundary', 'assets/floor.png')
        this.load.image('wall', 'assets/YkHgvD.png')
        this.load.image('player', 'assets/maroon.png')
        this.load.image('obstacle', 'assets/blue.png')

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        const leftWall = this.physics.add.staticImage(-176, 130, 'wall').setBodySize(450, 1200).setDisplaySize(450, 1200)
        const rightWall = this.physics.add.staticImage(1278, 130, 'wall').setBodySize(450, 1200).setDisplaySize(450, 1200).setAngle(180)

        const ceiling = this.physics.add.staticImage(15, 20, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)
        const floor = this.physics.add.staticImage(15, 680, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)

        this.boundary = this.physics.add.staticGroup([floor, ceiling])
        this.wall = this.physics.add.staticGroup([leftWall, rightWall])

        this.player = this.physics.add.sprite(550, 350, 'player').setScale(0.05).setGravityY(980)

        this.physics.add.collider(this.player, this.boundary)
        this.physics.add.collider(this.player, this.wall)


        const obstacle = this.physics.add.group()

        var seconds = 0
        var counter = 0
        var counterGhost = 0
        var intervalLevel = 2

        var minW = 200
        var maxW = 400
        var velocity = 260

        this.timer = setInterval(() => {
            seconds = seconds + 0.1
            counter = counter + 0.1
            counterGhost = counterGhost + 0.1

            if (Math.round(seconds) == 7) {
                intervalLevel = 1.8
                minW = 180
                maxW = 380
                velocity = 275
            } else if (Math.round(seconds) == 18) {
                intervalLevel = 1.6
                minW = 160
                maxW = 360
                velocity = 290
            } else if (Math.round(seconds) == 32) {
                intervalLevel = 1.4
                minW = 140
                maxW = 340
                velocity = 305
            } else if (Math.round(seconds) == 48) {
                intervalLevel = 1.1
                minW = 120
                maxW = 320
                velocity = 320
            } else if (Math.round(seconds) == 70) {
                intervalLevel = 0.8
                minW = 100
                maxW = 300
                velocity = 335
            }

            if (counter >= intervalLevel) {
                const width = Phaser.Math.Between(minW, maxW)
                const height = minW + maxW - width
                var start
                var speed

                const LR = Phaser.Math.Between(0, 1)
                if (LR == 0) {
                    start = 0 - width
                    speed = velocity
                } else {
                    start = this.scale.width + width
                    speed = -velocity
                }
                const x = start
                const y = Phaser.Math.Between(40 + (height / 2), this.scale.height - (40 + height / 2))

                /** @type {Phaser.Physics.Arcade.Sprite} */     
                const object = obstacle.create(x, y, 'obstacle')
                object.setDisplaySize(width, height)
                object.setVelocityX(speed)

                /** @type {Phaser.Physics.Arcade.Group}*/       
                const blueBody = object.body
                blueBody.updateFromGameObject() 

                counter = 0
            }
            //Ghost Block
            if(counterGhost >= (4.4 + intervalLevel*intervalLevel)){
                const width = Phaser.Math.Between(100, 150)
                const height = 250 - width
                var start
                var speed

                const LR = Phaser.Math.Between(0, 1)
                if (LR == 0) {
                    start = 0 - width
                    speed = velocity
                } else {
                    start = this.scale.width + width
                    speed = -velocity
                }
                const x = start
                const y = Phaser.Math.Between(this.scale.height - (40 + height / 2) - 15, this.scale.height - (40 + height / 2))

                /** @type {Phaser.Physics.Arcade.Sprite} */     
                const object = obstacle.create(x, y, 'obstacle')
                object.setDisplaySize(width, height)
                object.setVelocityX(speed)

                /** @type {Phaser.Physics.Arcade.Group}*/       
                const blueBody = object.body
                blueBody.updateFromGameObject()
                
                counterGhost = 0
            }

        }, 100)





        this.physics.add.collider(
            this.player,
            obstacle,
            this.killGame,
            undefined,
            this
        )


    }


    update() {
        const touchingLeft = this.player.body.touching.left
        const touchingRight = this.player.body.touching.right
        const touchingUp = this.player.body.touching.up
        const touchingDown = this.player.body.touching.down


        if (this.cursors.left.isDown && !touchingLeft) {
            this.player.setVelocityX(-320)
        } else if (this.cursors.right.isDown && !touchingRight) {
            this.player.setVelocityX(320)
        } else {
            this.player.setVelocityX(0)
        }

        const canJump = Phaser.Input.Keyboard.JustDown(this.cursors.up)

        if (canJump && !touchingUp) {
            this.player.setVelocityY(-450)
        } else if (this.cursors.down.isDown && !touchingDown) {
            this.player.setVelocityX(0)
            this.player.setVelocityY(780)
        }

    }

    killGame(player) {
        this.player.setVisible(false)
        this.physics.world.destroy(this.player)
        this.physics.world.destroy(this.obstacle)
        clearInterval(this.timer)
    }

}