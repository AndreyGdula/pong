const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const span = document.querySelector("span#clock")
const gameTime = document.querySelector("span#gameTime")
const menu = document.querySelector("div.menu")
const buttonReplay = document.querySelector("button#btn-replay")
const gameRecord = document.querySelector("span#gameRecord")
const leftTop = document.querySelector("button#leftTop")
const rightTop = document.querySelector("button#rightTop")
const leftBottom = document.querySelector("button#leftBottom")
const rightBottom = document.querySelector("button#rightBottom")
const divControl = document.querySelector("div.control")

const width = 30
const height = canvas.height / 4
const speedGame = 1
const blurCtx = 50
const speedRacket = 15
const dMin = 2
const dMax = 4
const keysPressed = {}
const timeRecord = []

let loopId, startTime, clockGame, updateClock, speedBall, run

let pressButtonLT = false
let pressButtonLB = false
let pressButtonRT = false
let pressButtonRB = false

const racketSound = new Audio("../files/racket-sound.mp3")
const gameoverSound = new Audio("../files/gameover-sound.wav")
gameoverSound.volume = 0.1

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

const moveBall = (clockGame) => {
    ball.x += dx
    ball.y += dy
    
    if (ball.x <= 0 + ball.raio || ball.x >= canvas.width - ball.raio * 2) {
        gameoverSound.play()
        gameover(clockGame)
    }
    if (ball.y <= 0 + ball.raio || ball.y >= canvas.height - ball.raio * 2) {
        dy *= -1
        racketSound.play()
    }

    if (ball.x <= width + ball.raio && ball.y + ball.raio >= racket[0].y && ball.y + ball.raio <= racket[0].y + height || ball.x + ball.raio >= canvas.width - width && ball.y + ball.raio >= racket[1].y && ball.y + ball.raio<= racket[1].y + height) {
        dx *= -1
        racketSound.play()
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

const gameover = (clockGame) => {
    startTime = Date.now()
    updateClock = undefined
    speedBall = 0
    timeRecord.push((clockGame / 1000).toFixed(2))
    console.log(timeRecord)

    menu.style.display = "flex"
    canvas.style.filter = "blur(10px)"

    span.innerHTML = `00:00`
    gameTime.innerHTML = `${timeRecord[timeRecord.length - 1]}`
    gameRecord.innerHTML = `${Math.max(...timeRecord)}`
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
    moveBall(clockGame)
    updateBall(currentTime)
    controlMobile()
    mobile()

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
    startTime = Date.now()
    gameLoop()
})

const mobile = () => {
    if (window.innerWidth >= 600) {
        divControl.style.display = "none"
    }

    leftTop.addEventListener('touchstart', () => {
        if (pressButtonLT == false) {
            pressButtonLT = true
        }
    })
    leftTop.addEventListener('touchend', () => {
        if (pressButtonLT) {
            pressButtonLT = false
        }
    })

    leftBottom.addEventListener('touchstart', () => {
        if (pressButtonLB == false) {
            pressButtonLB = true
        }
    })
    leftBottom.addEventListener('touchend', () => {
        if (pressButtonLB) {
            pressButtonLB = false
        }
    })

    rightTop.addEventListener('touchstart', () => {
        if (pressButtonRT == false) {
            pressButtonRT = true
        }
    })
    rightTop.addEventListener('touchend', () => {
        if (pressButtonRT) {
            pressButtonRT = false
        }
    })

    rightBottom.addEventListener('touchstart', () => {
        if (pressButtonRB == false) {
            pressButtonRB = true
        }
    })
    rightBottom.addEventListener('touchend', () => {
        if (pressButtonRB) {
            pressButtonRB = false
        }
    })
}

const controlMobile = () => {
    if (pressButtonLT) {
        racket[0].y -= speedRacket
    }
    if (pressButtonLB) {
        racket[0].y += speedRacket
    }
    if (pressButtonRT) {
        racket[1].y -= speedRacket
    }
    if (pressButtonRB) {
        racket[1].y += speedRacket
    }
}

run = true
gameLoop()