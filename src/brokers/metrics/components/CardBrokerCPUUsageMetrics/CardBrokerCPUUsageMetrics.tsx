import { FC, useState } from 'react';
import { Card, CardBody } from '@patternfly/react-core';
import {
  ChartCPUUsage,
  ChartCPUUsageProps,
} from '../ChartCPUUsage/ChartCPUUsage';
import { useTranslation } from '../../../../i18n';
import { CardBodyLoading } from '../CardBodyLoading/CardBodyLoading';
import { EmptyStateNoMetricsData } from '../EmptyStateNoMetricsData/EmptyStateNoMetricsData';
import { ChartTitle } from '../ChartTitle';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../../../../shared-components/DropdownWithToggle';

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
  const [selectedValue, setSelectedValue] = useState<string>('0');

  const dropdownItems: IDropdownOption[] = [
    {
      key: 'Refresh Off',
      value: '0',
      label: t('refresh_off'),
      isDisabled: false,
    },
    {
      key: '15s',
      value: '15s',
      label: t('15_seconds'),
      isDisabled: false,
    },
    {
      key: '30s',
      value: '30s',
      label: t('30_seconds'),
      isDisabled: false,
    },
    {
      key: '1m',
      value: '1m',
      label: t('1_minute'),
      isDisabled: false,
    },
    {
      key: '5m',
      value: '5m',
      label: t('5_minutes'),
      isDisabled: false,
    },
    {
      key: '15m',
      value: '15m',
      label: t('15_minutes'),
      isDisabled: false,
    },
    {
      key: '30m',
      value: '30m',
      label: t('30_minutes'),
      isDisabled: false,
    },
    {
      key: '1h',
      value: '1h',
      label: t('1_hour'),
      isDisabled: false,
    },
    {
      key: '6h',
      value: '6h',
      label: t('6_hours'),
      isDisabled: false,
    },
    {
      key: '1d',
      value: '1d',
      label: t('1_day'),
      isDisabled: false,
    },
    {
      key: '2d',
      value: '2d',
      label: t('2_days'),
      isDisabled: false,
    },
    {
      key: '1w',
      value: '1w',
      label: t('1_week'),
      isDisabled: false,
    },
    {
      key: '2w',
      value: '2w',
      label: t('2_weeks'),
      isDisabled: false,
    },
  ];

  const onSelectOption = (value: string) => {
    setSelectedValue(value);
  };

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
                <div className="pf-u-ml-sm pf-u-mt-sm pf-u-mb-sm">
                  <DropdownWithToggle
                    id="polling-dropdown"
                    toggleId="polling-dropdowntoggle"
                    items={dropdownItems}
                    value={selectedValue}
                    onSelectOption={onSelectOption}
                    isLabelAndValueNotSame={true}
                  />
                </div>
                <ChartTitle
                  title={t('cpu_usage')}
                  helperText={t('cpu_usage_help_text')}
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
