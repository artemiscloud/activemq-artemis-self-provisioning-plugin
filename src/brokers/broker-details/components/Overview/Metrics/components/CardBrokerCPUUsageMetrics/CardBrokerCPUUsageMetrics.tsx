import { FC } from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import {
  ChartCPUUsage,
  ChartCPUUsageProps,
} from '../ChartCPUUsage/ChartCPUUsage';
import { useTranslation } from '@app/i18n/i18n';
import { CardBodyLoading } from '../CardBodyLoading/CardBodyLoading';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import { ChartTitle } from '../ChartTitle/ChartTitle';

export type CardBrokerCPUUsageMetricsProps = ChartCPUUsageProps & {
  isInitialLoading: boolean;
  backendUnavailable: boolean;
};

export const CardBrokerCPUUsageMetrics: FC<CardBrokerCPUUsageMetricsProps> = ({
  isInitialLoading,
  backendUnavailable,
  allMetricsSeries,
  span,
  samples,
  fixedXDomain,
  isLoading,
  formatSeriesTitle,
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
                  title={t('CPU Usage')}
                  helperText={t('CPU Usage')}
                />
                <CardBody>
                  <ChartCPUUsage
                    allMetricsSeries={allMetricsSeries}
                    span={span}
                    isLoading={isLoading}
                    samples={samples}
                    fixedXDomain={fixedXDomain}
                    formatSeriesTitle={formatSeriesTitle}
                  />
                </CardBody>
              </>
            );
        }
      })()}
    </Card>
  );
};
