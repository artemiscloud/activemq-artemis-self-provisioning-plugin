import {
  PrometheusResponse,
  usePrometheusPoll,
  PrometheusEndpoint,
} from '@openshift-console/dynamic-plugin-sdk';
import { memoryUsageQuery, QueryInput } from '../utils';

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
        delay: delay || 50000, //default delay time 5 minutes
      });

      isLoading = loaded;

      if (result && result?.data?.result.length > 0) {
        metricsResults.push(result);
      }
    });

    return [metricsResults, isLoading];
  };
};
