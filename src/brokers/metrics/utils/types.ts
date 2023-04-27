import { PrometheusLabels } from '@openshift-console/dynamic-plugin-sdk';

export type HumanizeResult = {
  string: string;
  value: number;
  unit: string;
};

export type Humanize = {
  (
    v: React.ReactText,
    initialUnit?: string,
    preferredUnit?: string,
  ): HumanizeResult;
};

export enum ByteDataTypes {
  BinaryBytes = 'binaryBytes',
  BinaryBytesWithoutB = 'binaryBytesWithoutB',
  DecimalBytes = 'decimalBytes',
  DecimalBytesWithoutB = 'decimalBytesWithoutB',
}

export type TimeSeriesMetrics = { [timestamp: string]: number };
export type GraphDataPoint = {
  x: Date;
  y: number;
};
export type FormatSeriesTitle = (
  labels: PrometheusLabels,
  i?: number,
) => string;
export type GraphSeries = GraphDataPoint[];
export type AxisDomain = [number, number];
export type Series = [PrometheusLabels, GraphDataPoint[]] | [];
