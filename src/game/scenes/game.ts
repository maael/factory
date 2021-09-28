import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import { Scene, SceneKey } from '~/types'
import Player from '~/game/entities/player'

let map: Phaser.Tilemaps.Tilemap
let player: Player
let marker: Phaser.GameObjects.Graphics
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
  player = new Player(this, { ...this.input.keyboard.createCursorKeys(), sprint: this.input.keyboard.addKey('shift') })
  player.init()
}

function gamePreload(this: Phaser.Scene) {
  log('from preload')
  this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 })
  this.load.image('basic-tiles', 'assets/tilemaps/tiles/basic-tiles_extruded.png')
  player.preload()
}

enum Tiles {
  Grass = 0,
  Water = 1,
  Trees = 3,
}

function gameCreate(this: Phaser.Scene) {
  this.cameras.roundPixels = true
  this.cameras.main.zoomTo(2, 0)
  this.scene.run(SceneKey.Hud)
  this.scene.bringToTop(SceneKey.Hud)
  map = this.make.tilemap({ key: 'generated', tileWidth: 16, tileHeight: 16, width: 500, height: 500 })
  const tileset = map.addTilesetImage('basic-tiles', 'basic-tiles', 16, 16, 1, 2)
  const groundLayer = map.createBlankLayer('ground', tileset)
  const groundEmbellishmentLayer = map.createBlankLayer('ground-embellishments', tileset)
  map.setLayer(groundLayer)
  groundLayer.fill(Tiles.Grass)
  groundLayer.fill(Tiles.Water, 10, 10, 10, 10)
  groundEmbellishmentLayer.fill(Tiles.Trees, 25, 5, 10, 10)
  groundLayer.setPipeline('Light2D')
  groundEmbellishmentLayer.setPipeline('Light2D')
  player.create()

  this.lights.enable().setAmbientColor(0x999999)

  map.setCollision([Tiles.Water], undefined, undefined, groundLayer)
  map.setCollision([Tiles.Trees], undefined, undefined, groundEmbellishmentLayer)
  this.matter.world.convertTilemapLayer(groundLayer)
  this.matter.world.convertTilemapLayer(groundEmbellishmentLayer)
  this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  this.cameras.main.startFollow(player.sprite)

  marker = this.add
    .graphics()
    .lineStyle(1, 0x000000, 0.5)
    .strokeRect(0, 0, map.tileWidth * groundLayer.scaleX, map.tileHeight * groundLayer.scaleY)
    .setVisible(false)
}

let leftButtonBeenDown = false

function gameUpdate(this: Phaser.Scene, time: number, delta: number) {
  player.update(time, delta)

  if (this.input.activePointer.leftButtonDown()) {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2
    const pointerTileX = map.worldToTileX(worldPoint.x)
    const pointerTileY = map.worldToTileY(worldPoint.y)

    const newMarkerX = map.tileToWorldX(pointerTileX)
    const newMarkerY = map.tileToWorldY(pointerTileY)

    if (newMarkerY !== marker.y || newMarkerX !== marker.x || (!marker.visible && !leftButtonBeenDown)) {
      marker.setVisible(true)
      marker.x = newMarkerX
      marker.y = newMarkerY

      let hoveredTile: Phaser.Tilemaps.Tile | null = null
      map.layers.forEach((layer) => {
        const tile = map.getTileAt(pointerTileX, pointerTileY, undefined, layer.name)
        if (tile && (!hoveredTile || (hoveredTile && hoveredTile.index < tile.index))) {
          hoveredTile = tile
        }
      })

      if (hoveredTile) {
        const tile: Phaser.Tilemaps.Tile = hoveredTile
        this.scene.manager.game.events.emit('show-tile-info', { name: Tiles[tile.index], pointerTileX, pointerTileY })
      }
    } else if (marker.visible && !leftButtonBeenDown) {
      marker.setVisible(false)
      this.scene.manager.game.events.emit('show-tile-info', undefined)
    }
    leftButtonBeenDown = true
  } else if (leftButtonBeenDown && this.input.activePointer.leftButtonReleased()) {
    leftButtonBeenDown = false
  }
}
