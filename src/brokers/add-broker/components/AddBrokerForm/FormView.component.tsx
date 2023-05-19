import { FC, useState } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Alert,
  Button,
  AlertGroup,
  Grid,
  GridItem,
  ActionListItem,
  ActionList,
  // AlertActionCloseButton
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { Link } from 'react-router-dom';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

type FormViewProps = {
  data: K8sResourceCommon;
  handleNameChange: (fieldName: string, value: string) => void;
};

export const FormView: FC<FormViewProps> = ({ data, handleNameChange }) => {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const onSubmitHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (data.metadata.name) {
      setShowAlert(true);
    }
  };

  return (
    <Grid className="pf-u-mx-md">
      <GridItem span={6}>
        {showAlert && <Alert variant="info" isInline title={t('info_alert')} />}
        <Form
          onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
          }}
        >
          <FormGroup
            className="pf-u-min-height"
            label={t('name')}
            isRequired
            fieldId="name"
          >
            <TextInput
              isRequired
              type="text"
              id="name"
              name="name"
              value={data.metadata.name}
              onChange={(value) => handleNameChange('name', value)}
            />
          </FormGroup>
          <ActionList>
            <ActionListItem>
              <Button variant="primary" type="submit" onClick={onSubmitHandler}>
                {t('create')}
              </Button>
              <AlertGroup>{showAlert}</AlertGroup>
            </ActionListItem>
            <Button variant="link">
              <Link to="/k8s/all-namespaces/brokers">Cancel</Link>
            </Button>
          </ActionList>
        </Form>
      </GridItem>
    </Grid>
  );
};
