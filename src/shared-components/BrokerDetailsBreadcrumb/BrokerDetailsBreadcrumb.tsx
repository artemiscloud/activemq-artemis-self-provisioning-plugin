import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Level,
  LevelItem,
} from '@patternfly/react-core';
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
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  let redirectPath: string;
  redirectPath = `/k8s/ns/${namespace}/brokers`;

  if (namespace === undefined) {
    namespace = 'all-namespaces';
    redirectPath = `/k8s/${namespace}/brokers`;
  }

  const onClickEditBroker = () => {
    history.push(`/k8s/ns/${namespace}/edit-broker/${name}`);
  };

  const onClickDeleteBroker = () => {
    //Todo: add logic to open delete modal
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
    <Level>
      <LevelItem>
        <Breadcrumb className="pf-u-mb-md">
          <BreadcrumbItem to={redirectPath}>{t('brokers')}</BreadcrumbItem>
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
  );
};

export { BrokerDetailsBreadcrumb };
