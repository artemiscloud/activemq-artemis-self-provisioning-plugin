import { FC, Suspense, useState } from 'react';
import { load } from 'js-yaml';
import { Alert, AlertVariant, Page } from '@patternfly/react-core';
import {
  ResourceYAMLEditor,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '../../utils';
import { Loading } from '../../shared-components';

export type EditorPageProps = {
  onCreateBroker: (content: any) => void;
  namespace: string;
};

const EditorPage: FC<EditorPageProps> = ({ onCreateBroker, namespace }) => {
  const initialResourceYAML = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'default',
      namespace,
    },
    spec: {
      deploymentPlan: {
        size: 1,
      },
    },
  };

  const [data, setData] = useState<any>(initialResourceYAML);
  const [canCreateBroker, loadingAccessReview] = useAccessReview({
    group: AMQBrokerModel.apiGroup,
    resource: AMQBrokerModel.plural,
    namespace,
    verb: 'create',
  });

  const onSave = (content: string) => {
    setData(load(content));
    onCreateBroker(load(content));
  };

  if (loadingAccessReview) return <Loading />;

  return (
    <>
      {canCreateBroker ? (
        <Page>
          <Suspense fallback={<></>}>
            <ResourceYAMLEditor
              initialResource={data}
              header="Simple Pod"
              onSave={onSave}
            />
          </Suspense>
        </Page>
      ) : (
        <Alert
          variant={AlertVariant.default}
          title={'Broker cannot be created'}
          isInline
        >
          {'You do not have write access in this project.'}
        </Alert>
      )}
    </>
  );
};

export { EditorPage };
