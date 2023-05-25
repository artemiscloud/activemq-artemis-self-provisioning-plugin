import { FC } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Alert,
  Button,
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
  onChangeField: (fieldName: string, value: string) => void;
  onCreateBroker: (content: any) => void;
};

export const FormView: FC<FormViewProps> = ({
  data,
  onChangeField,
  onCreateBroker,
}) => {
  const { t } = useTranslation();

  const onSubmitHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    //e.preventDefault();
    onCreateBroker(data);
  };

  return (
    <Grid className="pf-u-mx-md">
      <GridItem span={6}>
        <div className="pf-u-pb-md">
          <Alert
            variant="info"
            isInline
            title={t('create_broker_form_info_alert')}
          />
        </div>
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
              onChange={(value) => onChangeField('name', value)}
            />
          </FormGroup>
          <ActionList>
            <ActionListItem>
              <Button variant="primary" type="submit" onClick={onSubmitHandler}>
                {t('create')}
              </Button>
              {/* //<AlertGroup>{showAlert}</AlertGroup> */}
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
