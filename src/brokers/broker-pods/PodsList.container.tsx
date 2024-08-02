import { FC, useEffect, useState } from 'react';
import {
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceKind } from '../../k8s/types';
import { useTranslation } from '../../i18n/i18n';
import { PodsList } from './components/PodList';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  PageSection,
  PageSectionVariants,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { ErrorCircleOIcon, SearchIcon } from '@patternfly/react-icons';
import { BrokerPodsBreadcrumb } from './components/BrokerPodsBreadcrumb/BrokerPodsBreadcrumb';
import { useParams } from 'react-router-dom-v5-compat';

export const PodsContainer: FC = () => {
  //states
  const { t } = useTranslation();
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const [brokerPods, setBrokerPods] = useState<K8sResourceKind[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pods, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      version: 'v1',
      kind: 'Pod',
    },
    isList: true,
    namespaced: true,
    namespace: namespace,
  });

  const filterBrokerPods = (pods: K8sResourceCommon[], brokerName: string) => {
    const regex = new RegExp(`^${brokerName}-ss$`);
    return pods.filter((pod) =>
      pod.metadata?.ownerReferences?.some(
        (ref) => regex.test(ref.name) && ref.kind === 'StatefulSet',
      ),
    );
  };

  useEffect(() => {
    if (loaded && !loadError) {
      setLoading(false);
      const filteredPods = filterBrokerPods(pods, name);
      setBrokerPods(filteredPods);
    }
  }, [pods, name, loaded, loadError]);

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className="pf-c-page__main-tabs"
      >
        <div className="pf-u-mt-md pf-u-mb-md">
          <BrokerPodsBreadcrumb name={name} namespace={namespace} />
          <Title headingLevel="h2" className="pf-u-ml-md">
            {t('broker')} {name}
          </Title>
        </div>
        {loadError && (
          <EmptyState>
            <EmptyStateIcon icon={ErrorCircleOIcon} />
            <Title size="lg" headingLevel="h4">
              Error while retrieving the pods list.
            </Title>
            <EmptyStateBody>No results match.</EmptyStateBody>
          </EmptyState>
        )}
        {loading && !loadError && (
          <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <Title size="lg" headingLevel="h4">
              Loading
            </Title>
          </EmptyState>
        )}
        {!loading && !loadError && brokerPods.length === 0 && (
          <EmptyState>
            <EmptyStateIcon icon={SearchIcon} />
            <Title size="lg" headingLevel="h4">
              No results found. Check the status of the deployment.
            </Title>
            <EmptyStateBody>No results match.</EmptyStateBody>
          </EmptyState>
        )}
        {!loading && !loadError && brokerPods.length > 0 && (
          <PodsList
            brokerPods={brokerPods}
            loadError={loadError}
            loaded={!loading}
          />
        )}
      </PageSection>
    </>
  );
};
