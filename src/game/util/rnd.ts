import { Noise } from 'noisejs'

const noise = new Noise(27)

export const perlin: (x: number, y: number) => number = (x, y) => noise.perlin2(x / 100, y / 100)
