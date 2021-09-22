import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import { Scene, SceneKey } from '~/types'

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
}

function gamePreload(this: Phaser.Scene) {
  log('from preload')
}

function gameCreate(this: Phaser.Scene) {
  // Thing
}

function gameUpdate(this: Phaser.Scene) {
  this.add.text(0, 0, 'Game!', { fontSize: '32px', color: '#FFFFFF' })
}
