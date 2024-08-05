'use strict'

function resize() {
    cvs.width = innerWidth * devicePixelRatio
    cvs.height = (innerHeight + 1) * devicePixelRatio
    game.resize()
}

function press(e, bool) {
    if (e.repeat) return

    key.press = bool
    if (e.code == 'ArrowUp' || e.code == 'KeyW' || e.code == 'KeyZ') key.up = bool
    if (e.code == 'ArrowLeft' || e.code == 'KeyA' || e.code == 'KeyQ') key.left = bool
    if (e.code == 'ArrowDown' || e.code == 'KeyS') key.down = bool
    if (e.code == 'ArrowRight' || e.code == 'KeyD') key.right = bool
}

function loop() {
    dt = (performance.now() - oldPerf) / 16
    oldPerf = performance.now()
    if (dt > 1) dt = 1
    time += dt

    game.update()

    requestAnimationFrame(loop)
}

let dt = 0
let oldPerf = 0
let scale = 0
let time = 0

const cvs = document.getElementById('cvs')
const ctx = cvs.getContext('2d')
const hero = new Hero()
const game = new Game()
const mounts = new Image()
const key = {up: 0, down: 0, left: 0, right: 0}

mounts.src = 'src/mounts.png'

onresize = () => resize()
onkeydown = e => press(e, 1)
onkeyup = e => press(e, 0)

resize()
loop()
onload = () => scrollTo(0, 0)