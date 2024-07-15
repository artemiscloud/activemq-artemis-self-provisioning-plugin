import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { parsePrometheusDuration } from '../../../Metrics/utils/prometheus';
import { getMaxSamplesForSpan } from '../../utils/format';
import { humanizeBinaryBytes } from '../../utils/units';
import { ByteDataTypes, GraphSeries } from '../../utils/types';
import { processFrame } from '../../utils/data-utils';
import { useFetchMemoryUsageMetrics } from '../../hooks/useFetchMemoryUsageMetrics';
import { useTranslation } from '../../../../../../../i18n/i18n';
import { CardQueryBrowser } from '../CardQueryBrowser/CardQueryBrowser';

export type CardBrokerMemoryUsageMetricsContainerProps = {
  name: string;
  namespace: string;
  defaultSamples?: number;
  timespan?: number;
  fixedEndTime?: number;
  size: number;
  pollTime?: string;
  span?: string;
};

type AxisDomain = [number, number];

export const CardBrokerMemoryUsageMetricsContainer: FC<
  CardBrokerMemoryUsageMetricsContainerProps
> = ({
  name,
  namespace,
  defaultSamples = 300,
  timespan: span,
  size,
  pollTime,
}) => {
  const { t } = useTranslation();

  const fetchMemoryUsageMetrics = useFetchMemoryUsageMetrics(size);
  //states
  const [xDomain] = useState<AxisDomain>();
  // If we have both `timespan` and `defaultTimespan`, `timespan` takes precedence
  // Limit the number of samples so that the step size doesn't fall below minStep
  const maxSamplesForSpan = defaultSamples || getMaxSamplesForSpan(span);
  const [samples, setSamples] = useState(maxSamplesForSpan);
  //const [metricsResult, setMetricsResult] = useState<PrometheusResponse[]>();
  //const [loaded, setLoaded] = useState<boolean>(false);

  // Define this once for all queries so that they have exactly the same time range and X values
  const endTime = xDomain?.[1];

  // If provided, `timespan` overrides any existing span setting
  useEffect(() => {
    if (span) {
      //setSpan(timespan);
      setSamples(defaultSamples || getMaxSamplesForSpan(span));
    }
  }, [defaultSamples, span]);

  const [metricsResult, loaded] = fetchMemoryUsageMetrics({
    name,
    namespace,
    span,
    samples,
    endTime,
    delay: parsePrometheusDuration(pollTime),
  });

  const data: GraphSeries[] = [];
  const { processedData, unit } = useMemo(() => {
    const nonEmptyDataSets = data.filter((dataSet) => dataSet?.length);
    return processFrame(nonEmptyDataSets, ByteDataTypes.BinaryBytes);
  }, [data]);

  const yTickFormat = useCallback(
    (tick) => `${humanizeBinaryBytes(tick, unit, unit).string}`,
    [unit],
  );

  return (
    <CardQueryBrowser
      isInitialLoading={false}
      backendUnavailable={false}
      allMetricsSeries={metricsResult}
      span={span}
      isLoading={!loaded}
      fixedXDomain={xDomain}
      samples={samples}
      formatSeriesTitle={(labels) => labels.pod}
      title={t('memory_usage')}
      helperText={t('memory_usage_help_text')}
      dataTestId={'metrics-broker-memory-usage'}
      yTickFormat={yTickFormat}
      processedData={processedData}
      label={'\n\n\n\n' + t('axis_label_bytes')}
      ariaTitle={t('memory_usage')}
    />
  );
};
