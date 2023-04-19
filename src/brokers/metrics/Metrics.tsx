import { FC } from 'react';
import {
  CardBrokerMemoryUsageMetricsContainer,
  CardBrokerMemoryUsageMetricsContainerProps,
  CardBrokerCPUUsageMetricsContainer,
} from './components';
import { MetricsLayout } from './components/MetricsLayout/MetricsLayout';

export type MetricsProps = CardBrokerMemoryUsageMetricsContainerProps;

export const Metrics: FC<MetricsProps> = ({ name, namespace }) => {
  return (
    <MetricsLayout
      metricsMemoryUsage={
        <CardBrokerMemoryUsageMetricsContainer
          name={name}
          namespace={namespace}
        />
      }
      metricsCPUUsage={
        <CardBrokerCPUUsageMetricsContainer name={name} namespace={namespace} />
      }
    />
  );
};
