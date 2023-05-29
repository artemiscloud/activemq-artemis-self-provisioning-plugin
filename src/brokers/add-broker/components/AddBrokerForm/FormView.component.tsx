import { FC, useState } from 'react';
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
  FormHelperText,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { Link } from 'react-router-dom';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
//import "../../components/styles.css"

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
  type validate = 'success' | 'warning' | 'error' | 'default';
  const [validated, setValidated] = useState<validate>('error');

  const validateName = (value: string) => {
    const regex =
      /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/i;
    if (value === '') {
      setValidated('default');
    } else if (regex.test(value)) {
      setValidated('success');
    } else {
      setValidated('error');
    }
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onCreateBroker(data);
  };

  // const divStyle = {
  //   '--pf-u-min-height--MinHeight': '50ch',
  // } as React.CSSProperties;
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
        {/* <div
          className="pf-u-min-height"
          style={divStyle}
        > */}
        <Form
          onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
          }}
          className="pf-u-h-75vh"
          //  style={{"height":"100%"}}
        >
          <FormGroup
            label={t('name')}
            isRequired
            fieldId="name"
            helperText={
              <FormHelperText
                icon={<ExclamationCircleIcon />}
                isHidden={validated !== 'default'}
              >
                {t('form_helper_text')}
              </FormHelperText>
            }
            helperTextInvalid={t('helper_text_invalid')}
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={validated}
          >
            <TextInput
              isRequired
              type="text"
              id="name"
              name="name"
              value={data.metadata.name}
              validated={validated}
              onChange={(value) => {
                onChangeField('name', value);
                validateName(value);
              }}
            />
          </FormGroup>
          {/* //<div className="button-container pf-c-sticky-footer"> */}
          {/* <footer> */}
          <ActionList>
            <ActionListItem>
              <Button variant="primary" type="submit" onClick={onSubmitHandler}>
                {t('create')}
              </Button>
            </ActionListItem>
            <Button variant="link">
              <Link to="/k8s/all-namespaces/brokers">Cancel</Link>
            </Button>
          </ActionList>
          {/* </footer> */}
          {/* </div> */}
        </Form>
      </GridItem>
    </Grid>
  );
};
