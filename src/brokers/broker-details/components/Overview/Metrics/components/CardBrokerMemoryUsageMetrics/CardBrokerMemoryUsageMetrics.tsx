import { FC } from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import {
  ChartMemoryUsage,
  ChartMemoryUsageProps,
} from '../ChartMemoryUsage/ChartMemoryUsage';
import { useTranslation } from '../../../../../../../i18n/i18n';
import { CardBodyLoading } from '../CardBodyLoading/CardBodyLoading';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import { ChartTitle } from '../ChartTitle/ChartTitle';

export type CardBrokerMemoryUsageMetricsProps = ChartMemoryUsageProps & {
  isInitialLoading: boolean;
  backendUnavailable: boolean;
};

export const CardBrokerMemoryUsageMetrics: FC<
  CardBrokerMemoryUsageMetricsProps
> = ({
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
    <Card data-test-id={'metrics-broker-memory-usage'}>
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
                  title={t('memory_usage')}
                  helperText={t('memory_usage_help_text')}
                />
                <CardBody>
                  <ChartMemoryUsage
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
