import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import { Scene, SceneKey, Tiles } from '~/types'
import Player from '~/game/entities/player'
import { tileNameMap } from '~/game/util/mappers'
import { generateMap } from '~/game/util/mapGen'

let map: Phaser.Tilemaps.Tilemap
let player: Player
let marker: Phaser.GameObjects.Container
export class GameScene extends Phaser.Scene implements Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({ ...config, key: SceneKey.Game })
    log(config)
  }

  init = (data) => gameInit.call(this, data)
  preload = () => gamePreload.call(this)
  create = (data) => gameCreate.call(this, data)
  update = () => gameUpdate.call(this)
}

function gameInit(this: Phaser.Scene) {
  log('from init')
  player = new Player(this, {
    left: this.input.keyboard.addKey('a'),
    right: this.input.keyboard.addKey('d'),
    up: this.input.keyboard.addKey('w'),
    down: this.input.keyboard.addKey('s'),
    sprint: this.input.keyboard.addKey('shift'),
  })
  player.init()
}

function gamePreload(this: Phaser.Scene) {
  log('from preload')
  this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 })
  this.load.image('basic-tiles', 'assets/tilemaps/tiles/basic-tiles_extruded.png')
  player.preload()
}

const worldSize = { width: 100, height: 100 }

function gameCreate(this: Phaser.Scene) {
  this.input.mouse.disableContextMenu()
  this.cameras.roundPixels = true
  this.cameras.main.zoomTo(2, 0)
  this.scene.run(SceneKey.Hud)
  this.scene.bringToTop(SceneKey.Hud)
  map = this.make.tilemap({
    key: 'generated',
    tileWidth: 16,
    tileHeight: 16,
    width: worldSize.width,
    height: worldSize.height,
  })
  const tileset = map.addTilesetImage('basic-tiles', 'basic-tiles', 16, 16, 1, 2)
  const groundLayer = map.createBlankLayer('ground', tileset)
  const groundEmbellishmentLayer = map.createBlankLayer('ground-embellishments', tileset)
  const mapTiles = generateMap(worldSize.width, worldSize.height)
  groundLayer.setData('height', 0)
  groundLayer.putTilesAt(mapTiles.ground, 0, 0)
  groundEmbellishmentLayer.setData('height', 1)
  groundEmbellishmentLayer.putTilesAt(mapTiles.embellished, 0, 0)
  groundLayer.setPipeline('Light2D')
  groundEmbellishmentLayer.setPipeline('Light2D')
  map.setLayer(groundLayer)
  player.create()

  this.lights.enable().setAmbientColor(0x999999)

  map.setCollision([Tiles.Water], true, true, groundLayer)
  map.setCollision([Tiles.Trees], true, true, groundEmbellishmentLayer)
  this.matter.world.convertTilemapLayer(groundLayer)
  this.matter.world.convertTilemapLayer(groundEmbellishmentLayer)
  this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  this.cameras.main.startFollow(player.sprite)

  marker = this.add
    .container()
    .add(
      this.add
        .graphics()
        .lineStyle(1, 0x000000, 0.7)
        .strokeCircle(0, 0, map.tileWidth / 2)
    )
    .setVisible(false)
    .add(
      this.add
        .graphics()
        .lineStyle(1, 0x000000, 0.5)
        .strokeCircle(0, 0, map.tileWidth / 2 + 2)
    )
    .setVisible(false)

  this.tweens.add({
    targets: marker,
    duration: 2000,
    ease: 'linear',
    yoyo: true,
    repeat: Infinity,
    scale: 1.2,
  })
}

let inspectButtonBeenDown = false

function gameUpdate(this: Phaser.Scene, time: number, delta: number) {
  player.update(time, delta)

  if (this.input.activePointer.rightButtonDown()) {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2
    const pointerTileX = map.worldToTileX(worldPoint.x)
    const pointerTileY = map.worldToTileY(worldPoint.y)

    const newMarkerX = map.tileToWorldX(pointerTileX) + 16 / 2
    const newMarkerY = map.tileToWorldY(pointerTileY) + 16 / 2

    if (newMarkerY !== marker.y || newMarkerX !== marker.x || (!marker.visible && !inspectButtonBeenDown)) {
      marker.setVisible(true)
      marker.x = newMarkerX
      marker.y = newMarkerY

      let hoveredTile: Phaser.Tilemaps.Tile | null = null
      map.layers.forEach((layer) => {
        const tile = map.getTileAt(pointerTileX, pointerTileY, undefined, layer.name)
        if (
          tile &&
          tile.index !== undefined &&
          (!hoveredTile ||
            tile.layer.tilemapLayer.data.get('height') > hoveredTile.layer.tilemapLayer.data.get('height'))
        ) {
          hoveredTile = tile
        }
      })

      if (hoveredTile) {
        const tile: Phaser.Tilemaps.Tile = hoveredTile
        this.scene.manager.game.events.emit('show-tile-info', {
          tileIndex: tile.index,
          name: tileNameMap[tile.index],
          pointerTileX,
          pointerTileY,
        })
      }
    } else if (marker.visible && !inspectButtonBeenDown) {
      marker.setVisible(false)
      this.scene.manager.game.events.emit('show-tile-info', undefined)
    }
    inspectButtonBeenDown = true
  } else if (inspectButtonBeenDown && this.input.activePointer.rightButtonReleased()) {
    inspectButtonBeenDown = false
  }
}
