import { FC, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { PreConfirmDeleteModal } from '../../../view-brokers/components/PreConfirmDeleteModal/PreConfirmDeleteModal';
import { useTranslation } from '../../../../i18n/i18n';
import { k8sDelete } from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '../../../../k8s/models';
import { useNavigate } from 'react-router-dom-v5-compat';

export type BrokerPodsBreadcrumbProps = {
  name: string;
  namespace: string;
};

const BrokerPodsBreadcrumb: FC<BrokerPodsBreadcrumbProps> = ({
  name,
  namespace,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loadError, setLoadError] = useState<any>();
  const navigate = useNavigate();

  const redirectPath = `/k8s/ns/${namespace}/brokers`;

  const onClickEditBroker = () => {
    navigate(`/k8s/ns/${namespace}/edit-broker/${name}`);
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
        navigate(redirectPath);
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

  const onFocus = () => {
    const element = document.getElementById('toggle-kebab');
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  return (
    <>
      <Level>
        <LevelItem>
          <Breadcrumb className="pf-u-mb-md">
            <BreadcrumbItem>
              <Button variant="link" onClick={() => navigate(redirectPath)}>
                {t('brokers')}
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>
              {t('broker')} {name}
            </BreadcrumbItem>
          </Breadcrumb>
        </LevelItem>
        <LevelItem>
          <Dropdown
            onSelect={onSelect}
            toggle={
              <KebabToggle
                data-testid="broker-toggle-kebab"
                onToggle={onToggle}
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

export { BrokerPodsBreadcrumb };
