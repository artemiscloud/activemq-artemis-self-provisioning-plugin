import { FC, useMemo, useCallback } from 'react';
import _ from 'lodash-es';
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
import {
  PrometheusLabels,
  PrometheusResponse,
  PrometheusResult,
} from '@openshift-console/dynamic-plugin-sdk';
import { ChartSkeletonLoader } from '../ChartSkeletonLoader/ChartSkeletonLoader';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import { chartHeight, chartPadding } from '../../../../../../../utils';
import { useChartWidth } from '../../hooks/useChartWidth';
import { useTranslation } from '../../../../../../../i18n';
import {
  chartTheme,
  ByteDataTypes,
  processFrame,
  humanizeBinaryBytes,
  AxisDomain,
  FormatSeriesTitle,
  GraphSeries,
  GraphDataPoint,
  // getXDomain,
  Series,
  formatSeriesValues,
  xAxisTickFormat,
} from '../../utils';

const colors = chartTheme.line.colorScale;

export type ChartMemoryUsageProps = {
  allMetricsSeries: PrometheusResponse[];
  span: number;
  isLoading: boolean;
  defaultSamples?: number;
  fixedXDomain: AxisDomain;
  samples: number;
  formatSeriesTitle?: FormatSeriesTitle;
};

export const ChartMemoryUsage: FC<ChartMemoryUsageProps> = ({
  allMetricsSeries,
  span,
  isLoading,
  fixedXDomain,
  samples,
  formatSeriesTitle,
}) => {
  const { t } = useTranslation();
  const [containerRef, width] = useChartWidth();
  // const [xDomain, setXDomain] = useState(fixedXDomain || getXDomain(Date.now(), span));

  const data: GraphSeries[] = [];
  const tooltipSeriesNames: string[] = [];
  const tooltipSeriesLabels: PrometheusLabels[] = [];
  const legendData: { name: string }[] = [];
  const domain = { x: fixedXDomain, y: fixedXDomain };
  const xAxisTickCount = Math.round(width / 100);

  const newResult = _.map(allMetricsSeries, 'data.result');
  const hasMetrics = _.some(newResult, (r) => (r && r.length) > 0);

  // Only update X-axis if the time range (fixedXDomain or span) or graph data (allSeries) change
  // useEffect(() => {
  //   setXDomain(fixedXDomain || getXDomain(Date.now(), span));
  // }, [allMetricsSeries, span, fixedXDomain]);

  const newGraphData = _.map(newResult, (result: PrometheusResult[]) => {
    return _.map(result, ({ metric, values }): Series => {
      return [metric, formatSeriesValues(values, samples, span)];
    });
  });

  _.each(newGraphData, (series, i) => {
    _.each(series, ([metric, values]) => {
      data.push(values);
      if (formatSeriesTitle) {
        const name = formatSeriesTitle(metric, i);
        legendData.push({ name });
        tooltipSeriesNames.push(name);
      } else {
        tooltipSeriesLabels.push(metric);
      }
    });
  });

  const { processedData, unit } = useMemo(() => {
    const nonEmptyDataSets = data.filter((dataSet) => dataSet?.length);
    return processFrame(nonEmptyDataSets, ByteDataTypes.BinaryBytes);
  }, [data]);

  const xTickFormat = useCallback(
    (tick) => {
      const tickFormat = xAxisTickFormat(span);
      return tickFormat(tick);
    },
    [xAxisTickFormat, span],
  );

  const yTickFormat = useCallback(
    (tick) => `${humanizeBinaryBytes(tick, unit, unit).string}`,
    [unit],
  );

  // Set a reasonable Y-axis range based on the min and max values in the data
  const findMin = (series: GraphSeries): GraphDataPoint => _.minBy(series, 'y');
  const findMax = (series: GraphSeries): GraphDataPoint => _.maxBy(series, 'y');
  let minY: number = findMin(data.map(findMin))?.y ?? 0;
  let maxY: number = findMax(data.map(findMax))?.y ?? 0;
  if (minY === 0 && maxY === 0) {
    minY = 0;
    maxY = 1;
  } else if (minY > 0 && maxY > 0) {
    minY = 0;
  } else if (minY < 0 && maxY < 0) {
    maxY = 0;
  }

  domain.y = [minY, maxY];

  return (
    <div ref={containerRef} style={{ height: '500px' }}>
      {(() => {
        switch (true) {
          case isLoading:
            return <ChartSkeletonLoader />;
          case !hasMetrics:
            return <EmptyStateNoMetricsData />;
          default: {
            const labels: ChartVoronoiContainerProps['labels'] = ({
              datum,
            }) => {
              return `${datum?.style?.labels?.name}: ${yTickFormat(
                datum.y,
              )} at ${xTickFormat(datum.x)}`;
            };

            return (
              <Chart
                ariaTitle={t('memory_usage')}
                // containerComponent={graphContainer}
                containerComponent={
                  <ChartVoronoiContainer
                    labels={labels}
                    constrainToVisibleArea
                  />
                }
                legendComponent={<ChartLegend data={legendData} />}
                legendAllowWrap={true}
                legendPosition="bottom-left"
                scale={{ x: 'time', y: 'linear' }}
                domain={domain}
                height={chartHeight}
                padding={chartPadding}
                domainPadding={{ y: 20 }}
                width={width}
                themeColor={ChartThemeColor.multiUnordered}
              >
                <ChartAxis
                  label={'\n' + t('axis_label_time')}
                  tickCount={xAxisTickCount}
                  tickFormat={xTickFormat}
                />
                <ChartAxis
                  label={'\n\n\n\n' + t('axis_label_bytes')}
                  crossAxis={false}
                  tickCount={6}
                  dependentAxis
                  tickFormat={yTickFormat}
                />
                <ChartGroup>
                  {processedData.map((values, index) => {
                    if (values === null) {
                      return null;
                    }

                    const color = colors[index % colors.length];
                    const style = {
                      data: { stroke: color },
                      labels: {
                        fill: color,
                        labels: tooltipSeriesLabels[index],
                        name: tooltipSeriesNames[index],
                      },
                    };

                    return (
                      <ChartLine
                        key={`chart-line-${index}`}
                        data={values}
                        groupComponent={<g />}
                        name={`series-${index}`}
                        style={style}
                      />
                    );
                  })}
                </ChartGroup>
              </Chart>
            );
          }
        }
      })()}
    </div>
  );
};
