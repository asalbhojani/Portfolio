// True if a WebGL context can actually be created and the user hasn't
// requested reduced motion. Used to decide whether Three.js scenes should
// render at all, so we never leave a broken/blank canvas on screen.
export function canRenderWebGL() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

export function isLowEndDevice() {
  if (typeof window === 'undefined') return false
  return (navigator.hardwareConcurrency || 8) < 4
}
