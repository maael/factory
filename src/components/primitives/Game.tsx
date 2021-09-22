import * as React from 'react'
import initGame from '../../game'

export default function Game() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  React.useLayoutEffect(() => {
    let game
    if (canvasRef.current) {
      game = initGame(canvasRef.current)
    }
    return () => (game ? game() : undefined)
  }, [])
  return (
    <>
      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
      <canvas ref={canvasRef} />
    </>
  )
}
