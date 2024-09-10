import { FC, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core/deprecated';
import { useTranslation } from '@app/i18n/i18n';
import { k8sDelete } from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '@app/k8s/models';
import { PreConfirmDeleteModal } from '../../../view-brokers/components/PreConfirmDeleteModal/PreConfirmDeleteModal';
import { useNavigate } from 'react-router-dom-v5-compat';

export type BrokerDetailsBreadcrumbProps = {
  name: string;
  namespace: string;
  podName: string;
};

const BrokerDetailsBreadcrumb: FC<BrokerDetailsBreadcrumbProps> = ({
  name,
  namespace,
  podName,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loadError, setLoadError] = useState<any>();
  const navigate = useNavigate();

  const redirectBrokerPath = `/k8s/ns/${namespace}/brokers`;
  const redirectBrokerPodsPath = `/k8s/ns/${namespace}/brokers/${name}`;

  const onClickEditBroker = () => {
    const currentPath = window.location.pathname;
    navigate(
      `/k8s/ns/${namespace}/edit-broker/${name}?returnUrl=${encodeURIComponent(
        currentPath,
      )}`,
    );
  };

  const onClickDeleteBroker = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onDeleteBroker = () => {
    k8sDelete({
      model: AMQBrokerModel,
      resource: { metadata: { name, namespace: namespace } },
    })
      .then(() => {
        navigate(redirectBrokerPath);
      })
      .catch((e) => {
        setLoadError(e.message);
      });
  };

  const dropdownItems = [
    <DropdownItem key="edit-broker" onClick={onClickEditBroker}>
      {t('edit_broker')}
    </DropdownItem>,
    <DropdownItem key="delete-broker" onClick={onClickDeleteBroker}>
      {t('delete_broker')}
    </DropdownItem>,
  ];

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Level>
        <LevelItem>
          <Breadcrumb className="pf-u-mb-md">
            <BreadcrumbItem>
              <Button
                variant="link"
                onClick={() => navigate(redirectBrokerPath)}
              >
                {t('brokers')}
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Button
                variant="link"
                onClick={() => navigate(redirectBrokerPodsPath)}
              >
                {t('broker')} {name}
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{podName}</BreadcrumbItem>
          </Breadcrumb>
        </LevelItem>
        <LevelItem>
          <Dropdown
            onSelect={onSelect}
            toggle={
              <KebabToggle
                data-testid="broker-toggle-kebab"
                onToggle={(_event, isOpen: boolean) => onToggle(isOpen)}
              />
            }
            isOpen={isOpen}
            isPlain
            dropdownItems={dropdownItems}
            position={DropdownPosition.right}
          />
        </LevelItem>
      </Level>
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteBroker}
        isModalOpen={isModalOpen}
        onOpenModal={onOpenModal}
        name={name}
      />
    </>
  );
};

export { BrokerDetailsBreadcrumb };
