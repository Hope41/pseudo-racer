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
        this.camAng = 0
    }

    resize() {
        scale = (cvs.width + cvs.height) / 100
    }

    update() {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cvs.width, cvs.height)

        const ratio = cvs.width / mounts.width
        ctx.drawImage(mounts, this.camAng * scale * 15, cvs.height * 1.5, cvs.width, -mounts.height * ratio)

        this.progress = time / 10

        let roadX = 0
        let oldX = 0
        let oldY = 0
        let oldW = 0

        const itr = 10
        for (let i = 0; i < itr; i ++) {
            ctx.fillStyle = rgb(1, 1, 1, i / itr)
            ctx.fillRect(0, cvs.height / 2 + i * scale * .2 - itr * scale * .2, cvs.width, cvs.height)
        }

        for (let i = 0; i < this.level.length; i ++) {
            const diff = (i + Math.floor(this.progress)) % this.level.length
            const item = this.level[diff]

            let lerp_ = i - (this.progress % 1)
            if (lerp_ < 0) lerp_ = 0
            const pers = 1 / lerp_
            const width = cvs.width / 2 * pers
            const x = cvs.width / 2 + roadX * pers
            const y = cvs.height / 2 + pers * cvs.height / 2

            // Lines
            ctx.fillStyle = rgb(0, 0, 0, pers > 1 ? 1 : pers)
            ctx.fillRect(0, y, cvs.width, pers * 10)

            // Fill
            ctx.fillStyle = rgb(
                .1 + Math.sin(diff * 9) * .2,
                .1 + Math.sin(diff * 9) * .4,
                .1 + Math.sin(diff * 9) * .2,
                .8)

            ctx.beginPath()
            ctx.moveTo(x - width / 2, y)
            ctx.lineTo(x + width / 2, y)
            ctx.lineTo(oldX + oldW / 2, oldY)
            ctx.lineTo(oldX - oldW / 2, oldY)
            ctx.lineTo(x - width / 2, y)
            ctx.fill()

            oldX = x
            oldY = y
            oldW = width

            if (!i) {
                let last = item
                if (diff - 1 > 0) last = this.level[diff - 1]
                // this.camAng += (last - item) / 10
                this.camAng = -lerp(last, item, this.progress % 1)

                // if (old != Math.round(this.progress)) {
                //     this.camAng = -item
                //     old = Math.round(this.progress)
                // }
            }
            roadX += (item + this.camAng) * 500
        }
    }
}