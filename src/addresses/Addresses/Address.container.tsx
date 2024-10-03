import { FC } from 'react';
import { Addresses } from './Address.component';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useParams } from 'react-router-dom-v5-compat';
import { useGetBrokerCR } from '@app/k8s/customHooks';

export const AddressContainer: FC = () => {
  const { ns: namespace, name: podName } = useParams<{
    ns?: string;
    name?: string;
  }>();
  const brokerName = podName?.match(/(.*)-ss-\d+/)?.[1] ?? '';

  const isBrokerPod = !!brokerName && podName.startsWith(`${brokerName}-ss-`);

  const { brokerCr: brokerDetails } = useGetBrokerCR(brokerName, namespace);

  const podOrdinal = parseInt(podName.replace(brokerName + '-ss-', ''));

  return (
    <JolokiaAuthentication brokerCR={brokerDetails} podOrdinal={podOrdinal}>
      <Addresses isBrokerPod={isBrokerPod} />
    </JolokiaAuthentication>
  );
};

export const App: FC = () => {
  return <AddressContainer />;
};
