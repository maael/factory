import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import { Scene, SceneKey } from '~/types'
import { centerText } from '../util/text'

interface Intro {
  SKIP_KEY?: Phaser.Input.Keyboard.Key
}

type FullScene = Phaser.Scene & Scene & Intro

export class IntroScene extends Phaser.Scene implements Scene, Intro {
  static isStart = true
  SKIP_KEY
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({ ...config, key: SceneKey.Intro })
    log(config)
  }

  init = (data) => introInit.call(this, data)
  preload = () => introPreload.call(this)
  create = (data) => introCreate.call(this, data)
  update = () => introUpdate.call(this)
}

function introInit(this: FullScene) {
  log('from init')
}

function introPreload(this: FullScene) {
  log('from preload')
}

function introCreate(this: FullScene) {
  this.SKIP_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  centerText(this, 'Factory', { fontSize: '32px', color: '#FFFFFF' }, 0, -20)
  centerText(this, 'Press space to start...', { fontSize: '32px', color: '#FFFFFF' }, 0, 20)
}

function introUpdate(this: FullScene) {
  if (this.SKIP_KEY?.isDown) {
    this.scene.switch(SceneKey.Game)
  }
}
