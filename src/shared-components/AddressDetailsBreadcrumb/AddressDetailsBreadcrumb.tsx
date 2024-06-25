import { FC } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n';
import { useNavigate } from 'react-router-dom-v5-compat';

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
  const navigate = useNavigate();

  return (
    <Level>
      <LevelItem>
        <Breadcrumb className="pf-u-mb-md">
          <BreadcrumbItem>
            <Button variant="link" onClick={() => navigate(redirectBrokerPath)}>
              {t('brokers')}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate(redirectBrokerPodsPath)}
            >
              {t('broker')} {brokerName}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate(redirectBrokerDetailsPath)}
            >
              {podName}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate(redirectAddressPath)}
            >
              {t('addresses')}
            </Button>
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
