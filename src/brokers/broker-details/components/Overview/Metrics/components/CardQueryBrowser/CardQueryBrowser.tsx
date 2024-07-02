import { FC } from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import { ChartTitle } from '../ChartTitle';
import { CardBodyLoading } from '../CardBodyLoading';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData';
import { QueryBrowser, QueryBrowserProps } from '../QueryBrowser/QueryBrowser';

export type CardQueryBrowserProps = QueryBrowserProps & {
  isInitialLoading: boolean;
  backendUnavailable: boolean;
  title: string;
  helperText: string;
  dataTestId: string;
};

export const CardQueryBrowser: FC<CardQueryBrowserProps> = ({
  isInitialLoading,
  backendUnavailable,
  allMetricsSeries,
  span,
  samples,
  fixedXDomain,
  isLoading,
  formatSeriesTitle,
  title,
  helperText,
  dataTestId,
  yTickFormat,
  processedData,
  label,
  metricsType,
  ariaTitle,
}) => {
  return (
    <Card data-test-id={dataTestId}>
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
                <ChartTitle title={title} helperText={helperText} />
                <CardBody>
                  <QueryBrowser
                    allMetricsSeries={allMetricsSeries}
                    span={span}
                    isLoading={isLoading}
                    samples={samples}
                    fixedXDomain={fixedXDomain}
                    formatSeriesTitle={formatSeriesTitle}
                    processedData={processedData}
                    yTickFormat={yTickFormat}
                    metricsType={metricsType}
                    label={label}
                    ariaTitle={ariaTitle}
                  />
                </CardBody>
              </>
            );
        }
      })()}
    </Card>
  );
};
