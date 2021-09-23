import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import { Scene, SceneKey } from '~/types'

export class HudScene extends Phaser.Scene implements Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({ ...config, key: SceneKey.Hud })
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
  this.add.rectangle(135, 25, 100, 6, 0xff0000, 1)
  this.add.text(20, 20, 'Health', { fontSize: '16px', color: '#FFFFFF' })

  this.add.text(this.cameras.main.width - 250, 20, 'Journal', { fontSize: '16px', color: '#FFFFFF' })

  this.add.text(this.cameras.main.width - 250, this.cameras.main.height - 250, 'Build', {
    fontSize: '16px',
    color: '#FFFFFF',
  })

  this.add.text(20, this.cameras.main.height - 250, 'Actions', { fontSize: '16px', color: '#FFFFFF' })
}

function gameUpdate(this: Phaser.Scene, _time: number, _delta: number) {
  /*Do nothing*/
}
