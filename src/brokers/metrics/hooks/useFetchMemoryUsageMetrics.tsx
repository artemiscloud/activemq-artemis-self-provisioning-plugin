import {
  PrometheusResponse,
  usePrometheusPoll,
  PrometheusEndpoint,
} from '@openshift-console/dynamic-plugin-sdk';
import { QueryInput } from '../utils';

export const memoryUsageQuery = (
  name: string,
  namespace: string,
  replica = 0,
): string => {
  if (!namespace) {
    return `sum(container_memory_working_set_bytes{pod='${
      name + '-ss-' + replica
    }', container='',}) BY (pod, namspace)`;
  }

  return `sum(container_memory_working_set_bytes{pod='${
    name + '-ss-' + replica
  }', namespace='${namespace}', container='',}) BY (pod, namspace)`;
};

export const useFetchMemoryUsageMetrics = (
  n: number,
): ((input: QueryInput) => [PrometheusResponse[], boolean]) => {
  const metricsResults: PrometheusResponse[] = [];
  const now = Date.now();
  let isLoading = false;

  return ({ name, namespace, span, samples, endTime, timeout, delay }) => {
    [...Array(n)].map((_, i) => {
      const query = memoryUsageQuery(name, namespace, i);
      const [result, loaded] = usePrometheusPoll({
        endpoint: PrometheusEndpoint.QUERY_RANGE,
        query,
        namespace,
        endTime: endTime || now,
        timeout: timeout || '60s',
        timespan: span,
        samples,
        delay,
      });

      isLoading = loaded;

      if (result && result?.data?.result.length > 0) {
        metricsResults.push(result);
      }
    });

    return [metricsResults, isLoading];
  };
};
