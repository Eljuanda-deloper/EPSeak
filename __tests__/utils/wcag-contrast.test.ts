import {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  validateContrast,
  wcagColorPalette,
} from '@/app/utils/wcag-contrast-validator'

describe('WCAG Contrast Validator', () => {
  describe('hexToRgb', () => {
    it('converts hex color to RGB', () => {
      const rgb = hexToRgb('#FF0000')
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('handles lowercase hex', () => {
      const rgb = hexToRgb('#0066cc')
      expect(rgb).toEqual({ r: 0, g: 102, b: 204 })
    })

    it('throws on invalid hex', () => {
      expect(() => hexToRgb('not-a-color')).toThrow()
    })
  })

  describe('getLuminance', () => {
    it('calculates luminance correctly', () => {
      const whiteRgb = { r: 255, g: 255, b: 255 }
      const blackRgb = { r: 0, g: 0, b: 0 }

      const whiteLum = getLuminance(whiteRgb)
      const blackLum = getLuminance(blackRgb)

      expect(whiteLum).toBeGreaterThan(blackLum)
      expect(whiteLum).toBeCloseTo(1, 1)
      expect(blackLum).toBeCloseTo(0, 1)
    })
  })

  describe('getContrastRatio', () => {
    it('calculates correct contrast ratio', () => {
      // White on black should be 21:1
      const ratio = getContrastRatio('#FFFFFF', '#000000')
      expect(ratio).toBeCloseTo(21, 0)
    })

    it('calculates contrast for primary blue', () => {
      const ratio = getContrastRatio('#0066CC', '#FFFFFF')
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  })

  describe('validateContrast', () => {
    it('validates WCAG AA compliance', () => {
      const result = validateContrast('#0066CC', '#FFFFFF')

      expect(result.ratio).toBeGreaterThan(0)
      expect(result.passAA).toBeDefined()
      expect(typeof result.passAA).toBe('boolean')
    })

    it('passes white text on dark background', () => {
      const result = validateContrast('#FFFFFF', '#000000')

      expect(result.passAA).toBe(true)
      expect(result.passAAA).toBe(true)
    })

    it('fails low contrast combinations', () => {
      const result = validateContrast('#CCCCCC', '#FFFFFF')

      expect(result.passAA).toBe(false)
      expect(result.ratio).toBeLessThan(4.5)
    })

    it('validates large text separately', () => {
      const result = validateContrast('#0066CC', '#FFFFFF')

      expect(result.passAA_Large).toBeDefined()
      expect(result.passAAA_Large).toBeDefined()
    })
  })

  describe('WCAG Color Palette', () => {
    it('provides standard WCAG colors', () => {
      expect(wcagColorPalette.primary).toBeDefined()
      expect(wcagColorPalette.success).toBeDefined()
      expect(wcagColorPalette.warning).toBeDefined()
      expect(wcagColorPalette.danger).toBeDefined()
    })

    it('primary color passes AA contrast on white', () => {
      const result = validateContrast(wcagColorPalette.primary, '#FFFFFF')
      expect(result.passAA).toBe(true)
    })

    it('all text colors pass contrast requirements', () => {
      const backgrounds = ['#FFFFFF', '#F5F5F5']
      const textColors = [wcagColorPalette.textPrimary, wcagColorPalette.textSecondary]

      textColors.forEach((textColor) => {
        backgrounds.forEach((bgColor) => {
          const result = validateContrast(textColor, bgColor)
          expect(result.passAA).toBe(true)
        })
      })
    })
  })
})
