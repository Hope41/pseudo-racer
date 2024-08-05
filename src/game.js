'use strict'
class Game {
    constructor() {
        this.level = [
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
            0,0,.5,
            1,1.5,2,2,2,2,2,2,1.5,1,.5,0,0,0,0,0,
            0,-.5,-1,-1,-1,-1,-1,-1,-1,
            -.5,0,.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,
            6.5,7,7.2,7.5,7.2,6.5,6,
            5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,.5,0,0,0,0,
        ]
        this.progress = 0
    }

    resize() {
        scale = (cvs.width + cvs.height) / 100
    }

    update() {
        hero.update()

        ctx.fillStyle = rgb(.6, .8, 1)
        ctx.fillRect(0, 0, cvs.width, cvs.height)

        const itr = 10
        const road = []
        const roadW = 3400
        const fov = .25
        const hillWidth = 4000
        const hillHeight = 30000
        let viewLimit = 40

        for (let i = 0; i < itr; i ++) {
            ctx.fillStyle = rgb(.6 + i / itr / 2, .8 + i / itr / 2, 1)
            ctx.fillRect(0, i * (cvs.height / itr) / 2 - hero.y * scale * 10, cvs.width, cvs.height)
        }

        const wid = cvs.width * .7
        const ratio = wid / mounts.width
        const ix = cvs.width / 2 - wid / 2 + hero.ang * scale * 10
        const iy = cvs.height / 2 + wid / 2 - hero.y * scale * 10
        ctx.drawImage(mounts, ix - wid * .7, iy, wid, -mounts.height * ratio)
        ctx.drawImage(mounts, ix, iy, wid, -mounts.height * ratio)
        ctx.drawImage(mounts, ix + wid * .7, iy, wid, -mounts.height * ratio)

        let roadX = 0
        let roadY = 0

        const calcHill = x => {
            return Math.sin(x / (50 + Math.cos(x / 30) * 30)) * 2
        }

        if (viewLimit > this.level.length) viewLimit = this.level.length
        for (let i = 0; i < viewLimit; i ++) {
            const diff = (i + Math.floor(hero.z)) % this.level.length
            const item = this.level[diff]

            let lerp_ = i - (hero.z % 1)
            if (lerp_ < fov) lerp_ = fov
            const pers = fov / lerp_
            const w = pers * roadW
            const hill = calcHill(diff)

            if (!i) {
                let last = diff - 1
                if (diff - 1 < 0) last = this.level.length - 1

                // Match hill
                hero.y = lerp(calcHill(last), hill, hero.z % 1)

                // Roll when turning corner
                const rot = this.level[last] - item
                // hero.roll += (rot - hero.roll) / 20 * dt
            }
            roadY += (hill - hero.y) * 500

            const x = cvs.width / 2 + (roadX - hero.x) * pers
            const y = cvs.height / 2 + (cvs.height * .7 + roadY) * pers

            road.push({x, y, w, diff})

            if (!i) {
                let last = item
                if (diff - 1 > 0) last = this.level[diff - 1]

                // Rotate to fit track
                hero.ang = lerp(last, item, hero.z % 1)

                // Go off track
                // hero.x -= (last - item) * 1000 * hero.vz
            }
            roadX -= (item - hero.ang) * 500
        }

        let oldX = road[viewLimit - 1].x
        let oldY = road[viewLimit - 1].y
        let oldW = road[viewLimit - 1].w

        const hillsAtSide = (x, z, m) => {
            let l = x / 3
            if (x < 0) l = -(x + (roadW / hillWidth)) / 3
            if (l > 1) l = 1

            const y = hero.roll * x * 2000 * m

            return {
                x: x * m * hillWidth,
                y: y + Math.sin(x + z / 4 + Math.cos(x / 20) * 4) * m * l * hillHeight * Math.sin(z / (11 + Math.sin(z / 40 + 3) * 15))}
        }

        for (let i = viewLimit; i --;) {
            if (i < 0) break
            const item = road[i]

            let lerp_ = i - (hero.z % 1)
            let pers = fov / lerp_
            let oldPers = fov / (lerp_ + 1)
            if (lerp_ < fov) {
                lerp_ = fov
                pers = 1
            }
            const light = .5 - .008 / pers
            const fade = .5 - light / 2
            const alpha = light * 30

            // const light = .008 / pers
            // const fade = .5 - light
            // const alpha = 5 - light * 5

            if (i < viewLimit - 1) {
                const cells = 10
                for (let j = cells; j --;) {
                    const f = 1 - Math.sin(j * 5 + item.diff * 5) * .05 - light
                    ctx.fillStyle = rgb(f, f, f, alpha)

                    let x = j
                    if (j > cells / 2) x = -(j - cells / 2) - (roadW / hillWidth)

                    const pos1 = hillsAtSide(x, item.diff, pers)
                    const pos2 = hillsAtSide(x + 1, item.diff, pers)
                    const pos3 = hillsAtSide(x + 1, item.diff + 1, oldPers)
                    const pos4 = hillsAtSide(x, item.diff + 1, oldPers)

                    ctx.beginPath()
                    ctx.moveTo(item.x + item.w / 2 + pos1.x, item.y + pos1.y)
                    ctx.lineTo(item.x + item.w / 2 + pos2.x, item.y + pos2.y)
                    ctx.lineTo(oldX + oldW / 2 + pos3.x, oldY + pos3.y)
                    ctx.lineTo(oldX + oldW / 2 + pos4.x, oldY + pos4.y)
                    ctx.fill()
                }

                // i -= Math.floor(i / 20)

                const y1 = item.y + hero.roll * -(roadW / hillWidth) * 2000 * pers
                const y2 = item.y + hero.roll * 2000 * pers
                const Y1 = oldY + hero.roll * 2000 * oldPers
                const Y2 = oldY + hero.roll * -(roadW / hillWidth) * 2000 * oldPers

                const k = Math.sin(item.diff * 99) * .05 + fade
                ctx.fillStyle = rgb(k, k, k, alpha)
                ctx.beginPath()
                ctx.moveTo(item.x - item.w / 2, y1)
                ctx.lineTo(item.x + item.w / 2, y2)
                ctx.lineTo(oldX + oldW / 2, Y1)
                ctx.lineTo(oldX - oldW / 2, Y2)
                ctx.fill()

                if (Math.sin(item.diff * 2) > .5) {
                    const size = .1
                    const h = fade + Math.sin(item.diff * 99) * .1
                    ctx.fillStyle = rgb(h, fade / 2, fade / 2, alpha)
                    ctx.beginPath()
                    ctx.moveTo(item.x - item.w / 2, y1)
                    ctx.lineTo(item.x - item.w / 2 + item.w * size, y1)
                    ctx.lineTo(oldX - oldW / 2 + oldW * size, Y1)
                    ctx.lineTo(oldX - oldW / 2, Y2)
                    ctx.fill()

                    ctx.beginPath()
                    ctx.moveTo(item.x + item.w / 2 - item.w * size, y1)
                    ctx.lineTo(item.x + item.w / 2, y1)
                    ctx.lineTo(oldX + oldW / 2, Y1)
                    ctx.lineTo(oldX + oldW / 2 - oldW * size, Y2)
                    ctx.fill()
                }

                else {
                    const line = .03
                    ctx.fillStyle = rgb(k * 2, k * 2, k * 2, alpha)
                    ctx.beginPath()
                    ctx.moveTo(item.x - item.w * line / 2, y1)
                    ctx.lineTo(item.x + item.w * line / 2, y1)
                    ctx.lineTo(oldX + oldW * line / 2, Y1)
                    ctx.lineTo(oldX - oldW * line / 2, Y2)
                    ctx.fill()
                }

                oldX = item.x
                oldY = item.y
                oldW = item.w
            }
        }
    }
}