const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const span = document.querySelector("span#clock")
const menu = document.querySelector("div.menu")
const buttonReplay = document.querySelector("button#btn-replay")

const width = 30
const height = canvas.height / 4
const speedGame = 1
const blurCtx = 50
const speedRacket = 15
const dMin = 2
const dMax = 4
const keysPressed = {}

let loopId, startTime, clockGame, updateClock, speedBall, run

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

let dx = randomNumber(dMin, dMax)
let dy = randomNumber(dMin, dMax)
console.log(`dx: ${dx} | dy: ${dy}`)

const moveBall = () => {
    ball.x += dx
    ball.y += dy
    
    if (ball.x <= 0 + ball.raio || ball.x >= canvas.width - ball.raio * 2) {
        gameover()
    }
    if (ball.y <= 0 + ball.raio || ball.y >= canvas.height - ball.raio * 2) {
        dy *= -1
    }

    if (ball.x <= width + ball.raio && ball.y + ball.raio >= racket[0].y && ball.y + ball.raio <= racket[0].y + height || ball.x + ball.raio >= canvas.width - width && ball.y + ball.raio >= racket[1].y && ball.y + ball.raio<= racket[1].y + height) {
        dx *= -1
    }
}

const updateBall = (currentTime) => {
    if (!speedBall) {
        speedBall = 0
    }

    if (!updateClock) {
        updateClock = Date.now()
    }
    const updateTime = currentTime - updateClock
    if (updateTime >= 10 * 1000) {
        updateClock = undefined
        speedBall += 0.25
        if (dx < 0) {
            dx -= speedBall
        } else {
            dx += speedBall
        }
        if (dy < 0) {
            dy -= speedBall
        } else {
            dy += speedBall
        }
        console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
        console.log(`dx: ${dx} | dy: ${dy} -> ${speedBall}`)
    }
}

const gameover = () => {
    startTime = Date.now()
    updateClock = undefined
    speedBall = 0

    menu.style.display = "flex"
    canvas.style.filter = "blur(10px)"

    span.innerHTML = `00:00`
    run = false
}

const gameLoop = () => {
    if (!startTime) {
        startTime = Date.now()
    }

    const currentTime = Date.now()
    const clockGame = currentTime - startTime
    span.innerHTML = `${(clockGame / 1000).toFixed(2)}`

    clearInterval(loopId)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawRacket1()
    drawRacket2()
    drawBall()
    moveRacket()
    wallCollision()
    moveBall()
    updateBall(currentTime)

    if (run) {
        loopId = setInterval(() => {
            gameLoop()
        }, speedGame)
    }
}

buttonReplay.addEventListener('click', () => {
    menu.style.display = "none"
    canvas.style.filter = "blur(0px)"
    run = true

    ball.x = canvas.width / 2
    ball.y = canvas.height / 2
    dx = randomNumber(dMin, dMax)
    dy = randomNumber(dMin, dMax)
    gameLoop()
})

run = true
gameLoop()