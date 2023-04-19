import { FC } from 'react';
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLegend,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer,
  ChartVoronoiContainerProps,
} from '@patternfly/react-charts';
import { ChartSkeletonLoader } from '../ChartSkeletonLoader/ChartSkeletonLoader';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import {
  chartHeight,
  chartPadding,
  timeIntervalsMapping,
  dateToChartValue,
  formatBytes,
  shouldShowDate,
  timestampsToTicks,
} from '../../../../utils';
import { useChartWidth } from '../../hooks/useChartWidth';
import { useTranslation } from '../../../../i18n';
import { chartTheme } from '../../utils';

export type TimeSeriesMetrics = { [timestamp: string]: number };

export type ChartMemoryUsageProps = {
  memoryUsageData: PodBytesMetric;
  duration: number;
  isLoading: boolean;
};

export const ChartMemoryUsage: FC<ChartMemoryUsageProps> = ({
  memoryUsageData,
  duration,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [containerRef, width] = useChartWidth();
  const hasMetrics = Object.keys(memoryUsageData).length > 0;
  const showDate = shouldShowDate(duration);

  const { chartData, legendData, tickValues } = getBytesChartData(
    memoryUsageData,
    duration,
  );

  return (
    <div ref={containerRef} style={{ height: '500px' }}>
      {(() => {
        switch (true) {
          case isLoading:
            return <ChartSkeletonLoader />;
          case !hasMetrics:
            return <EmptyStateNoMetricsData />;
          default: {
            const labels: ChartVoronoiContainerProps['labels'] = ({ datum }) =>
              `${datum.name}: ${formatBytes(datum.y)}`;

            return (
              <>
                <Chart
                  ariaTitle={t('memory_usage')}
                  containerComponent={
                    <ChartVoronoiContainer
                      labels={labels}
                      constrainToVisibleArea
                    />
                  }
                  legendAllowWrap={true}
                  legendPosition="bottom-left"
                  legendComponent={<ChartLegend data={legendData} />}
                  height={chartHeight}
                  padding={chartPadding}
                  themeColor={ChartThemeColor.multiUnordered}
                  width={width}
                >
                  <ChartAxis
                    label={'\n' + t('axis_label_time')}
                    tickValues={tickValues}
                    tickCount={timeIntervalsMapping[duration].ticks}
                    tickFormat={(d: number) =>
                      dateToChartValue(d, {
                        showDate,
                      })
                    }
                  />
                  <ChartAxis
                    label={'\n\n\n\n\n' + t('axis_label_bytes')}
                    dependentAxis
                    tickFormat={formatBytes}
                  />
                  <ChartGroup>
                    {chartData.map((value, index) => (
                      <ChartLine
                        key={`chart-line-${index}`}
                        data={value.area}
                      />
                    ))}
                  </ChartGroup>
                </Chart>
              </>
            );
          }
        }
      })()}
    </div>
  );
};

type ChartData = {
  color: string;
  area: BrokerChartData[];
};

type LegendData = {
  name: string;
};

export const colors = chartTheme.line.colorScale;

export type PodBytesMetric = {
  [pod: string]: TimeSeriesMetrics;
};

type BrokerChartData = {
  name: string;
  x: number;
  y: number;
};

export function getBytesChartData(
  metrics: PodBytesMetric,
  duration: number,
): {
  legendData: Array<LegendData>;
  chartData: Array<ChartData>;
  tickValues: number[];
} {
  const legendData: Array<LegendData> = [];
  const chartData: Array<ChartData> = [];

  Object.entries(metrics).map(([pod, dataMap], index) => {
    const name = `${pod}`;
    const color = colors[index];
    legendData.push({ name });

    const area: Array<BrokerChartData> = [];

    Object.entries(dataMap).map(([timestamp, value]) => {
      area.push({ name, x: parseInt(timestamp, 10), y: value });
    });

    chartData.push({ color, area });
  });

  const allTimestamps = Array.from(
    new Set(Object.values(metrics).flatMap((m) => Object.keys(m))),
  );

  const tickValues = timestampsToTicks(allTimestamps, duration);

  return {
    legendData,
    chartData,
    tickValues,
  };
}
