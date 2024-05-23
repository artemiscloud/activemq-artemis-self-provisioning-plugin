import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
} from '@patternfly/react-core/deprecated';
import type { DropdownProps } from '@patternfly/react-core/deprecated';

export interface IDropdownWithToggleProps {
  id: string;
  toggleId: string;
  value: string;
  name?: string;
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
  id,
  toggleId,
  items,
  value,
  onSelectOption,
  name,
  isLabelAndValueNotSame,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect: DropdownProps['onSelect'] = (e) => {
    if (e && e.currentTarget.textContent) {
      const value: string = e.currentTarget.textContent;
      const filteredOption = items?.filter((item) => item.label === value)[0];
      if (onSelectOption && filteredOption) {
        onSelectOption(filteredOption.value.toLowerCase(), name);
      }
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
      const filteredOption = items?.filter((item) => item.value === value)[0];
      return filteredOption?.label;
    }
    return value;
  };

  const dropdownToggle = (
    <DropdownToggle
      id={toggleId}
      onToggle={(_event, isOpen: boolean) => onToggle(isOpen)}
      data-testid="dropdown-toggle"
    >
      {getSelectedValue()}
    </DropdownToggle>
  );

  return (
    <Dropdown
      name={name}
      id={id}
      onSelect={onSelect}
      toggle={dropdownToggle}
      isOpen={isOpen}
      dropdownItems={getItems(items)}
    />
  );
};
