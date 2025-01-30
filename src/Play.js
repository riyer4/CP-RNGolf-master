class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        //logging the starting position
        this.ball.startX = this.ball.x
        this.ball.startY = this.ball.y

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        //add moving wall

        let wallC = this.physics.add.sprite(0, height / 2.5, 'wall')
        wallC.setX(Phaser.Math.Between(0 + wallC.width / 2, width - wallC.width / 2))
        wallC.body.setImmovable(true)
        wallC.setVelocityX(200)
        wallC.body.setCollideWorldBounds(true)
        wallC.body.setBounce(1)

        

        this.walls = this.add.group([wallA, wallB, wallC])


        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })

        // this.input.on('pointerleft', (pointer) => {
        //     let shotDirection = pointer.x <= this.ball.x ? 0.5 : -0.5
        //     this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
        //     this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        // })

        // cup/ball collision
        let goal = false
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy()
            this.goal = true
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        // score config

        this.p1Score = 0 //score initialization

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            allig: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },

            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(height / 50, height / 20, this.p1Score, scoreConfig)

    }

    update() {
        if (this.checkCollision(this.ball, this.cup)) {
            this.ball.setPosition(this.ball.startX, this.ball.startY)
            this.ball.setVelocity(0)
            this.p1Score += 10
        }


    }

    checkCollision(ball, cup) {

        //simple AABB (?) checking

        if (ball.x < cup.x + cup.width && 
            ball.x + ball.width > cup.x && 
            ball.y < cup.y + cup.height && 
            ball.height + ball.y > cup.y) {
            return true
        } else {
            return false
        }
    }

    holeInOne(cup) {
        this.p1Score += cup.points
        this.scoreLeft.text = this.p1Score  
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/