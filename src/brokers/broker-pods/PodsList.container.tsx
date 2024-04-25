import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  K8sResourceCommon,
  k8sGet,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel, K8sResourceKind } from '../../utils';
import { useTranslation } from '../../i18n';
import { PodsList } from './components/PodList';
import { BrokerDetailsBreadcrumb } from '../../shared-components/BrokerDetailsBreadcrumb';
import {
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

const PodsContainer: FC = () => {
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
  });

  const filterBrokerPods = (pods: K8sResourceCommon[], brokerName: string) => {
    return pods.filter((pod) =>
      pod.metadata?.ownerReferences?.some(
        (ref) => ref.name.startsWith(brokerName) && ref.kind === 'StatefulSet',
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

  useEffect(() => {
    k8sGetBroker();
  }, [namespace, name]);

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((brokerPods: K8sResourceKind) => {
        setBrokerPods([brokerPods]);
      })
      .catch((e) => {
        console.error(e);
        console.error('Pods not found');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className="pf-c-page__main-tabs"
      >
        <div className="pf-u-mt-md pf-u-ml-md pf-u-mb-md">
          <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
          <Title headingLevel="h2">
            {t('broker')} {name}
          </Title>
        </div>
        {!loading && brokerPods.length > 0 && (
          <PodsList
            brokerPods={brokerPods}
            loadError={loadError}
            loaded={!loading}
            brokerName={name}
          />
        )}
      </PageSection>
    </>
  );
};

export default PodsContainer;
