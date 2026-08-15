import { describe, expect, it } from 'vitest'
import { distanceToPercentage } from '../embeddingDistance'

describe('distanceToPercentage', () => {
  it('should map a distance of 0 (identical) to 100%', () => {
    expect(distanceToPercentage(0)).toBe(100)
  })

  it('should map a distance of 2 (opposite) to 0%', () => {
    expect(distanceToPercentage(2)).toBe(0)
  })

  it('should map a distance of 1 (orthogonal) to 50%', () => {
    expect(distanceToPercentage(1)).toBe(50)
  })

  it('should floor fractional percentages', () => {
    expect(distanceToPercentage(0.03)).toBe(98)
  })
})
