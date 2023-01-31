import { useState, useEffect } from 'react';
import ConfigurationPage from './BrokerConfiguration.component';
import { BorkerConfigurationSettings } from "./types";
import { AMQBrokerModel, K8sResourceCommon, timeAgo } from '../../utils';
import { k8sGet } from '@openshift-console/dynamic-plugin-sdk';
import { Loading } from '../../shared-components';
import { useHistory } from 'react-router';

export type ConfigurationPageProps = {
  name: string;
  namespace: string;
}

const ConfigurationPageContainer: React.FC<ConfigurationPageProps> = ({ name, namespace }) => {

  const history = useHistory();
  const [configurationSettings, setConfigurationSettings] = useState<BorkerConfigurationSettings>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleEditClick = () => {
    history.push(`/k8s/ns/${namespace}/edit-broker/${name}`)
  }

  const getConfigurationSettings = async () => {
    setLoading(true);
     k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((broker: K8sResourceCommon) => {
        setConfigurationSettings({
          name: broker.metadata.name,
          status: Object.keys(broker.status.podStatus)[0],
          size: broker.spec.deploymentPlan.size,
          persistanceEnabled: broker.spec.deploymentPlan.persistenceEnabled,
          messageMigrationEnabled: broker.spec.deploymentPlan.messageMigration,
          image: broker.spec.deploymentPlan.image,
          created: timeAgo(new Date(broker.metadata.creationTimestamp))
        })
      })
      .catch((e) => {
        console.error(e);
      }).finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
      (async () =>{ 
        await getConfigurationSettings();
      })();
  }, []);

  if (loading && !configurationSettings) return <Loading />;
  return (
    <ConfigurationPage
      configurationData={configurationSettings}
      onEditClick={handleEditClick}
    />
  );
}

export default ConfigurationPageContainer