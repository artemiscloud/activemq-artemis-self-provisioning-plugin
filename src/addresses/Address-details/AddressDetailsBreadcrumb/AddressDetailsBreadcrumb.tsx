import { FC } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
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
  podName,
}) => {
  const { t } = useTranslation();

  const redirectBrokerPodsPath = `/k8s/ns/${namespace}/pods`;
  const redirectPodsDetailsPath = `/k8s/ns/${namespace}/pods/${podName}`;
  const redirectAddressPath = `/k8s/ns/${namespace}/pods/${podName}/addresses`;
  const navigate = useNavigate();

  return (
    <Level>
      <LevelItem>
        <Breadcrumb className="pf-u-mb-md">
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate(redirectBrokerPodsPath)}
            >
              {t('Pods')}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              variant="link"
              onClick={() => navigate(redirectPodsDetailsPath)}
            >
              {t('Pod details')}
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
