import * as React from 'react'
import initGame from '../../game'

export default function Game() {
  React.useLayoutEffect(() => {
    const game = initGame()
    return () => (game ? game() : undefined)
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
