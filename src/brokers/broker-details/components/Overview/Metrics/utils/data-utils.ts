import _ from 'lodash-es';
import { getType } from './units';
// Types
export type DataPoint<X = Date | number | string> = {
  x?: X;
  y?: number;
  label?: string;
  metric?: { [key: string]: string };
  description?: string;
  symbol?: {
    type?: string;
    fill?: string;
  };
};

export type ProcessFrameResult = {
  processedData: DataPoint[][];
  unit: string;
};

const log = (x: number, y: number) => {
  return Math.log(y) / Math.log(x);
};

// Get the larget unit seen in the dataframe within the supported range
const bestUnit = (
  dataPoints: DataPoint[][],
  type: { divisor: number; units: string[] },
) => {
  const flattenDataPoints = dataPoints.reduce(
    (acc, arr) => acc.concat(arr),
    [],
  );

  const bestLevel = flattenDataPoints.reduce((maxUnit, point) => {
    const index = Math.floor(log(_.get(type, 'divisor', 1024), point.y));
    const unitIndex =
      index >= type.units.length ? type.units.length - 1 : index;
    return maxUnit < unitIndex ? unitIndex : maxUnit;
  }, -1);
  return _.get(type, ['units', bestLevel]);
};

// Array based processor
export const processFrame = (
  dataPoints: DataPoint[][],
  typeName: string,
): ProcessFrameResult => {
  const type = getType(typeName);
  let unit = null;
  if (dataPoints && dataPoints[0]) {
    // Get the appropriate unit and convert the dataset to that level
    unit = bestUnit(dataPoints, type);
    const frameLevel = type.units.indexOf(unit);
    dataPoints.forEach((arr) =>
      arr.forEach((point) => {
        point.y /= type.divisor ** frameLevel;
      }),
    );
  }
  return { processedData: dataPoints, unit };
};
