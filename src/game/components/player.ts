import * as Phaser from 'phaser'

interface Controls {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
}

export default class Player {
  scene: Phaser.Scene
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  light: Phaser.GameObjects.Light
  controls: Controls
  constructor(scene: Phaser.Scene, controls: Controls) {
    this.scene = scene
    this.controls = controls
  }

  init = () => {
    /*Do nothing*/
  }

  preload = () => {
    this.scene.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 })
  }

  create = () => {
    this.sprite = this.scene.physics.add.sprite(50, 100, 'player', 1)
    this.light = this.scene.lights.addLight(this.sprite.x, this.sprite.y, 300, 0xffffff, 0.5).setScrollFactor(1)
    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1,
    })
    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1,
    })
    this.scene.anims.create({
      key: 'up',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
      frameRate: 10,
      repeat: -1,
    })
    this.scene.anims.create({
      key: 'down',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1,
    })
  }

  update = (_time: number, _delta: number) => {
    this.sprite.body.setVelocity(0)
    let animationDirection
    if (this.controls.up.isDown) {
      this.sprite.body.setVelocityY(-100)
      animationDirection = 'up'
    }
    if (this.controls.down.isDown) {
      this.sprite.body.setVelocityY(100)
      animationDirection = 'down'
    }
    if (this.controls.left.isDown) {
      this.sprite.body.setVelocityX(-100)
      animationDirection = 'left'
    }
    if (this.controls.right.isDown) {
      this.sprite.body.setVelocityX(100)
      animationDirection = 'right'
    }
    if (animationDirection) {
      this.sprite.anims.play(animationDirection, true)
    }
    if (this.sprite.body.velocity.x === 0 && this.sprite.body.velocity.y === 0) {
      this.sprite.anims.stop()
    }
    this.light.x = this.sprite.x
    this.light.y = this.sprite.y
  }
}
