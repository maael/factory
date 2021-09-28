import * as React from 'react'
import initGame from '../../game'

// @refresh reset

export default function Game() {
  React.useEffect(() => {
    console.info('redo')
    const game = initGame()
    return () => {
      console.info('destroy')
      if (game) game()
    }
  }, [])
  return (
    <>
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        #__next {
          display: none;
        }
      `}</style>
    </>
  )
}
