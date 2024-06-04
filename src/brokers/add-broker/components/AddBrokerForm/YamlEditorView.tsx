import { FC, Suspense, useContext } from 'react';
import {
  Alert,
  AlertVariant,
  AlertGroup,
  Button,
  Page,
} from '@patternfly/react-core';
import {
  CodeEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel, K8sResourceCommon } from '../../../../utils';
import { Loading } from '../../../../shared-components';
import { useTranslation } from '../../../../i18n';
import { BrokerCreationFormState } from '../../../utils';
//import _ from 'lodash';

export type YamlEditorViewProps = {
  onCreateBroker: (content: any) => void;
  namespace: string;
  initialResourceYAML: K8sResourceCommon;
  notification: {
    title: string;
    variant: AlertVariant;
  };
};

const YamlEditorView: FC<YamlEditorViewProps> = ({
  onCreateBroker,
  namespace,
  notification,
}) => {
  const { t } = useTranslation();

  //  const [data, setData] = useState<K8sResourceCommon>();
  const fromState = useContext(BrokerCreationFormState);

  const [canCreateBroker, loadingAccessReview] = useAccessReview({
    group: AMQBrokerModel.apiGroup,
    resource: AMQBrokerModel.plural,
    namespace,
    verb: 'create',
  });

  const onSave = () => {
    const yamlData: K8sResourceCommon = fromState.cr;
    onCreateBroker(yamlData);
  };

  //event: contains information of changes
  //value: contains full yaml model
  const onChanges = (newValue: any, _event: any) => {
    //yamlValue.yamlData = JSON.parse(newValue);
    //instead of blatantly replce the whole contents
    //compare them and only accept additive contents, or
    // else warning and refuse to update.
    console.log('old value:', fromState.cr);
    console.log('new value', JSON.parse(newValue));
    Object.assign(fromState.cr, JSON.parse(newValue));
    //_.merge(yamlValue.yamlData, newValue);

    console.log('module after merge:', fromState.cr);
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
              value={JSON.stringify(fromState.cr, null, '  ')}
              language="yaml"
              onSave={onSave}
              onChange={onChanges}
            />
          </Suspense>
          <Button>Save</Button>
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
