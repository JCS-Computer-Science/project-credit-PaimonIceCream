import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {
    score = 0
    highScore = 0

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    boundary

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    wall

    /** @type {Phaser.Physics.Arcade.World} */
    timer

    /** @type {Phaser.Physics.Arcade.World} */
    scoreTimer

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.GameObjects.Text} */
    scoreText

    /** @type {Phaser.GameObjects.Text} */
    highScoreText

    /** @type {Phaser.GameObjects.Text} */
    gameOverText

    constructor() {
        super('game')
    }

    init() {
        this.score = 0
    }

    preload() {
        this.load.image('boundary', 'assets/floor.png')
        this.load.image('wall', 'assets/YkHgvD.png')
        this.load.image('player', 'assets/maroon.png')
        this.load.image('obstacle', 'assets/blue.png')
        this.load.image('instructions', 'assets/instructions.png')

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        // The Stage
        const leftWall = this.physics.add.staticImage(-176, 130, 'wall').setBodySize(450, 1200).setDisplaySize(450, 1200)
        const rightWall = this.physics.add.staticImage(1278, 130, 'wall').setBodySize(450, 1200).setDisplaySize(450, 1200).setAngle(180)

        const ceiling = this.physics.add.staticImage(15, 20, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)
        const floor = this.physics.add.staticImage(15, 680, 'boundary').setBodySize(2170, 40).setDisplaySize(2170, 40)

        this.boundary = this.physics.add.staticGroup([floor, ceiling])
        this.wall = this.physics.add.staticGroup([leftWall, rightWall])

        const instructions = this.add.image(550, 250, 'instructions').setScale(0.8)

        this.player = this.physics.add.sprite(550, 645, 'player').setScale(0.05).setGravityY(980)

        this.physics.add.collider(this.player, this.boundary)
        this.physics.add.collider(this.player, this.wall)

        setTimeout(() => {
            instructions.setVisible(false)
        }, 3600)

        const style = {color:'#2b2926', fontSize: 24}
        const randomVar = this.scale.width - 240
        this.scoreText = this.add.text(10, 10, "Score: 0", style)
        this.highScoreText = this.add.text(randomVar, 10, `Highscore: ${this.highScore}`, style)

        this.scoreTimer = setInterval(() => {
            this.score++

            if(this.score > this.highScore){
                this.highScore = this.score
            }

            const scoreVar = `Highscore: ${this.highScore}`
            this.highScoreText.text = scoreVar 

            const scoreValue = `Score: ${this.score}`
            this.scoreText.text = scoreValue
        }, 1000)

        

        //obstacle spawn code starts
        const obstacle = this.physics.add.group()

        var seconds = 0
        var counter = 0
        var counterGhost = 0
        var intervalLevel = 2.2

        var minW = 180
        var maxW = 380
        var velocity = 240

        this.timer = setInterval(() => {
            seconds = seconds + 0.1
            counter = counter + 0.1
            counterGhost = counterGhost + 0.1

            if (Math.round(seconds) == 10) {
                intervalLevel = 2
                minW = 170
                maxW = 365
                velocity = 260
            } else if (Math.round(seconds) == 20) {
                intervalLevel = 1.8
                minW = 160
                maxW = 355
                velocity = 280
            } else if (Math.round(seconds) == 30) {
                intervalLevel = 1.5
                minW = 140
                maxW = 340
                velocity = 300
            } else if (Math.round(seconds) == 50) {
                intervalLevel = 1.2
                minW = 120
                maxW = 320
                velocity = 320
            } else if (Math.round(seconds) == 70) {
                intervalLevel = 0.8
                minW = 100
                maxW = 300
                velocity = 340
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

        //obstacle spawn code ends

        

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
        clearInterval(this.scoreTimer)

        this.input.keyboard.once('keydown_ENTER', () => {
            this.scene.start('game')
        })

        // Game Over Text
        const gameWidth = this.scale.width * 0.5
        const gameHeight = this.scale.height * 0.5

        this.add.text(gameWidth, gameHeight, 'Press Enter to Retry', {
            fontSize: 40,
            color: '#000000',
        }).setOrigin(0.5)

    }

}