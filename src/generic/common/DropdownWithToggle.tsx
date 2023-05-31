import type React from 'react';
import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import type { DropdownProps } from '@patternfly/react-core/dist/js';

export interface IDropdownWithToggleProps {
  toggleId: string;
  items: IDropdownOption[];
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface IDropdownOption {
  value?: string;
  label?: string;
  key?: string;
  isDisabled?: boolean;
}

export const DropdownWithToggle: React.FC<IDropdownWithToggleProps> = ({
  toggleId,
  items,
  selectedValue,
  setSelectedValue,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect: DropdownProps['onSelect'] = (e) => {
    if (e && e.currentTarget.textContent) {
      const value: string = e.currentTarget.textContent;
      setSelectedValue(value);
      setIsOpen((isOpen) => !isOpen);
    }
  };

  const getItems = (options: IDropdownOption[]) => {
    const items = options.map((option) => {
      const { key, value, label } = option;

      return (
        <DropdownItem key={key} value={value}>
          {label || value}
        </DropdownItem>
      );
    });

    return items;
  };

  // const getSelectedValue = () => {
  //   if (isLabelAndValueNotSame) {
  //     const filteredOption = items?.filter((item) => item.value === value)[0];
  //     return filteredOption?.label || t('refresh_off');
  //   }
  //   return value;
  // };

  const dropdownToggle = (
    <DropdownToggle id={toggleId} onToggle={onToggle}>
      {selectedValue}
    </DropdownToggle>
  );

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={dropdownToggle}
      isOpen={isOpen}
      dropdownItems={getItems(items)}
    />
  );
};
