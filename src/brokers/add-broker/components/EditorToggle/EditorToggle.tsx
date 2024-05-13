import React from 'react';
import { Flex, Radio } from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { EditorType } from '../../../utils/add-broker';

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
          isChecked={value === EditorType.Form}
          name={EditorType.Form}
          onChange={(event, _checked: boolean) => handleChange(_checked, event)}
          label={t('form_view')}
          id={EditorType.Form}
          value={EditorType.Form}
        />
        <Radio
          isChecked={value === EditorType.YAML}
          name={EditorType.YAML}
          onChange={(event, _checked: boolean) => handleChange(_checked, event)}
          label={t('yaml_view')}
          id={EditorType.YAML}
          value={EditorType.YAML}
          data-test={`${EditorType.YAML}-view-input`}
        />
      </Flex>
    </div>
  );
};
