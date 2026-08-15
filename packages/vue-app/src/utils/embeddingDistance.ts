export function distanceToPercentage (distance: number): number {
  return Math.floor((2 - distance) * 50)
}
