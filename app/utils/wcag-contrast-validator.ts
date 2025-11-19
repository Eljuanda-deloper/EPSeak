/**
 * WCAG 2.1 Color Contrast Validator
 * Calcula el ratio de contraste entre dos colores
 * Standards:
 * - AA: >= 4.5:1 para texto normal, >= 3:1 para texto grande
 * - AAA: >= 7:1 para texto normal, >= 4.5:1 para texto grande
 */

interface RGBColor {
  r: number
  g: number
  b: number
}

interface ContrastResult {
  ratio: number
  passAA: boolean
  passAAA: boolean
  passAA_Large: boolean
  passAAA_Large: boolean
}

/**
 * Convierte color hex a RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error('Invalid hex color')

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Calcula la luminancia relativa de un color
 */
export function getLuminance(rgb: RGBColor): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calcula el ratio de contraste WCAG
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Valida contraste contra estándares WCAG
 */
export function validateContrast(
  foreground: string,
  background: string
): ContrastResult {
  const ratio = getContrastRatio(foreground, background)

  return {
    ratio: Math.round(ratio * 100) / 100,
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7,
    passAA_Large: ratio >= 3,
    passAAA_Large: ratio >= 4.5,
  }
}

/**
 * Sugerencias de colores accesibles
 */
export const wcagColorPalette = {
  // Colores WCAG AA compliant
  primary: '#0066CC',
  success: '#118C4E',
  warning: '#D46B23',
  danger: '#C41300',
  info: '#0073E6',
  
  // Texto
  textPrimary: '#000000',
  textSecondary: '#555555',
  textLight: '#FFFFFF',
  
  // Backgrounds
  bgLight: '#FFFFFF',
  bgGray: '#F5F5F5',
  bgDark: '#1A1A1A',
  
  // Borders
  borderLight: '#CCCCCC',
  borderDark: '#666666',
} as const

/**
 * Valida todas las combinaciones de colores en una paleta
 */
export function validateColorPalette() {
  const results: Record<string, any> = {}
  const colors = Object.entries(wcagColorPalette)

  colors.forEach(([name1, color1]) => {
    colors.forEach(([name2, color2]) => {
      if (name1 !== name2) {
        const key = `${name1}_on_${name2}`
        const contrast = validateContrast(color1, color2)
        results[key] = contrast
      }
    })
  })

  return results
}
