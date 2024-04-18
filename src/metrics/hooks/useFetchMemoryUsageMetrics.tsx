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
      // Normally it is impossible to call a hook in a conditional branch (if,
      // loops). That is because it would mess with how React stores it's data.
      // https://react.dev/reference/rules/rules-of-hooks
      //
      // However in this specific configuration, the number `n` determining how
      // many loops are going to occur gets defined by the number of pods within
      // the deployment. This means this number is guaranteed to stay the same
      // while the page is up and running, as long as there is no support for
      // hot reloading.
      //
      // That said, it means that it is therefore safe to use this hook in this
      // loop.
      // eslint-disable-next-line react-hooks/rules-of-hooks
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
