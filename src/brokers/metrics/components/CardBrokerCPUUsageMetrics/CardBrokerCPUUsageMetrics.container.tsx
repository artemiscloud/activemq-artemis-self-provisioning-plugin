import { FC, useEffect, useState } from 'react';
import { CardBrokerCPUUsageMetrics } from './CardBrokerCPUUsageMetrics';
import { parsePrometheusDuration } from '../../../../utils';
import { getMaxSamplesForSpan } from '../../utils';
import { useFetchCpuUsageMetrics } from '../../hooks';

export type CardBrokerCPUUsageMetricsContainerProps = {
  name: string;
  namespace: string;
  defaultSamples?: number;
  timespan?: number;
  fixedEndTime?: number;
  size: number;
  pollTime?: string;
};

type AxisDomain = [number, number];

export const CardBrokerCPUUsageMetricsContainer: FC<
  CardBrokerCPUUsageMetricsContainerProps
> = ({
  name,
  namespace,
  defaultSamples = 300,
  timespan: span,
  size,
  pollTime,
}) => {
  const fetchCpuUsageMetrics = useFetchCpuUsageMetrics(size);
  //states
  const [xDomain] = useState<AxisDomain>();
  // If we have both `timespan` and `defaultTimespan`, `timespan` takes precedence
  // Limit the number of samples so that the step size doesn't fall below minStep
  const maxSamplesForSpan = defaultSamples || getMaxSamplesForSpan(span);
  const [samples, setSamples] = useState(maxSamplesForSpan);

  // Define this once for all queries so that they have exactly the same time range and X values
  const endTime = xDomain?.[1];

  // If provided, `timespan` overrides any existing span setting
  useEffect(() => {
    if (span) {
      setSamples(defaultSamples || getMaxSamplesForSpan(span));
    }
  }, [defaultSamples, span]);

  const [result, loaded] = fetchCpuUsageMetrics({
    name,
    namespace,
    span,
    samples,
    endTime,
    delay: parsePrometheusDuration(pollTime),
  });

  return (
    <CardBrokerCPUUsageMetrics
      isInitialLoading={false}
      backendUnavailable={false}
      allMetricsSeries={result}
      span={span}
      isLoading={!loaded}
      fixedXDomain={xDomain}
      samples={samples}
      formatSeriesTitle={(labels) => labels.pod}
    />
  );
};
