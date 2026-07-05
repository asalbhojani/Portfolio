import { Component } from 'react'

// Catches render/mount errors from Three.js scenes so a crash never leaves
// a blank or broken canvas — we just drop back to the CSS fallback.
export default class CanvasErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene failed, falling back to CSS:', error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
