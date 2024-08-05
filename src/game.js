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
        ]
        this.progress = 0
    }

    resize() {
        scale = (cvs.width + cvs.height) / 100
    }

    update() {
        hero.update()

        const itr = 10
        for (let i = 0; i < itr; i ++) {
            ctx.fillStyle = rgb(.6 + i / itr, .8 + i / itr, 1)
            ctx.fillRect(0, i * (cvs.height / itr) / 2, cvs.width, cvs.height)
        }

        const wid = cvs.width * .7
        const ratio = wid / mounts.width
        const ix = cvs.width / 2 - wid / 2 + hero.ang * scale * 10
        const iy = cvs.height / 2 + wid / 2.5 - hero.y * scale * 10
        ctx.drawImage(mounts, ix, iy, wid, -mounts.height * ratio)

        let roadX = 0
        let roadY = 0

        const calcHill = x => {
            return 0
        }

        const road = []
        for (let i = 0; i < this.level.length; i ++) {
            const diff = (i + Math.floor(hero.z)) % this.level.length
            const item = this.level[diff]

            let lerp_ = i - (hero.z % 1)
            if (lerp_ < 0) lerp_ = 0
            const pers = 1 / lerp_
            const w = cvs.width / 2 * pers * 2
            const hill = calcHill(diff)

            if (!i) {
                let last = diff - 1
                if (diff - 1 < 0) last = this.level.length - 1
                hero.y = lerp(calcHill(last), hill, hero.z % 1)
            }
            roadY += (hill - hero.y) * 500

            const x = cvs.width / 2 + (roadX - hero.x) * pers
            const y = cvs.height / 2 + (cvs.height / 2 + roadY) * pers

            road.push({x, w, y, diff})

            if (!i) {
                let last = item
                if (diff - 1 > 0) last = this.level[diff - 1]
                hero.ang = lerp(last, item, hero.z % 1)

                // Go off track
                // hero.x -= (last - item) * 1000 * hero.vz
            }
            roadX -= (item - hero.ang) * 500
        }

        
        let oldX = 0
        let oldY = 0
        let oldW = 0

        const hillsAtSide = (x, z, m) => {
            let l = x / 3
            if (l > 1) l = 1
            return {
                x: x * m,
                y: Math.sin(x + z / 4) * m * l}
        }

        for (let i = road.length; i --;) {
            if (i < 0) break
            const item = road[i]

            let lerp_ = i - (hero.z % 1)
            if (lerp_ < 0) lerp_ = 0
            const pers = 1 / lerp_
            const oldPers = 1 / (lerp_ + 1)

            if (i < road.length - 1) {
                // const f = 1 - Math.sin(item.diff * 99) * .5 - (.005 / oldPers)
                // ctx.fillStyle = rgb(f, f, f)
                // ctx.fillRect(0, oldY, cvs.width, cvs.height)

                const cells = 10
                for (let j = cells; j --;) {
                    let x = j
                    if (j >= cells / 2) x = -(j - cells / 2) - 3

                    const p = 1000
                    const pos1 = hillsAtSide(x, item.diff, pers * p)
                    const pos2 = hillsAtSide(x + 1, item.diff, pers * p)
                    const pos3 = hillsAtSide(x + 1, item.diff + 1, oldPers * p)
                    const pos4 = hillsAtSide(x, item.diff + 1, oldPers * p)

                    const f = .9 - Math.sin(j * 5 + item.diff * 5) * .1 + .005 / pers
                    ctx.fillStyle = rgb(f, f, f)
                    ctx.lineWidth = oldPers
                    ctx.beginPath()
                    ctx.moveTo(item.x + item.w / 2 + pos1.x, item.y + pos1.y)
                    ctx.lineTo(item.x + item.w / 2 + pos2.x, item.y + pos2.y)
                    ctx.lineTo(oldX + oldW / 2 + pos3.x, oldY + pos3.y)
                    ctx.lineTo(oldX + oldW / 2 + pos4.x, oldY + pos4.y)
                    ctx.fill()
                    ctx.stroke()
                }

                i -= Math.floor(i / 30)

                const k = .4 + Math.sin(item.diff * 99) * .05 + .05 / pers
                ctx.fillStyle = rgb(k, k, k)
                ctx.beginPath()
                ctx.moveTo(item.x - item.w / 2, item.y)
                ctx.lineTo(item.x + item.w / 2, item.y)
                ctx.lineTo(oldX + oldW / 2, oldY)
                ctx.lineTo(oldX - oldW / 2, oldY)
                ctx.lineTo(item.x - item.w / 2, item.y)
                ctx.fill()
            }

            oldX = item.x
            oldY = item.y
            oldW = item.w
        }
    }
}