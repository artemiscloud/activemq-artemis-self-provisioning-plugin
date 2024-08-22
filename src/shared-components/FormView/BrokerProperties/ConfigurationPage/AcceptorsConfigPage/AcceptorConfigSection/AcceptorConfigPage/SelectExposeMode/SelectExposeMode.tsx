import { ConfigType } from '../../../../ConfigurationPage';

import { FC, useState } from 'react';
import { useTranslation } from '../../../../../../../../i18n/i18n';
import { PresetAlertPopover } from '../PresetAlertPopover/PresetAlertPopover';
import { ExposeMode } from '../../../../../../../../reducers/7.12/reducer';
import { FormGroup } from '@patternfly/react-core';
import {
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core/deprecated';

type SelectExposeModeProps = {
  selectedExposeMode: string;
  setSelectedExposeMode: (issuerName: string) => void;
  clearExposeMode: () => void;
  configName: string;
  configType: ConfigType;
};

export const SelectExposeMode: FC<SelectExposeModeProps> = ({
  selectedExposeMode: selected,
  setSelectedExposeMode: setSelected,
  clearExposeMode: clear,
  configName,
  configType,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const options = Object.values(ExposeMode).map((exposeMode) => (
    <SelectOption key={exposeMode} value={exposeMode} />
  ));

  const onSelect = (_event: any, selection: string, isPlaceholder: any) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    clear();
    setIsOpen(false);
  };

  const filterMatchingOptions = (_: any, value: string) => {
    if (!value) {
      return options;
    }

    const input = new RegExp(value, 'i');
    return options.filter((child) => input.test(child.props.value));
  };

  const titleId = 'typeahead-select-issuer';
  return (
    <FormGroup
      label={t('select_expose_mode')}
      labelIcon={
        <PresetAlertPopover
          configName={configName}
          configType={configType}
          kind="caution"
        />
      }
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={t('select_expose_mode')}
        onToggle={() => setIsOpen(!isOpen)}
        onSelect={onSelect}
        onClear={clearSelection}
        onFilter={filterMatchingOptions}
        selections={selected}
        isOpen={isOpen}
        aria-labelledby={titleId}
        isGrouped
      >
        {options}
      </Select>
    </FormGroup>
  );
};
