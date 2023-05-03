import { formatDistance } from 'date-fns';
import byteSize from 'byte-size';
import { fromUnixTime, sub } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { parsePrometheusDuration } from './prometheus';

export enum DurationOptions {
  Last5minutes = 5,
  Last15minutes = 15,
  Last30minutes = 30,
  Last1hour = 60,
  Last3hours = 3 * 60,
  Last6hours = 6 * 60,
  Last12hours = 12 * 60,
  Last24hours = 24 * 60,
  Last2days = 2 * 24 * 60,
  Last7days = 7 * 24 * 60,
}

export const getFormattedDate = (
  date: string | Date,
  translatePostfix: string,
): string => {
  date = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(date, new Date()) + ' ' + translatePostfix;
};

export function formatBytes(bytes: number): string {
  return byteSize(bytes, { units: 'iec' }).toString();
}

export const timeIntervalsMapping = {
  [DurationOptions.Last5minutes]: {
    interval: 1 * 60,
    ticks: 6,
    showDate: false,
  },
  [DurationOptions.Last15minutes]: {
    interval: 3 * 60,
    ticks: 6,
    showDate: false,
  },
  [DurationOptions.Last30minutes]: {
    interval: 5 * 60,
    ticks: 7,
    showDate: false,
  },
  [DurationOptions.Last1hour]: { interval: 10 * 60, ticks: 6, showDate: false },
  [DurationOptions.Last3hours]: {
    interval: 30 * 60,
    ticks: 7,
    showDate: false,
  },
  [DurationOptions.Last6hours]: {
    interval: 1 * 60 * 60,
    ticks: 7,
    showDate: false,
  },
  [DurationOptions.Last12hours]: {
    interval: 2 * 60 * 60,
    ticks: 7,
    showDate: false,
  },
  [DurationOptions.Last24hours]: {
    interval: 4 * 60 * 60,
    ticks: 7,
    showDate: true,
  },
  [DurationOptions.Last2days]: {
    interval: 8 * 60 * 60,
    ticks: 7,
    showDate: true,
  },
  [DurationOptions.Last7days]: {
    interval: 24 * 60 * 60,
    ticks: 8,
    showDate: true,
  },
} as const;

export const shouldShowDate = (timeDuration: DurationOptions): boolean => {
  return timeDuration > parsePrometheusDuration('1d');
};

export const dateToChartValue = (
  timestamp: number,
  { showDate }: { showDate: boolean } = { showDate: false },
): string => {
  const date = fromUnixTime(timestamp / 1000);
  return formatInTimeZone(date, 'utc', showDate ? "HH:mm'\n'MMM dd" : 'HH:mm');
};

export function timestampsToTicks(
  timestamps: string[],
  duration: DurationOptions,
): number[] {
  const allTimestamps = [...timestamps];
  allTimestamps.sort();
  const mostRecentTs =
    parseInt(allTimestamps[allTimestamps.length - 1]) || Date.now();
  return new Array(
    Math.max(timeIntervalsMapping[duration].ticks, allTimestamps.length),
  )
    .fill(mostRecentTs)
    .map((d: number, index) =>
      sub(new Date(d), {
        seconds: timeIntervalsMapping[duration].interval * index,
      }).getTime(),
    );
}
