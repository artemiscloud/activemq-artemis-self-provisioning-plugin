import { FC } from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { Trans } from 'react-i18next';

interface PreConfirmDeleteModalProps {
  isModalOpen: boolean;
  onDeleteButtonClick: () => void;
  onOpenModal: () => void;
}

const PreConfirmDeleteModal: FC<PreConfirmDeleteModalProps> = ({
  onDeleteButtonClick,
  isModalOpen,
  onOpenModal,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      variant={ModalVariant.small}
      title={t('delete_modal_instance_title')}
      titleIconVariant="warning"
      isOpen={isModalOpen}
      onClose={onOpenModal}
      actions={[
        <Button key="delete" variant="primary" onClick={onDeleteButtonClick}>
          {t('delete')}
        </Button>,
        <Button key="cancel" variant="link" onClick={onOpenModal}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Trans i18nKey={t('preconfirm_delete_broker_message')}></Trans>
    </Modal>
  );
};

export { PreConfirmDeleteModal };
