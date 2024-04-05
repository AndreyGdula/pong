const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const h1 = document.querySelector("h1")

const width = 30
const height = canvas.height / 4
const speedGame = 1
const blurCtx = 50
const speedRacket = 15
const keysPressed = {}

let loopId

const racket = [
    {x: 0, y: (canvas.height / 2) - (height / 2), color: "white"},
    {x: canvas.width - width, y: (canvas.height / 2) - (height / 2), color: "white"}
]

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    raio: 10,
    color: "white"
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
} 

const drawRacket1 = () => {
    ctx.fillStyle = racket[0].color
    ctx.shadowColor = racket[0].color
    ctx.shadowBlur = blurCtx
    ctx.fillRect(racket[0].x, racket[0].y, width, height)
}

const drawRacket2 = () => {
    ctx.fillStyle = racket[1].color
    ctx.shadowColor = racket[0].color
    ctx.shadowBlur = blurCtx
    ctx.fillRect(racket[1].x, racket[1].y, width, height)
}

const drawBall = () => {
    ctx.fillStyle = ball.color
    ctx.shadowColor = racket[0].color
    ctx.shadowBlur = blurCtx
    
    ctx.clearRect(ball.x - ball.raio - 1, ball.y - ball.raio - 1, ball.raio * 2 + 2, ball.raio * 2 + 2)

    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.raio, 0, 2 * Math.PI)
    ctx.fill()
}

const moveRacket = () => {
  if (keysPressed["ArrowUp"]) {
    racket[1].y -= speedRacket
  }
  if (keysPressed["ArrowDown"]) {
    racket[1].y += speedRacket
  }
  if (keysPressed["w"]) {
    racket[0].y -= speedRacket
  }
  if (keysPressed["s"]) {
    racket[0].y += speedRacket
  }
}

document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true
})
  
document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key]
})

const wallCollision = () => {
    if (racket[0].y <= 0) {
        racket[0].y = 0
    }
    if (racket[0].y >= canvas.height - height) {
        racket[0].y = canvas.height - height
    }
    if (racket[1].y <= 0) {
        racket[1].y = 0
    }
    if (racket[1].y >= canvas.height - height) {
        racket[1].y = canvas.height - height
    }
}

let dx = randomNumber(1, 3)
let dy = randomNumber(1, 3)
console.log(`dx: ${dx} | dy: ${dy}`)

const moveBall = () => {
    ball.x += dx
    ball.y += dy
    
    if (ball.x <= 0 || ball.x >= canvas.width - ball.raio * 2) {
        ball.x = canvas.width / 2
        ball.y = canvas.height / 2
        console.log('perdeu')
    }
    if (ball.y <= 0 || ball.y >= canvas.height - ball.raio * 2) {
        dy *= -1
    }

    if (ball.x <= width && ball.y >= racket[0].y && ball.y <= racket[0].y + height || ball.x >= canvas.width - width && ball.y >= racket[1].y && ball.y <= racket[1].y + height) {
        dx *= -1
    }
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawRacket1()
    drawRacket2()
    drawBall()
    moveRacket()
    wallCollision()
    moveBall()

    loopId = setInterval(() => {
        gameLoop()
    }, speedGame)
}

gameLoop()