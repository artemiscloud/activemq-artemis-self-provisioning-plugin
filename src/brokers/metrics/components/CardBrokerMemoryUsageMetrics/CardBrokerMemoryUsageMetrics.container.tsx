import { FC, useState, useEffect } from 'react';
import _ from 'lodash';
import { CardBrokerMemoryUsageMetrics } from './CardBrokerMemoryUsageMetrics';
import { parsePrometheusDuration } from '../../../../utils';
import { getMaxSamplesForSpan } from '../../utils';
import { useFetchMemoryUsageMetrics } from '../../hooks';

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

  return (
    <CardBrokerMemoryUsageMetrics
      isInitialLoading={false}
      backendUnavailable={false}
      allMetricsSeries={metricsResult}
      span={span}
      isLoading={!loaded}
      fixedXDomain={xDomain}
      samples={samples}
      formatSeriesTitle={(labels) => labels.pod}
    />
  );
};
