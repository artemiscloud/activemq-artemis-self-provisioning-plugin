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
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { Link } from 'react-router-dom';
type validate = 'success' | 'warning' | 'error' | 'default';

export const FormView: FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [validated, setValidated] = useState<validate>('error');

  const handleNameChange = (name: string) => {
    setName(name);
    if (name === ' ') {
      setValidated('default');
    } else if (!isNaN(+name)) {
      setValidated('success');
    } else {
      setValidated('error');
    }
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (name) {
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
            label={t('name')}
            isRequired
            fieldId="name"
            validated={validated}
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
          <ActionList>
            <ActionListItem>
              <Button variant="primary" type="submit" onClick={onSubmitHandler}>
                Submit
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
