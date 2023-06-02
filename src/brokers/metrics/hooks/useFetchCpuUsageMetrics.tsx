import {
  PrometheusResponse,
  usePrometheusPoll,
  PrometheusEndpoint,
} from '@openshift-console/dynamic-plugin-sdk';
import { cpuUsageQuery, QueryInput } from '../utils';

export const useFetchCpuUsageMetrics = (
  n: number,
): ((input: QueryInput) => [PrometheusResponse[], boolean]) => {
  const metricsResults: PrometheusResponse[] = [];
  const now = Date.now();
  let isLoading = false;

  return ({ name, namespace, span, samples, endTime, timeout, delay }) => {
    [...Array(n)].map((_, i) => {
      const query = cpuUsageQuery(name, namespace, i);
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
