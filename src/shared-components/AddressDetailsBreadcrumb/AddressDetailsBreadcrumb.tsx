import { FC } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n';
import { useHistory } from 'react-router';

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
  const history = useHistory();

  return (
    <Level>
      <LevelItem>
        <Breadcrumb className="pf-u-mb-md">
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => history.push(redirectBrokerPath)}
            >
              {t('brokers')}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => history.push(redirectBrokerPodsPath)}
            >
              {t('broker')} {brokerName}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => history.push(redirectBrokerDetailsPath)}
            >
              {podName}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => history.push(redirectAddressPath)}
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
