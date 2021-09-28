import dynamic from 'next/dynamic'
import { useEffect } from 'react'
const Game = dynamic(() => import('../components/primitives/Game'), {
  loading: function Loading() {
    return <div>Loading</div>
  },
  ssr: false,
})

export default function Index() {
  useEffect(() => {
    function handler(status) {
      if (status === 'apply') window.location.reload()
    }
    if (module !== undefined) {
      ;(module as any).hot.addStatusHandler(handler)
    }
    return () => {
      if (module !== undefined) {
        ;(module as any).hot.removeStatusHandler(handler)
      }
    }
  }, [])
  return <Game />
}
