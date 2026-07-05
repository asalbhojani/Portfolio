import { Color } from 'three'

// Reads a CSS custom property from :root and returns a THREE.Color.
// Keeps Three.js materials tied to the single CSS variable source of truth
// instead of duplicating hex values in JS.
export function cssVarColor(name, fallback = 'white') {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new Color(value || fallback)
}
