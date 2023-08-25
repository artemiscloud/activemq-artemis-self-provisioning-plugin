/* eslint-disable @typescript-eslint/no-explicit-any */

// This dummy file is used to resolve @Console imports from @openshift-console for JEST

// mocks for non-React code (standard ts syntax)
export class Dummy extends Error {
  constructor() {
    super('Dummy file for exports');
  }
}

/**
 * @export
 * @returns {any[]}
 */
export function useResolvedExtensions(): any[] {
  return [[], undefined, undefined];
}
