export interface Scene {
  isStart?: boolean
  init?: Phaser.Types.Scenes.SceneInitCallback
  preload?: Phaser.Types.Scenes.ScenePreloadCallback
  create?: Phaser.Types.Scenes.SceneCreateCallback
  update?: Phaser.Types.Scenes.SceneUpdateCallback
}

export enum SceneKey {
  Intro = 'Intro',
  Game = 'Game',
  Hud = 'Hud',
  Settings = 'Settings',
}
