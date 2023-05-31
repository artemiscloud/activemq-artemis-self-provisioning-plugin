import type React from 'react';
import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import type { DropdownProps } from '@patternfly/react-core/dist/js';

export interface IDropdownWithToggleProps {
  name: string;
  toggleId: string;
  items: IDropdownOption[];
  onSelectOption?: (value: string, name: string) => void;
  isLabelAndValueNotSame?: boolean;
}
export interface IDropdownOption {
  value?: string;
  label?: string;
  key?: string;
  isDisabled?: boolean;
}

export const DropdownWithToggle: React.FC<IDropdownWithToggleProps> = ({
  name,
  toggleId,
  items,
  isLabelAndValueNotSame,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  const [selectedValue, setSelectedValue] = useState<string>('');
  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  console.log('selval', selectedValue);
  const onSelect: DropdownProps['onSelect'] = (e) => {
    if (e && e.currentTarget.textContent) {
      const label: string = e.currentTarget.textContent;
      items?.map((item) => {
        if (item.label === label) {
          setSelectedValue(item.value);
        }
      });
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

  const getSelectedValue = () => {
    if (isLabelAndValueNotSame) {
      const filteredOption = items?.filter(
        (item) => item.value === selectedValue,
      )[0];
      return filteredOption;
    }
    return selectedValue;
  };

  const dropdownToggle = (
    <DropdownToggle id={toggleId} onToggle={onToggle}>
      {selectedValue || getSelectedValue()}
    </DropdownToggle>
  );

  return (
    <Dropdown
      name={name}
      onSelect={onSelect}
      toggle={dropdownToggle}
      isOpen={isOpen}
      dropdownItems={getItems(items)}
    />
  );
};
