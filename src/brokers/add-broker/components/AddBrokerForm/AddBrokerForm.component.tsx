import { FC, Suspense, useState, useEffect } from 'react';
import { load } from 'js-yaml';
import { Alert, AlertVariant, Page } from '@patternfly/react-core';
import {
  ResourceYAMLEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel, K8sResourceCommon } from '../../../../utils';
import { Loading } from '../../../../shared-components';
import { useTranslation } from '../../../../i18n';

export type AddBrokerFormProps = {
  onCreateBroker: (content: any) => void;
  namespace: string;
  initialResourceYAML: K8sResourceCommon;
};

const AddBrokerForm: FC<AddBrokerFormProps> = ({
  onCreateBroker,
  namespace,
  initialResourceYAML,
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
    // const name = yamlData.metadata?.name;
    // handleNameChange('name', name)
    onCreateBroker(yamlData);
  };

  if (loadingAccessReview) return <Loading />;

  return (
    <>
      {canCreateBroker ? (
        <Page>
          <Suspense fallback={<Loading />}>
            <ResourceYAMLEditor
              initialResource={data}
              header={t('create_resource')}
              onSave={onSave}
            />
          </Suspense>
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
export { AddBrokerForm };
