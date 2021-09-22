import dynamic from 'next/dynamic'
const Game = dynamic(() => import('../components/primitives/Game'), {
  loading: function Loading() {
    return <div>Loading</div>
  },
  ssr: false,
})

export default function Index() {
  return <Game />
}
