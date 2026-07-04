// Ensures fn runs at most once per animation frame, using the latest call's args.
export function rafThrottle(fn) {
  let queued = false
  let lastArgs = null

  const throttled = (...args) => {
    lastArgs = args
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      fn(...lastArgs)
    })
  }

  throttled.cancel = () => { queued = true }

  return throttled
}
