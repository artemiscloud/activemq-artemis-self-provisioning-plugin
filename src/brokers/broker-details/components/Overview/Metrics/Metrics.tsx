import { FC, useCallback, useState } from 'react';
import {
  CardBrokerMemoryUsageMetricsContainer,
  CardBrokerMemoryUsageMetricsContainerProps,
} from './components/CardBrokerMemoryUsageMetrics/CardBrokerMemoryUsageMetrics.container';
import { MetricsActions } from './components/MetricsActions/MetricsActions';
import { CardBrokerCPUUsageMetricsContainer } from './components/CardBrokerCPUUsageMetrics/CardBrokerCPUUsageMetrics.container';
import { parsePrometheusDuration } from '../Metrics/utils/prometheus';
import { MetricsType } from './utils/types';
import { MetricsLayout } from './components/MetricsLayout/MetricsLayout';

export type MetricsProps = CardBrokerMemoryUsageMetricsContainerProps;

export const Metrics: FC<MetricsProps> = ({ name, namespace, size }) => {
  const [pollTime, setPollTime] = useState<string>('0');
  const [span, setSpan] = useState<string>('30m');
  const [metricsType, setMetricsType] = useState<MetricsType>(
    MetricsType.AllMetrics,
  );

  const onSelectOptionPolling = useCallback((value: string) => {
    setPollTime(value);
  }, []);

  const onSelectOptionSpan = useCallback((value: string) => {
    setSpan(value);
  }, []);

  const onSelectOptionChart = useCallback((value: MetricsType) => {
    setMetricsType(value);
  }, []);

  return (
    <MetricsLayout
      metricsType={metricsType}
      metricsMemoryUsage={
        <CardBrokerMemoryUsageMetricsContainer
          name={name}
          namespace={namespace}
          size={size}
          pollTime={pollTime}
          timespan={parsePrometheusDuration(span)}
        />
      }
      metricsCPUUsage={
        <CardBrokerCPUUsageMetricsContainer
          name={name}
          namespace={namespace}
          size={size}
          pollTime={pollTime}
          timespan={parsePrometheusDuration(span)}
        />
      }
      metricsActions={
        <MetricsActions
          pollingTime={pollTime}
          span={span}
          metricsType={metricsType}
          onSelectOptionPolling={onSelectOptionPolling}
          onSelectOptionSpan={onSelectOptionSpan}
          onSelectOptionChart={onSelectOptionChart}
        />
      }
    />
  );
};
