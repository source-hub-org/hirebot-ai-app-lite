// Type definitions for Bun test API
declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void
  export function test(name: string, fn: () => void | Promise<void>): void
  export function expect<T>(value: T): any
  export function beforeEach(fn: () => void | Promise<void>): void
  export function afterEach(fn: () => void | Promise<void>): void
  export function spyOn<T extends object, M extends keyof T>(object: T, method: M): any
}
