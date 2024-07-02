import * as _ from 'lodash-es';

// Conversions between units and milliseconds
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const units: { [key: string]: number } = { w, d, h, m, s };

/**
 * Converts a Prometheus time duration like "1h 10m 23s" to milliseconds
 * @param {string} duration - Prometheus time duration string
 * @returns {number} The duration converted to a Prometheus time duration string or 0 if the duration could not be parsed
 * @example
 * ```
 * parsePrometheusDuration("1m 5s") // Returns 65000
 * ```
 */
export const parsePrometheusDuration = (duration: string): number => {
  try {
    const parts = duration
      .trim()
      .split(/\s+/)
      .map((p) => p.match(/^(\d+)([wdhms])$/));
    return _.sumBy(
      parts,
      (p: RegExpMatchArray | null) => parseInt(p[1], 10) * units[p[2]],
    );
  } catch (ignored) {
    // Invalid duration format
    return 0;
  }
};
