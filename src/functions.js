'use strict'

function decimal(seed) {
    const whole = 2038074743
    seed *= 15485863
    return ((seed * seed * seed % whole + whole) % whole) / whole
}

function prng(min, max, seed) {
    return min + decimal(seed) * (max - min)
}

function random(min, max) {
    return min + Math.random() * (max - min)
}

function rgb(r, g, b, a = 1) {
    return 'rgb('+r*255+','+g*255+','+b*255+','+a+')'
}