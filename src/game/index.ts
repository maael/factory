import * as Phaser from 'phaser'

function log(...args: any[]) {
  console.info(`[${new Error().stack?.split('\n')[1].split('@')[0]}]`, ...args)
}

export default function init(canvas: HTMLCanvasElement) {
  const config: Phaser.Types.Core.GameConfig = {
    canvas,
    type: Phaser.CANVAS,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    scene: [IntroScene, GameScene],
    banner: false,
  }
  log('initialising game')
  const game = new Phaser.Game(config)
  return function destroy() {
    log('destroying game')
    game.destroy(false)
  }
}

interface Scene {
  init?: Phaser.Types.Scenes.SceneInitCallback
  preload?: Phaser.Types.Scenes.ScenePreloadCallback
  create?: Phaser.Types.Scenes.SceneCreateCallback
  update?: Phaser.Types.Scenes.SceneUpdateCallback
}

class IntroScene extends Phaser.Scene implements Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({ ...config, key: 'intro' })
    log(config)
  }

  init = (data) => introInit.call(this, data)
  preload = () => introPreload.call(this)
  create = (data) => introCreate.call(this, data)
  update = () => introUpdate.call(this)
}

function introInit(this: Phaser.Scene) {
  log('from init')
}

function introPreload(this: Phaser.Scene) {
  log('from preload')
}

function introCreate(this: Phaser.Scene) {
  // Thing
}

function introUpdate(this: Phaser.Scene) {
  this.add.text(0, 0, 'Hello World???', { fontSize: '32px', color: '#FFFFFF' })
}

class GameScene extends Phaser.Scene implements Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super({ ...config, key: 'game' })
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
