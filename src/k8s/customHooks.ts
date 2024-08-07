import { useState } from 'react';
import { BrokerCR } from './types';
import { k8sGet } from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from './models';

export const UseGetBrokerCR = (
  brokerName: string,
  namespace: string,
): { brokerCr: BrokerCR; isLoading: boolean; error: string } => {
  const [brokerDetails, setBrokerDetails] = useState<BrokerCR>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name: brokerName, ns: namespace })
      .then((broker: BrokerCR) => {
        setBrokerDetails(broker as BrokerCR);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [isFirstMount, setIsFirstMount] = useState(true);
  if (isFirstMount) {
    k8sGetBroker();
    setIsFirstMount(false);
  }

  return { brokerCr: brokerDetails, isLoading: loading, error: error };
};
