import React from 'react';
import { Flex, Radio } from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n/i18n';
import { EditorType } from '../../../../reducers/7.12/reducer';

type EditorToggleProps = {
  value: EditorType;
  onChange?: (editorType: EditorType) => void;
};

export const EditorToggle: React.FC<EditorToggleProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const handleChange = (
    _checked: boolean,
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    onChange(event?.currentTarget?.value as EditorType);
  };
  return (
    <div className="pf-u-mx-md pf-u-my-sm">
      <Flex
        spaceItems={{ default: 'spaceItemsMd' }}
        alignItems={{ default: 'alignItemsCenter' }}
        role="radiogroup"
        aria-labelledby="radio-group-title-editor-toggle"
      >
        <label id="radio-group-title-editor-toggle">{t('configure_via')}</label>
        <Radio
          isChecked={value === EditorType.BROKER}
          name={EditorType.BROKER}
          onChange={handleChange}
          label={t('broker_view')}
          id={EditorType.BROKER}
          value={EditorType.BROKER}
        />
        <Radio
          isChecked={value === EditorType.YAML}
          name={EditorType.YAML}
          onChange={handleChange}
          label={t('yaml_view')}
          id={EditorType.YAML}
          value={EditorType.YAML}
          data-test={`${EditorType.YAML}-view-input`}
        />
      </Flex>
    </div>
  );
};
