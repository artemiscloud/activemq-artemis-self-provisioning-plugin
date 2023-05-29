import { FC, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { useTranslation } from '../../i18n';

interface IDropdownOption {
  value: string;
  label: string;
  key: string;
}

export const DropdownWithToggle: FC = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = (
    event?: React.SyntheticEvent<HTMLDivElement>,
    value?: string,
  ) => {
    if (value) {
      setSelectedValue(value);
      setIsOpen(false);
    }
  };

  const dropdownItems: IDropdownOption[] = [
    { value: 'Refresh Off', label: t('refresh_off'), key: 'Refresh Off' },
    { value: '15s', label: t('15_seconds'), key: '15s' },
    { value: '30s', label: t('30_seconds'), key: '30s' },
    { value: '1m', label: t('1_minutes'), key: '1m' },
    { value: '5m', label: t('5_minute'), key: '5m' },
    { value: '15m', label: t('15_minute'), key: '15m' },
    { value: '30m', label: t('30_minute'), key: '30m' },
    { value: '1h', label: t('1_hour'), key: '1h' },
    { value: '2h', label: t('2_hour'), key: '2h' },
    { value: '6h', label: t('6_hour'), key: '6h' },
    { value: '12h', label: t('12_hour'), key: '12h' },
    { value: '1d', label: t('1_day'), key: '1d' },
    { value: '2d', label: t('2_day'), key: '2d' },
    { value: '1w', label: t('1_week'), key: '1w' },
    { value: '2w', label: t('2_week'), key: '2w' },
  ];

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle id="toggle-basic" onToggle={onToggle}>
          {selectedValue ? t(selectedValue) : t('refresh_off')}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems.map((item) => (
        <DropdownItem
          key={item.key}
          onClick={() => onSelect(undefined, item.label)}
        >
          {item.label}
        </DropdownItem>
      ))}
    />
  );
};
