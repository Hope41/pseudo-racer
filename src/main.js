'use strict'

function resize() {
    cvs.width = innerWidth * devicePixelRatio
    cvs.height = (innerHeight + 1) * devicePixelRatio
    game.resize()
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
const game = new Game()
const mounts = new Image()
mounts.src = 'src/mountains.png'

onresize = () => resize()
resize()
loop()