import { FC } from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import {
  ChartCPUUsage,
  ChartCPUUsageProps,
} from '../ChartCPUUsage/ChartCPUUsage';
import { useTranslation } from '../../../../i18n';
import { CardBodyLoading } from '../CardBodyLoading/CardBodyLoading';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import { ChartTitle } from '../ChartTitle';

export type CardBrokerCPUUsageMetricsProps = ChartCPUUsageProps & {
  isInitialLoading: boolean;
  backendUnavailable: boolean;
};

export const CardBrokerCPUUsageMetrics: FC<CardBrokerCPUUsageMetricsProps> = ({
  isInitialLoading,
  backendUnavailable,
  memoryUsageData,
  duration,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <Card data-test-id={'metrics-broker-cpu-usage'}>
      {(() => {
        switch (true) {
          case isInitialLoading:
            return <CardBodyLoading />;
          case backendUnavailable:
            return (
              <CardBody>
                <EmptyStateNoMetricsData />
              </CardBody>
            );
          default:
            return (
              <>
                <ChartTitle
                  title={t('cpu_usage')}
                  helperText={t('cpu_usage_help_text')}
                />
                <CardBody>
                  <ChartCPUUsage
                    memoryUsageData={memoryUsageData}
                    duration={duration}
                    isLoading={isLoading}
                  />
                </CardBody>
              </>
            );
        }
      })()}
    </Card>
  );
};
