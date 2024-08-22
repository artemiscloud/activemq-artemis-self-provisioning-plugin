import { FC, Suspense, useContext } from 'react';
import {
  Alert,
  AlertVariant,
  AlertGroup,
  Page,
  ActionGroup,
  Button,
} from '@patternfly/react-core';
import {
  CodeEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '../../k8s/models';
import { BrokerCR } from '../../k8s/types';
import { Loading } from '../../shared-components/Loading/Loading';
import { useTranslation } from '../../i18n/i18n';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
} from '../../reducers/7.12/reducer';
import YAML from 'yaml';
import { useNavigate } from 'react-router-dom-v5-compat';

export type YamlEditorViewProps = {
  onCreateBroker: (content: any) => void;
  initialResourceYAML: BrokerCR;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  isUpdate: boolean;
  returnUrl: string;
};

interface BrokerActionGroupProps {
  isUpdate: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const BrokerActionGroup: FC<BrokerActionGroupProps> = ({
  isUpdate,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <ActionGroup className="pf-u-mt-sm pf-u-mb-sm">
      <Button
        variant="primary"
        type="submit"
        onClick={onSubmit}
        className="pf-u-ml-sm"
      >
        {isUpdate ? t('apply') : t('create')}
      </Button>
      <Button variant="link" onClick={onCancel}>
        {t('cancel')}
      </Button>
    </ActionGroup>
  );
};

const YamlEditorView: FC<YamlEditorViewProps> = ({
  onCreateBroker,
  notification,
  isUpdate,
  returnUrl,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fromState = useContext(BrokerCreationFormState);
  const namespace = fromState.cr.metadata.namespace;
  const dispatch = useContext(BrokerCreationFormDispatch);

  const [canCreateBroker, loadingAccessReview] = useAccessReview({
    group: AMQBrokerModel.apiGroup,
    resource: AMQBrokerModel.plural,
    namespace,
    verb: 'create',
  });

  const onSave = () => {
    const yamlData: BrokerCR = fromState.cr;
    onCreateBroker(yamlData);
    navigate(returnUrl);
  };

  const onCancel = () => {
    navigate(returnUrl);
  };

  //event: contains information of changes
  //value: contains full yaml model
  const onChanges = (newValue: any, _event: any) => {
    dispatch({
      operation: ArtemisReducerOperations.setModel,
      payload: { model: YAML.parse(newValue) },
    });
  };

  if (loadingAccessReview) return <Loading />;

  return (
    <>
      {canCreateBroker ? (
        <Page>
          {notification.title && (
            <AlertGroup>
              <Alert
                data-test="add-broker-notification-yaml-view"
                title={notification.title}
                variant={notification.variant}
                isInline
                actionClose
                className="pf-u-mt-md pf-u-mx-md"
              />
            </AlertGroup>
          )}
          <Suspense fallback={<Loading />}>
            <CodeEditor
              value={YAML.stringify(fromState.cr, null, '  ')}
              language="yaml"
              onChange={onChanges}
            />
          </Suspense>
          <BrokerActionGroup
            isUpdate={isUpdate}
            onSubmit={onSave}
            onCancel={onCancel}
          ></BrokerActionGroup>
        </Page>
      ) : (
        <Alert
          variant={AlertVariant.custom}
          title={t('broker_can_not_be_created')}
          isInline
        >
          {t('you_do_not_have_write_access')}
        </Alert>
      )}
    </>
  );
};
export { YamlEditorView };
