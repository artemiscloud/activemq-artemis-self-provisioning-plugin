import { FC } from 'react';
import { Card, CardHeader } from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
import { MetricsType } from '../../utils/types';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../DropDownWithToggle/DropdownWithToggle';

export type MetricsActionsProps = {
  pollingTime: string;
  span: string;
  onSelectOptionPolling: (value: string) => void;
  onSelectOptionSpan: (value: string) => void;
  metricsType: string;
  onSelectOptionChart: (value: MetricsType) => void;
};

export const MetricsActions: FC<MetricsActionsProps> = ({
  pollingTime,
  span,
  metricsType,
  onSelectOptionPolling,
  onSelectOptionSpan,
  onSelectOptionChart,
}) => {
  const { t } = useTranslation();

  const spanDropdownItems: IDropdownOption[] = [
    {
      key: '5m',
      value: '5m',
      label: t('Last 5 minutes'),
      isDisabled: false,
    },
    {
      key: '15m',
      value: '15m',
      label: t('Last 15 minutes'),
      isDisabled: false,
    },
    {
      key: '30m',
      value: '30m',
      label: t('Last 30 minutes'),
      isDisabled: false,
    },
    {
      key: '1h',
      value: '1h',
      label: t('Last 1 hour'),
      isDisabled: false,
    },
    {
      key: '6h',
      value: '6h',
      label: t('Last 6 hours'),
      isDisabled: false,
    },
    {
      key: '12h',
      value: '12h',
      label: t('Last 12 hours'),
      isDisabled: false,
    },
    {
      key: '1d',
      value: '1d',
      label: t('Last 1 day'),
      isDisabled: false,
    },
    {
      key: '2d',
      value: '2d',
      label: t('Last 2 days'),
      isDisabled: false,
    },
    {
      key: '1w',
      value: '1w',
      label: t('Last 1 week'),
      isDisabled: false,
    },
    {
      key: '2w',
      value: '2w',
      label: t('Last 2 weeks'),
      isDisabled: false,
    },
  ];

  const pollingDropdownItems: IDropdownOption[] = [
    {
      key: 'Refresh Off',
      value: '0',
      label: t('Refresh Off'),
      isDisabled: false,
    },
    {
      key: '15s',
      value: '15s',
      label: t('15 Seconds'),
      isDisabled: false,
    },
    {
      key: '30s',
      value: '30s',
      label: t('30 Seconds'),
      isDisabled: false,
    },
    {
      key: '1m',
      value: '1m',
      label: t('1 minute'),
      isDisabled: false,
    },
    {
      key: '5m',
      value: '5m',
      label: t('5 minutes'),
      isDisabled: false,
    },
    {
      key: '15m',
      value: '15m',
      label: t('15 minutes'),
      isDisabled: false,
    },
    {
      key: '30m',
      value: '30m',
      label: t('30 minutes'),
      isDisabled: false,
    },
    {
      key: '1h',
      value: '1h',
      label: t('1 hour'),
      isDisabled: false,
    },
    {
      key: '6h',
      value: '6h',
      label: t('6 hours'),
      isDisabled: false,
    },
    {
      key: '1d',
      value: '1d',
      label: t('1 day'),
      isDisabled: false,
    },
    {
      key: '2d',
      value: '2d',
      label: t('2 days'),
      isDisabled: false,
    },
    {
      key: '1w',
      value: '1w',
      label: t('1 week'),
      isDisabled: false,
    },
    {
      key: '2w',
      value: '2w',
      label: t('2 weeks'),
      isDisabled: false,
    },
  ];

  const chartsDropdownItems: IDropdownOption[] = [
    {
      key: 'all-charts',
      value: MetricsType.AllMetrics,
      label: t('All Metrics'),
      isDisabled: false,
    },
    {
      key: 'memory-usage',
      value: MetricsType.MemoryUsage,
      label: t('Memory Usage Metrics'),
      isDisabled: false,
    },
    {
      key: 'cpu-usage',
      value: MetricsType.CPUUsage,
      label: t('CPU Usage Metrics'),
      isDisabled: false,
    },
  ];

  return (
    <Card isFullHeight>
      <CardHeader
        actions={{
          actions: (
            <>
              <DropdownWithToggle
                id="metrics-list-dropdown"
                toggleId="metrics-list-dropdowntoggle"
                items={chartsDropdownItems}
                value={metricsType}
                onSelectOption={onSelectOptionChart}
                isLabelAndValueNotSame={true}
              />
              <DropdownWithToggle
                id="span-dropdown"
                toggleId="span-dropdowntoggle"
                items={spanDropdownItems}
                value={span}
                onSelectOption={onSelectOptionSpan}
                isLabelAndValueNotSame={true}
              />
              <DropdownWithToggle
                id="polling-dropdown"
                toggleId="polling-dropdowntoggle"
                items={pollingDropdownItems}
                value={pollingTime}
                onSelectOption={onSelectOptionPolling}
                isLabelAndValueNotSame={true}
              />
            </>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      ></CardHeader>
    </Card>
  );
};
