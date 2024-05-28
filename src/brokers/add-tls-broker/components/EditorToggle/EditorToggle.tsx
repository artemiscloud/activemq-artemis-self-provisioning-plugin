import React from 'react';
import { Flex, Radio } from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { EditorType } from '../../../utils/add-broker';

type EditorToggleProps = {
  isFormEditor: boolean;
  switchFunction?: () => void;
};

export const EditorToggle: React.FC<EditorToggleProps> = ({
  isFormEditor,
  switchFunction,
}) => {
  const { t } = useTranslation();
  const handleChange = (
    _checked: boolean,
    _event: React.FormEvent<HTMLInputElement>,
  ) => {
    switchFunction();
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
          isChecked={isFormEditor}
          name={EditorType.Form}
          onChange={handleChange}
          label={t('form_view')}
          id={EditorType.Form}
          value={EditorType.Form}
        />
        <Radio
          isChecked={!isFormEditor}
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
