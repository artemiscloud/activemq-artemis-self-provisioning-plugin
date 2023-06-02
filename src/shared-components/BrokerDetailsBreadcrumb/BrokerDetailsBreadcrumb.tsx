import { FC } from 'react';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useTranslation } from '../../i18n';

export type BrokerDetailsBreadcrumbProps = {
  name: string;
  namespace: string;
};

const BrokerDetailsBreadcrumb: FC<BrokerDetailsBreadcrumbProps> = ({
  name,
  namespace,
}) => {
  const { t } = useTranslation();

  let redirectPath: string;
  redirectPath = `/k8s/ns/${namespace}/brokers`;

  if (namespace === undefined) {
    redirectPath = '/k8s/all-namespaces/brokers';
  }

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
