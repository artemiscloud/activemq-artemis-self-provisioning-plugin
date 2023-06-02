import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useTranslation } from '../i18n';
import { FC, useState } from 'react';
import { DropdownWithToggle, IDropdownOption } from './DropdownWithToggle';

export type BrokerDetailsBreadcrumbProps = {
  name: string;
  namespace: string;
};

const BrokerDetailsBreadcrumb: FC<BrokerDetailsBreadcrumbProps> = ({
  name,
  namespace,
}) => {
  let redirectPath: string;
  if (namespace === undefined) {
    redirectPath = '/k8s/all-namespaces/brokers';
  } else {
    redirectPath = `/k8s/ns/${namespace}/brokers`;
  }

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
    <>
      <Breadcrumb className="pf-u-mb-md">
        <BreadcrumbItem to={redirectPath}>{t('brokers')}</BreadcrumbItem>
        <BreadcrumbItem isActive>
          {t('broker')} {name}
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="pf-u-float-right">
        <DropdownWithToggle
          id="polling-dropdown"
          toggleId="polling-dropdowntoggle"
          items={dropdownItems}
          value={selectedValue}
          onSelectOption={onSelectOption}
          isLabelAndValueNotSame={true}
        />
      </div>
    </>
  );
};

export { BrokerDetailsBreadcrumb };
