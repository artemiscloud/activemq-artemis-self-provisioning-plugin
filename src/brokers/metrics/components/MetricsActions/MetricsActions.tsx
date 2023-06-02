import { FC } from 'react';
import { Card, CardActions, CardHeader } from '@patternfly/react-core';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../../../../shared-components';
import { useTranslation } from '../../../../i18n';

export type MetricsActionsProps = {
  pollingTime: string;
  span: string;
  onSelectOptionPolling: (value: string) => void;
  onSelectOptionSpan: (value: string) => void;
};

export const MetricsActions: FC<MetricsActionsProps> = ({
  pollingTime,
  span,
  onSelectOptionPolling,
  onSelectOptionSpan,
}) => {
  const { t } = useTranslation();

  const spanDropdownItems: IDropdownOption[] = [
    {
      key: '5m',
      value: '5m',
      label: t('last_5_minutes'),
      isDisabled: false,
    },
    {
      key: '15m',
      value: '15m',
      label: t('last_15_minutes'),
      isDisabled: false,
    },
    {
      key: '30m',
      value: '30m',
      label: t('last_30_minutes'),
      isDisabled: false,
    },
    {
      key: '1h',
      value: '1h',
      label: t('last_1_hour'),
      isDisabled: false,
    },
    {
      key: '6h',
      value: 'gh',
      label: t('last_6_hours'),
      isDisabled: false,
    },
    {
      key: '12h',
      value: '12h',
      label: t('last_12_hours'),
      isDisabled: false,
    },
    {
      key: '1d',
      value: '1d',
      label: t('last_1_day'),
      isDisabled: false,
    },
    {
      key: '2d',
      value: '2d',
      label: t('last_2_days'),
      isDisabled: false,
    },
    {
      key: '1w',
      value: '1w',
      label: t('last_1_week'),
      isDisabled: false,
    },
    {
      key: '2w',
      value: '2w',
      label: t('last_2_weeks'),
      isDisabled: false,
    },
  ];

  const pollingDropdownItems: IDropdownOption[] = [
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

  return (
    <Card isFullHeight>
      <CardHeader>
        <CardActions>
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
        </CardActions>
      </CardHeader>
    </Card>
  );
};
