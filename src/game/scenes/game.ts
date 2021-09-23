import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import { Scene, SceneKey } from '~/types'
import Player from '~/game/components/player'

let map: Phaser.Tilemaps.Tilemap
let player: Player
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
  player = new Player(this, this.input.keyboard.createCursorKeys())
  player.init()
}

function gamePreload(this: Phaser.Scene) {
  log('from preload')
  this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 })
  this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png')
  this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv')
  player.preload()
}

function gameCreate(this: Phaser.Scene) {
  this.cameras.roundPixels = true
  this.cameras.main.zoomTo(2, 0)
  this.scene.run(SceneKey.Hud)
  this.scene.bringToTop(SceneKey.Hud)
  map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 })
  const tileset = map.addTilesetImage('tiles', 'tiles')
  const layer = map.createLayer(0, tileset, 0, 0).setPipeline('Light2D')
  player.create()

  this.lights.enable().setAmbientColor(0x999999)

  map.setCollisionBetween(54, 83)
  this.physics.add.collider(player.sprite, layer)
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  this.cameras.main.startFollow(player.sprite)
}

function gameUpdate(this: Phaser.Scene, time: number, delta: number) {
  player.update(time, delta)
}
