'use strict'

class Hero {
    constructor() {
        this.z = 0
        this.vz = 0
        this.x = 0
        this.y = 0
        this.ang = 0
    }

    update() {
        if (key.up) this.vz += .003 * dt
        if (key.down) this.vz -= .001 * dt
        this.vz *= Math.pow(.98, dt)
        this.z += this.vz

        const move = 300
        if (key.left) this.x -= move * this.vz * dt
        if (key.right) this.x += move * this.vz * dt

        // this.z += dt * .05
    }
}