import { rafThrottle } from './rafThrottle'

// Mobile-only pub/sub singleton for device tilt, mirroring the existing
// `window.__lenis` global-instance convention in App.jsx. A singleton (not
// React context) because unrelated components (Hero parallax, later the
// Projects card tilt) all need the same live reading without prop drilling.
let current = { x: 0, y: 0 }
const listeners = new Set()
let initialized = false

const publish = rafThrottle((x, y) => {
  current = { x, y }
  listeners.forEach(cb => cb(current))
})

function onOrientation(e) {
  if (e.gamma == null || e.beta == null) return
  const x = Math.max(-1, Math.min(1, e.gamma / 30))
  const y = Math.max(-1, Math.min(1, e.beta / 30))
  publish(x, y)
}

export function initDeviceOrientation() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const attach = () => window.addEventListener('deviceorientation', onOrientation)

  const requestPermission = DeviceOrientationEvent?.requestPermission
  if (typeof requestPermission !== 'function') {
    // Android / other browsers — no permission gate needed.
    attach()
    return
  }

  // iOS 13+: must be requested from a user gesture, so gate it behind the
  // first tap anywhere on the page.
  const onFirstTap = () => {
    document.removeEventListener('pointerdown', onFirstTap)
    requestPermission.call(DeviceOrientationEvent)
      .then(state => { if (state === 'granted') attach() })
      .catch(() => {})
  }
  document.addEventListener('pointerdown', onFirstTap, { once: true })
}

export function subscribeOrientation(cb) {
  listeners.add(cb)
  cb(current)
  return () => listeners.delete(cb)
}

export function getOrientation() {
  return current
}
