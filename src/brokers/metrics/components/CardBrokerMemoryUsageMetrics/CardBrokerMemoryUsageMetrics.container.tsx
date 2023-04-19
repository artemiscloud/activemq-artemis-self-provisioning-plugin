import { FC } from 'react';
import { CardBrokerMemoryUsageMetrics } from './CardBrokerMemoryUsageMetrics';
import {
  usePrometheusPoll,
  PrometheusEndpoint,
} from '@openshift-console/dynamic-plugin-sdk';
import * as json from '../../dummy-data/metrics-data.json';

export type CardBrokerMemoryUsageMetricsContainerProps = {
  name: string;
  namespace: string;
};

export const CardBrokerMemoryUsageMetricsContainer: FC<
  CardBrokerMemoryUsageMetricsContainerProps
> = ({ name, namespace }) => {
  const [result, loaded] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: `sum(container_memory_working_set_bytes{pod='${
      name + '-ss-0'
    }', namespace='${namespace}', container='',}) BY (pod, namspace)`,
    namespace,
  });

  const data = result && result.data.result.length > 0 ? [result] : [json];
  const bytesPerPod = {};

  data.forEach((metrics) => {
    metrics.data.result.forEach(({ metric, values }) => {
      const podKey = `${metric.pod}`;
      const podMetric = bytesPerPod[podKey] || {};
      values.forEach(
        ([value, timestamp]) =>
          (podMetric[timestamp] = value + (podMetric[timestamp] || 0)),
      );
      bytesPerPod[podKey] = podMetric;
    });
  });

  return (
    <CardBrokerMemoryUsageMetrics
      isInitialLoading={false}
      backendUnavailable={false}
      memoryUsageData={bytesPerPod}
      duration={5}
      isLoading={!loaded}
    />
  );
};
