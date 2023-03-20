import { FC, Fragment } from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';

interface OnDeleteClickProps {
  isModalOpen: boolean;
  onDeleteButtonClick: () => void;
  handleModalToggle: () => void;
}

const PreConfirmDeleteModal: FC<OnDeleteClickProps> = ({
  onDeleteButtonClick,
  isModalOpen,
  handleModalToggle,
}) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Modal
        variant={ModalVariant.small}
        title={t('delete_instance_?')}
        titleIconVariant="warning"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="delete" variant="primary" onClick={onDeleteButtonClick}>
            {t('delete_broker_instance')}
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            {t('cancel_broker_instance')}
          </Button>,
        ]}
      >
        {t('preconfirm_delete_broker_message')}
      </Modal>
    </Fragment>
  );
};

export { PreConfirmDeleteModal };
