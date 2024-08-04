'use strict'
class Game {
    constructor() {
        this.level = [
            0,0,
            1,1,1,1,.5,0,-.5,-1,-1,-1,-1,-1,0,0,0,0,
            1,1,1,1,.5,0,-.5,-1,-1,-1,-1,-1,0,0,0,0,
            3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,
        ]
        this.progress = 0
        this.camX = 0
    }

    resize() {
        scale = cvs.width + cvs.height / 100
    }

    update() {
        this.progress = time / 10

        let roadX = 0
        let oldX = 0
        let oldY = 0
        let oldW = 0
        let oldRoad = 0

        let oft = 0

        for (let i = 0; i < this.level.length; i ++) {
            const diff = (i + Math.floor(this.progress)) % this.level.length
            const item = this.level[diff]

            let lerp = i - (this.progress % 1)
            if (lerp < 0) lerp = 0
            const pers = 1 / lerp
            const width = cvs.width / 2 * pers

            const g = Math.sin(diff * 9) * .5
            ctx.fillStyle = rgb(g, g, g)

            // ctx.fillRect(
            //     cvs.width / 2 + roadX - width / 2,
            //     cvs.height / 2 + pers * cvs.height / 2,
            //     width,
            //     50 * pers)

            const x = cvs.width / 2 + roadX * pers
            const y = cvs.height / 2 + pers * cvs.height / 2
            ctx.beginPath()
            ctx.moveTo(x - width / 2, y)
            ctx.lineTo(x + width / 2, y)
            ctx.lineTo(oldX + oldW / 2, oldY)
            ctx.lineTo(oldX - oldW / 2, oldY)
            ctx.fill()

            oldX = x
            oldY = y
            oldW = width

            if (!i) oft = item
            roadX += (item - oft) * 500
        }

        // this.camX = this.level[Math.floor(this.progress)] * 500
    }
}