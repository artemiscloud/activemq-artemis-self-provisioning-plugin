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
};

type AxisDomain = [number, number];

export const CardBrokerCPUUsageMetricsContainer: FC<
  CardBrokerCPUUsageMetricsContainerProps
> = ({ name, namespace, defaultSamples = 300, timespan, size }) => {
  const fetchCpuUsageMetrics = useFetchCpuUsageMetrics(size);
  //states
  const [xDomain] = useState<AxisDomain>();
  // For the default time span, use the first of the suggested span options that is at least as long
  // as defaultTimespan
  const defaultSpanText = '30m';
  const [span, setSpan] = useState(parsePrometheusDuration(defaultSpanText));
  // If we have both `timespan` and `defaultTimespan`, `timespan` takes precedence
  // Limit the number of samples so that the step size doesn't fall below minStep
  const maxSamplesForSpan = defaultSamples || getMaxSamplesForSpan(span);
  const [samples, setSamples] = useState(maxSamplesForSpan);

  // Define this once for all queries so that they have exactly the same time range and X values
  const endTime = xDomain?.[1];

  // If provided, `timespan` overrides any existing span setting
  useEffect(() => {
    if (timespan) {
      setSpan(timespan);
      setSamples(defaultSamples || getMaxSamplesForSpan(timespan));
    }
  }, [defaultSamples, timespan]);

  const [result, loaded] = fetchCpuUsageMetrics({
    name,
    namespace,
    span,
    samples,
    endTime,
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
