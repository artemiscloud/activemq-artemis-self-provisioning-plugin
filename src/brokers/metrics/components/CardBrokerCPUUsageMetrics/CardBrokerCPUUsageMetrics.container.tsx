import { FC } from 'react';
import { CardBrokerCPUUsageMetrics } from './CardBrokerCPUUsageMetrics';
import {
  usePrometheusPoll,
  PrometheusEndpoint,
} from '@openshift-console/dynamic-plugin-sdk';
import * as json from '../../dummy-data/metrics-data.json';

export type CardBrokerCPUUsageMetricsContainerProps = {
  name: string;
  namespace: string;
};

export const CardBrokerCPUUsageMetricsContainer: FC<
  CardBrokerCPUUsageMetricsContainerProps
> = ({ name, namespace }) => {
  const [result, loaded, error] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: `sum(container_memory_working_set_bytes{pod='${
      name + '-ss-0'
    }', namespace='${namespace}', container='',}) BY (pod, namspace)`,
    namespace,
  });

  console.log(result, loaded, error);

  const data = [json];
  const bytesPerPod: any = {};

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
    <CardBrokerCPUUsageMetrics
      isInitialLoading={false}
      backendUnavailable={false}
      memoryUsageData={bytesPerPod}
      duration={5}
      isLoading={!loaded}
    />
  );
};
