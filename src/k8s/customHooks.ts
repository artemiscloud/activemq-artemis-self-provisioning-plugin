import { useState } from 'react';
import { Ingress } from './types';
import { k8sGet } from '@openshift-console/dynamic-plugin-sdk';
import { IngressDomainModel } from './models';

export const UseGetIngressDomain = (): {
  clusterDomain: string;
  isLoading: boolean;
  error: string;
} => {
  const [domain, setDomain] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: IngressDomainModel, name: 'cluster' })
      .then((ing: Ingress) => {
        setDomain(ing.spec.domain);
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

  return { clusterDomain: domain, isLoading: loading, error: error };
};
