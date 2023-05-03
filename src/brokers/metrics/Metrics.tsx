import { FC } from 'react';
import {
  CardBrokerMemoryUsageMetricsContainer,
  CardBrokerMemoryUsageMetricsContainerProps,
  CardBrokerCPUUsageMetricsContainer,
} from './components';
import { MetricsLayout } from './components/MetricsLayout/MetricsLayout';

export type MetricsProps = CardBrokerMemoryUsageMetricsContainerProps;

export const Metrics: FC<MetricsProps> = ({ name, namespace, size }) => {
  return (
    <MetricsLayout
      metricsMemoryUsage={
        <CardBrokerMemoryUsageMetricsContainer
          name={name}
          namespace={namespace}
          size={size}
        />
      }
      metricsCPUUsage={
        <CardBrokerCPUUsageMetricsContainer
          name={name}
          namespace={namespace}
          size={size}
        />
      }
    />
  );
};
