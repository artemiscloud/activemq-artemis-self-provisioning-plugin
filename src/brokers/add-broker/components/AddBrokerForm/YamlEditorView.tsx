import { FC, Suspense, useContext } from 'react';
import { Alert, AlertVariant, AlertGroup, Page } from '@patternfly/react-core';
import {
  CodeEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel, BrokerCR } from '../../../../utils';
import { Loading } from '../../../../shared-components';
import { useTranslation } from '../../../../i18n';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
} from '../../../../reducers/7.12/reducer';
import { BrokerActionGroup } from './ActionGroup';
import { useHistory } from 'react-router';
import YAML from 'yaml';

export type YamlEditorViewProps = {
  onCreateBroker: (content: any) => void;
  initialResourceYAML: BrokerCR;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  isUpdate: boolean;
};

const YamlEditorView: FC<YamlEditorViewProps> = ({
  onCreateBroker,
  notification,
  isUpdate,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

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
  };

  const onCancel = () => {
    history.push('/k8s/all-namespaces/brokers');
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
          variant={AlertVariant.default}
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
