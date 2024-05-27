import { FC } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n';

export type AddressBreadcrumbProps = {
  name: string;
  namespace: string;
  brokerName: string;
  podName: string;
};

const AddressDetailsBreadcrumb: FC<AddressBreadcrumbProps> = ({
  name,
  namespace,
  brokerName,
  podName,
}) => {
  const { t } = useTranslation();

  const redirectBrokerPath = `/k8s/ns/${namespace}/brokers`;
  const redirectBrokerPodsPath = `/k8s/ns/${namespace}/brokers/${brokerName}`;
  const redirectBrokerDetailsPath = `/k8s/ns/${namespace}/brokers/${brokerName}/${podName}`;
  const redirectAddressPath = `/k8s/ns/${namespace}/brokers/${brokerName}/${podName}?tab=addresses`;

  return (
    <Level>
      <LevelItem>
        <Breadcrumb className="pf-u-mb-md">
          <BreadcrumbItem to={redirectBrokerPath}>
            {t('brokers')}
          </BreadcrumbItem>
          <BreadcrumbItem to={redirectBrokerPodsPath}>
            {t('broker')} {brokerName}
          </BreadcrumbItem>
          <BreadcrumbItem to={redirectBrokerDetailsPath}>
            {podName}
          </BreadcrumbItem>
          <BreadcrumbItem to={redirectAddressPath}>
            {t('addresses')}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {t('address')} {name}
          </BreadcrumbItem>
        </Breadcrumb>
      </LevelItem>
    </Level>
  );
};

export { AddressDetailsBreadcrumb };
