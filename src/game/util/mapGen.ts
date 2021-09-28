import { Tiles } from '~/types'
import { perlin, initWeightedChoice, randomBoolean } from '~/game/util/rnd'

export function generateMap(width: number, height: number) {
  const ground = generateGround(width, height)
  const embellished = generateEmbellishments(width, height, ground)
  return { ground, embellished }
}

function isTile(index?: number) {
  return index ? Object.values(Tiles).includes(index) : false
}

function generateEmbellishments(width: number, height: number, ground: Tiles[][]) {
  const mapArr: (number | undefined)[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => perlin(x, y))
  )
  const getDirtChoice = initWeightedChoice({ [Tiles.GoldOre]: 0.005, [Tiles.SilverOre]: 0.05 }, 4, { castNumber: true })
  const getGrassChoice = initWeightedChoice({ [Tiles.SilverOre]: 0.005, [Tiles.Trees]: 0.05 }, 10, { castNumber: true })
  for (let y = 0; y < mapArr.length; y++) {
    for (let x = 0; x < mapArr[y].length; x++) {
      // const val = mapArr[y][x]!
      const groundTile = ground[y][x]
      if (groundTile === Tiles.Grass) {
        const choice = getGrassChoice()
        if (choice) {
          genCluster(mapArr, x, y, choice, choice === Tiles.Trees ? 4 : 2, 80)
        } else if (!isTile(mapArr[y][x])) {
          mapArr[y][x] = undefined
        }
      } else if (groundTile === Tiles.Dirt) {
        const choice = getDirtChoice()
        if (choice) {
          genCluster(mapArr, x, y, choice, 2, 80)
        } else if (!isTile(mapArr[y][x])) {
          mapArr[y][x] = undefined
        }
      } else {
        mapArr[y][x] = undefined
      }
    }
  }
  return mapArr as number[][]
}

function generateGround(width: number, height: number) {
  const mapArr = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => perlin(x, y)))
  for (let y = 0; y < mapArr.length; y++) {
    for (let x = 0; x < mapArr[y].length; x++) {
      const val = mapArr[y][x]
      if (val < -0.3) {
        mapArr[y][x] = Tiles.Water
      } else if (val < -0.2) {
        mapArr[y][x] = Tiles.Sand
      } else if (val > 0.4) {
        mapArr[y][x] = Tiles.Dirt
      } else {
        mapArr[y][x] = Tiles.Grass
      }
    }
  }
  return mapArr
}

function genCluster(
  mapArr: (number | undefined)[][],
  centerX: number,
  centerY: number,
  tile: Tiles,
  areaSize: number,
  probability: number
) {
  for (let y = centerY - areaSize; y < centerY + areaSize; y++) {
    for (let x = centerX - areaSize; x < centerX + areaSize; x++) {
      if (mapArr[y] && mapArr[y][x] && randomBoolean(probability)) {
        mapArr[y][x] = tile
      }
    }
  }
}
