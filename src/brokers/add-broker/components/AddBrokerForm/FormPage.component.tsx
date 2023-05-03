import { FC, useState } from 'react';
import { Form, FormGroup, TextInput, Alert } from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';

export const FormPage: FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleNameChange = (name: string) => {
    setName(name);
  };

  return (
    <Form>
      <Alert
        variant="info"
        isInline
        title={t('small_note')}
        className="pf-u-mx-sm"
      />
      <FormGroup
        label={t('name')}
        isRequired
        fieldId="name"
        className="pf-u-mx-md"
      >
        <TextInput
          isRequired
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
        />
      </FormGroup>
    </Form>
  );
};
