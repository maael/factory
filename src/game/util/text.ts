export function centerText(scene: Phaser.Scene, text: string, style?: any, offsetX = 0, offsetY = 0) {
  const screenCenterX = scene.cameras.main.worldView.x + scene.cameras.main.width / 2
  const screenCenterY = scene.cameras.main.worldView.y + scene.cameras.main.height / 2
  scene.add.text(screenCenterX + offsetX, screenCenterY + offsetY, text, style).setOrigin(0.5)
}
