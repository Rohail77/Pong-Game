import { Slider } from './slider.js'
import { ball } from './ball.js'
import { controller } from './controller.js'
import { Sound } from './sound.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

/* 
This Must Hold: 
(ball.y - ball.rad) - (topSlider.y + topSlider.h) / dy === 0 
*/

/**  Clear Canvas **/
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

/** Display Initial Timer Before Starting Game **/
const startGame = () => {
  animateCanvasUp()
  setCanvasObjects()
  setTimeout(() => {
    const prompt = document.querySelector('.prompt');
    prompt.id = 'start'
    prompt.innerHTML = 'Starts in  '
    const timer = document.getElementById('timer')
    timer.style.display = 'block'

    let count = 3
    timer.innerHTML = `${count} s`
    let id = setInterval(displayTime, 1000)

    function displayTime() {
      timer.innerHTML = `${--count} s`
      if (count === 0) {
        clearInterval(id)
        timer.style.display = 'none'
        prompt.innerHTML = 'Play!'
        requestAnimationFrame(update)
      }
    }
  }, 1000)
}

const startGameBtn = document.getElementById('start-game-btn')
startGameBtn.addEventListener('click', startGame)

let topSlider, bottomSlider
/** Set The Properties of Sliders And Ball And make Canvas **/
const setCanvasObjects = () => {
  clearCanvas()
  // initialize top and bottom sliders
  topSlider = new Slider('TOP')
  bottomSlider = new Slider('BOTTOM')
  topSlider.draw()
  bottomSlider.draw()
  ball.setProperties()
  ball.draw()
}

/** Update Canvas **/
const update = () => {
  clearCanvas()

  ball.draw()
  topSlider.draw()
  bottomSlider.draw()
  if (isGameOver()) return
  ball.newPosition()

  executeMoves()

  requestAnimationFrame(update)
}

/** Execute Slider Moves **/
const executeMoves = () => {
  Object.keys(controller).forEach(key => {
    if (controller[key].pressed) {
      controller[key].move()
      topSlider.detectWalls()
      bottomSlider.detectWalls()
    }
  })
}

const keydown = e => {
  if (controller[e.keyCode]) {
    controller[e.keyCode].pressed = true
  }
}

const keyup = e => {
  if (controller[e.keyCode]) {
    controller[e.keyCode].pressed = false
  }
}

document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)

/** Check If Game Is Over **/
const isGameOver = () => {
  // ball hit the top OR bottom wall
  if (ball.y <= 0 || ball.y >= canvas.height) {
    ball.stop()
    const gameOverSound = new Sound(
      document.createElement('audio'),
      'media/game_over.wav'
    )
    gameOverSound.play()
    updateMessages()
    return true
  }
}

/** Update Messages When Game Is Over **/
const updateMessages = () => {
  const prompt = document.querySelector('.prompt')
  prompt.innerHTML = 'Game Over'
  prompt.id = 'over'
  startGameBtn.innerHTML = 'Play Again'
  animateCanvasDown()
}

/** Use the gsap animation library **/
let tl

/**  Set A Different Animation For Screen Width >= 800px **/
const setBigScreenAnimationTimeline = () => {
  tl = gsap.timeline()
    tl.to('#start-game-btn', {
      opacity: 0,
      duration: 0.5,
    })
    .to('.controller', { opacity: 0, duration: 0.5})
  tl.pause()
}

/** x Set A Different Animation For Screen Width < 800px **/
const setSmallScreenAnimationTimeline = () => {
  tl = gsap.timeline()
  tl.to('#start-game-btn', {
    opacity: 0,
    duration: 0.5,
  })
    .to('.controller', { opacity: 0, duration: 0.5 }, '-=0.5')
  tl.pause()
}

// On page reload, set animations depending on the screen width
if (screen.width < 800) {
  canvas.width = 458
  setSmallScreenAnimationTimeline()
} else {
  canvas.width = 506
  setBigScreenAnimationTimeline()
}

/** On Resize Of Screen Width, Check The Width And Set Appropriate
 *  Animation For That Width **/
addEventListener('resize', () => {
  // if screen size < 800px
  if (screen.width < 800) {
    // canvas.height = 5;
    canvas.width = 458
    setSmallScreenAnimationTimeline()
  }
  // if screen size >= 800px
  else {
    canvas.width = 506
    setBigScreenAnimationTimeline()
  }
})

const animateCanvasUp = () => {
  tl.play()
}

const animateCanvasDown = () => {
  tl.reverse()
}

export { topSlider, bottomSlider }
