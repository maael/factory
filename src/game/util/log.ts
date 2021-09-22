export function log(...args: any[]) {
  const parts = new Error().stack
    ?.split('\n')
    .filter((i) => i !== 'Error')[1]
    .split('@')[0]
    .trim()
    .split(' ')
  let initial = parts ? parts[1].trim() : undefined
  if (initial === 'new') initial = parts ? `${parts[2].trim()}.constructor` : undefined
  console.info(`[${initial}]`, ...args)
}
