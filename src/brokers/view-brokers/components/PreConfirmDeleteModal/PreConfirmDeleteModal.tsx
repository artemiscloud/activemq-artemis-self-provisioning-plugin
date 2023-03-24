import { FC } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { Trans } from 'react-i18next';

interface PreConfirmDeleteModalProps {
  isModalOpen: boolean;
  onDeleteButtonClick: () => void;
  onOpenModal: () => void;
  name: string;
}

const PreConfirmDeleteModal: FC<PreConfirmDeleteModalProps> = ({
  onDeleteButtonClick,
  isModalOpen,
  onOpenModal,
  name,
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
          <Trans>{t('delete')}</Trans>
        </Button>,
        <Button key="cancel" variant="link" onClick={onOpenModal}>
          <Trans>{t('cancel')}</Trans>
        </Button>,
      ]}
    >
      <TextContent>
        <Text component={TextVariants.h6}>
          {' '}
          <Trans
            i18nKey={t('preconfirm_delete_broker_message', { name })}
          ></Trans>
        </Text>
      </TextContent>
    </Modal>
  );
};

export { PreConfirmDeleteModal };
