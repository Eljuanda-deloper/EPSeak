import '@testing-library/jest-dom'
import 'jest-extended/all'

// Polyfill for PointerEvent in test environment
if (typeof window !== 'undefined' && !window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, props) {
      super(type, props)
      this.pointerId = props?.pointerId || 0
      this.pointerType = props?.pointerType || 'mouse'
      this.isPrimary = props?.isPrimary ?? true
    }
  }
}