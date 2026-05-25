export type MotionEnvironment = {
  prefersReducedMotion: boolean
  hasFinePointer: boolean
}

export type MotionProfile = {
  cursor: boolean
  reveals: boolean
  shimmer: boolean
}

export function getMotionProfile(environment: MotionEnvironment): MotionProfile {
  if (environment.prefersReducedMotion) {
    return { cursor: false, reveals: false, shimmer: false }
  }

  return {
    cursor: environment.hasFinePointer,
    reveals: true,
    shimmer: true,
  }
}
