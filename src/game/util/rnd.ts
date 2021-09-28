import { Noise } from 'noisejs'
import seedrandom from 'seedrandom'

const noise = new Noise(1994)
const rng = seedrandom(`${1994}`)

export const perlin: (x: number, y: number) => number = (x, y) => noise.perlin2(x / 10, y / 10)

export function initWeightedChoice<ChoiceType extends string | number>(
  choices: Record<ChoiceType, number>,
  emptyWeight?: number,
  options: { castNumber?: boolean } = {}
) {
  // Entries changes type to string :(
  const data = Object.entries(choices) as [ChoiceType | undefined, number][]
  if (emptyWeight) {
    data.push([undefined, emptyWeight])
  }
  let total = 0
  for (let i = 0; i < data.length; ++i) {
    total += data[i][1]
  }
  function toValue(value: any) {
    return value === undefined ? value : options.castNumber ? Number(value) : value
  }
  return function get() {
    const threshold = rng() * total
    let instanceTotal = 0
    for (let i = 0; i < data.length - 1; ++i) {
      instanceTotal += data[i][1]
      if (instanceTotal >= threshold) {
        return toValue(data[i][0])
      }
    }
    return toValue(data[data.length - 1][0])
  }
}

export function randomBoolean(split: number, max = 100) {
  const rnd = rng() * max
  return !!(rnd < split)
}
