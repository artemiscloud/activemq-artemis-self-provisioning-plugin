import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useTranslation } from '../i18n';
import { FC } from 'react';

export type BrokerDetailsBreadcrumbProps = {
  name: string;
  namespace: string;
};

const BrokerDetailsBreadcrumb: FC<BrokerDetailsBreadcrumbProps> = ({
  name,
  namespace,
}) => {
  let redirectPath: string;
  if (namespace === undefined) {
    redirectPath = '/k8s/all-namespaces/brokers';
  } else {
    redirectPath = `/k8s/ns/${namespace}/brokers`;
  }

  const { t } = useTranslation();

  return (
    <Breadcrumb className="pf-u-mb-md">
      <BreadcrumbItem to={redirectPath}>{t('brokers')}</BreadcrumbItem>
      <BreadcrumbItem isActive>
        {t('broker')} {name}
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export { BrokerDetailsBreadcrumb };
