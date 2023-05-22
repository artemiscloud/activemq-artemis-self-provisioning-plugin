import { FC, useState } from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { useTranslation } from '../../i18n';

export const PollingTimeDropdown: FC = () => {
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

  const dropdownItems = [
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, 'Refresh off')}
      component="button"
    >
      Refresh off
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '15 Seconds')}
      component="button"
    >
      15 Seconds
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '30 Seconds')}
      component="button"
    >
      30 Seconds
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '1 minute')}
      component="button"
    >
      1 minute
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '5 minute')}
      component="button"
    >
      5 minute
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '15 minute')}
      component="button"
    >
      15 minute
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '30 minute')}
      component="button"
    >
      30 minute
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '1 hour')}
      component="button"
    >
      1 hour
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '2 hour')}
      component="button"
    >
      2 hour
    </DropdownItem>,
    <DropdownItem
      key="action"
      onClick={() => onSelect(undefined, '1 day')}
      component="button"
    >
      1 day
    </DropdownItem>,
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
      dropdownItems={dropdownItems}
    />
  );
};
