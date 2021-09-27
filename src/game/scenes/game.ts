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
  this.load.image('basic-tiles', 'assets/tilemaps/tiles/basic-tiles.png')
  this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv')
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
  const tileset = map.addTilesetImage('basic-tiles', 'basic-tiles')
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
  this.physics.add.collider(player.sprite, groundLayer)
  this.physics.add.collider(player.sprite, groundEmbellishmentLayer)
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  this.cameras.main.startFollow(player.sprite)
}

function gameUpdate(this: Phaser.Scene, time: number, delta: number) {
  player.update(time, delta)
}
