import type React from 'react';
import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import type { DropdownProps } from '@patternfly/react-core/dist/js';

export interface IDropdownWithToggleProps {
  toggleId: string;
  items: IDropdownOption[];
  isLabelAndValueNotSame?: boolean;
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
  isLabelAndValueNotSame,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();
  const [selectedValue, setSelectedValue] = useState<string>('');
  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

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
      return filteredOption?.value;
    }
    return selectedValue;
  };

  const dropdownToggle = (
    <DropdownToggle id={toggleId} onToggle={onToggle}>
      {getSelectedValue()}
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
