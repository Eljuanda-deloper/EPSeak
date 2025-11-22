import 'jest-extended';
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toBeDisabled(): R;
      toBeRequired(): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveValue(value: any): R;
      toContain(value: any): R;
      toHaveLength(length: number): R;
      toEqual(value: any): R;
      toBeCloseTo(value: number, digits?: number): R;
      toBeGreaterThan(value: number): R;
      toBeGreaterThanOrEqual(value: number): R;
      toBeDefined(): R;
      toThrow(error?: any): R;
      toHaveProperty(key: string, value?: any): R;
    }
  }
}
