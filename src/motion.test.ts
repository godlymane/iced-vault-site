import { describe, expect, it } from 'vitest'
import { getMotionProfile } from './motion'

describe('luxury motion profile', () => {
  it('enables full luxury motion only on fine pointer devices without reduced motion', () => {
    expect(getMotionProfile({ prefersReducedMotion: false, hasFinePointer: true })).toEqual({
      cursor: true,
      reveals: true,
      shimmer: true,
    })
  })

  it('keeps mobile motion restrained', () => {
    expect(getMotionProfile({ prefersReducedMotion: false, hasFinePointer: false })).toEqual({
      cursor: false,
      reveals: true,
      shimmer: true,
    })
  })

  it('disables decorative motion when reduced motion is requested', () => {
    expect(getMotionProfile({ prefersReducedMotion: true, hasFinePointer: true })).toEqual({
      cursor: false,
      reveals: false,
      shimmer: false,
    })
  })
})
