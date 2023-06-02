import { FC, Suspense, useState, useEffect } from 'react';
import { load } from 'js-yaml';
import { Alert, AlertVariant, AlertGroup } from '@patternfly/react-core';
import {
  ResourceYAMLEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel, K8sResourceCommon } from '../../../../utils';
import { Loading } from '../../../../shared-components';
import { useTranslation } from '../../../../i18n';

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
  initialResourceYAML,
  notification,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<K8sResourceCommon>();
  const [canCreateBroker, loadingAccessReview] = useAccessReview({
    group: AMQBrokerModel.apiGroup,
    resource: AMQBrokerModel.plural,
    namespace,
    verb: 'create',
  });

  useEffect(() => {
    setData(initialResourceYAML);
  }, [initialResourceYAML]);

  const onSave = (content: string) => {
    const yamlData: K8sResourceCommon = load(content);
    setData(yamlData);
    onCreateBroker(yamlData);
  };

  if (loadingAccessReview) return <Loading />;

  return (
    <>
      {canCreateBroker ? (
        <>
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
            <ResourceYAMLEditor
              initialResource={data}
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
