import _ from 'lodash';
import { PrometheusValue } from '@openshift-console/dynamic-plugin-sdk';
import {
  humanizeNumberSI,
  humanizeBinaryBytes,
  humanizeDecimalBytesPerSec,
  humanizePacketsPerSec,
  humanizeSeconds,
  humanizeNumber,
  humanizeCpuCores,
} from './units';
import { minSamples, minStep, maxSamples } from './consts';
import { AxisDomain, GraphDataPoint } from './types';
import { parsePrometheusDuration } from './prometheus';
import { timeFormatter, dateFormatterNoYear } from './datatime';

// Use exponential notation for small or very large numbers to avoid labels with too many characters
const formatPositiveValue = (v: number): string =>
  v === 0 || (0.001 <= v && v < 1e23)
    ? humanizeNumberSI(v).string
    : v.toExponential(1);

const formatValue = (v: number): string =>
  (v < 0 ? '-' : '') + formatPositiveValue(Math.abs(v));

export const valueFormatter = (units: string): ((v: number) => string) =>
  ['ms', 's', 'bytes', 'Bps', 'pps', 'm'].includes(units)
    ? (v: number) => formatNumber(String(v), undefined, units)
    : formatValue;

export const formatNumber = (
  s: string,
  decimals = 2,
  format = 'short',
): string => {
  const value = Number(s);
  if (_.isNil(s) || isNaN(value)) {
    return s || '-';
  }

  switch (format) {
    case 'percentunit':
      return Intl.NumberFormat(undefined, {
        style: 'percent',
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(value);
    case 'bytes':
      return humanizeBinaryBytes(value).string;
    case 'Bps':
      return humanizeDecimalBytesPerSec(value).string;
    case 'pps':
      return humanizePacketsPerSec(value).string;
    case 'ms':
      return humanizeSeconds(value, 'ms').string;
    case 's':
      return humanizeSeconds(value * 1000, 'ms').string;
    case 'm':
      return humanizeCpuCores(value).string;
    case 'short':
    // fall through
    default:
      return humanizeNumber(value).string;
  }
};

export const getXDomain = (endTime: number, span: number): AxisDomain => [
  endTime - span,
  endTime,
];

export const getMaxSamplesForSpan = (span: number) =>
  _.clamp(Math.round(span / minStep), minSamples, maxSamples);

export const formatSeriesValues = (
  values: PrometheusValue[],
  samples: number,
  span: number,
): GraphDataPoint[] => {
  const newValues = _.map(values, (v) => {
    const y = Number(v[1]);
    return {
      x: new Date(v[0] * 1000),
      y: Number.isNaN(y) ? null : y,
    };
  });

  // The data may have missing values, so we fill those gaps with nulls so that the graph correctly
  // shows the missing values as gaps in the line
  const start = Number(_.get(newValues, '[0].x'));
  const end = Number(_.get(_.last(newValues), 'x'));
  const step = span / samples;
  _.range(start, end, step).forEach((t, i) => {
    const x = new Date(t);
    if (_.get(newValues, [i, 'x']) > x) {
      newValues.splice(i, 0, { x, y: null });
    }
  });

  return newValues;
};

export const xAxisTickFormat = (span: number): ((tick: any) => string) => {
  return (tick) => {
    if (span > parsePrometheusDuration('1d')) {
      // Add a newline between the date and time so tick labels don't overlap.
      return `${dateFormatterNoYear.format(tick)}\n${timeFormatter.format(
        tick,
      )}`;
    }
    return timeFormatter.format(tick);
  };
};

export const memoryUsageQuery = (
  name: string,
  namespace: string,
  replica = 0,
): string => {
  if (!namespace) {
    return `sum(container_memory_working_set_bytes{pod='${
      name + '-ss-' + replica
    }', container='',}) BY (pod, namspace)`;
  }

  return `sum(container_memory_working_set_bytes{pod='${
    name + '-ss-' + replica
  }', namespace='${namespace}', container='',}) BY (pod, namspace)`;
};

export const cpuUsageQuery = (
  name: string,
  namespace: string,
  replica = 0,
): string => {
  if (!namespace) {
    return `pod:container_cpu_usage:sum{pod='${name + '-ss-' + replica}'}`;
  }

  return `pod:container_cpu_usage:sum{pod='${
    name + '-ss-' + replica
  }',namespace='${namespace}'}`;
};
