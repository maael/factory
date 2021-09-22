import * as Phaser from 'phaser'
import { log } from '~/game/util/log'
import * as Scenes from '~/game/scenes'

export default function init(canvas: HTMLCanvasElement) {
  const config: Phaser.Types.Core.GameConfig = {
    canvas,
    type: Phaser.CANVAS,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    scene: Object.values(Scenes).sort((a) => ((a as any).isStart ? -1 : (a as any).isStart ? 1 : 0)),
    banner: false,
  }
  log('initialising game')
  const game = new Phaser.Game(config)
  return function destroy() {
    log('destroying game')
    game.destroy(false)
  }
}
