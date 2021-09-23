import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import * as Scenes from '~/game/scenes'

const orderedScenes = Object.values(Scenes).sort((a, b) => ((a as any).isStart ? -1 : (b as any).isStart ? 1 : 0))

export default function init() {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    scene: orderedScenes,
    banner: false,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    },
  }
  log('initialising game')
  const game = new Phaser.Game(config)
  return function destroy() {
    log('destroying game')
    game.destroy(false)
  }
}
