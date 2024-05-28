import { FC, Suspense } from 'react';
import { load } from 'js-yaml';
import { Alert, AlertVariant, AlertGroup } from '@patternfly/react-core';
import {
  ResourceYAMLEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  AMQBrokerModel,
  K8sResourceCommon as ArtemisCR,
} from '../../../../utils';
import { Loading } from '../../../../shared-components';
import { useTranslation } from '../../../../i18n';
import { convertYamlToForm } from '../../../../brokers/utils';
import {
  ArtemisReducerAction,
  ArtemisReducerFields,
} from '../../AddTlsBroker.component';

export type YamlEditorViewProps = {
  namespace: string;
  cr: ArtemisCR;
  dispatch: React.Dispatch<ArtemisReducerAction>;
  serverNotification: {
    title: string;
    variant: AlertVariant;
  };
};

const YamlEditorView: FC<YamlEditorViewProps> = ({
  namespace,
  cr,
  dispatch,
  serverNotification,
}) => {
  const { t } = useTranslation();
  const [canCreateBroker, loadingAccessReview] = useAccessReview({
    group: AMQBrokerModel.apiGroup,
    resource: AMQBrokerModel.plural,
    namespace,
    verb: 'create',
  });

  const onSave = (content: string) => {
    dispatch({
      field: ArtemisReducerFields.ALL,
      value: load(content) as ArtemisCR,
    });
  };

  if (loadingAccessReview) return <Loading />;

  return (
    <>
      {canCreateBroker ? (
        <>
          {serverNotification.title && (
            <AlertGroup>
              <Alert
                data-test="add-broker-notification-yaml-view"
                title={serverNotification.title}
                variant={serverNotification.variant}
                isInline
                actionClose
                className="pf-u-mt-md pf-u-mx-md"
              />
            </AlertGroup>
          )}
          <Suspense fallback={<Loading />}>
            <ResourceYAMLEditor
              initialResource={convertYamlToForm(cr)}
              header={t('create_resource')}
              onSave={onSave}
            />
          </Suspense>
        </>
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
