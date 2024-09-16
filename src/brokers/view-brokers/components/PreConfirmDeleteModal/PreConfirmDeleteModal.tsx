import { FC } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
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
      title={t('Delete instance ?')}
      titleIconVariant="warning"
      isOpen={isModalOpen}
      onClose={onOpenModal}
      actions={[
        <Button key="delete" variant="danger" onClick={onDeleteButtonClick}>
          {t('Delete')}
        </Button>,
        <Button key="cancel" variant="link" onClick={onOpenModal}>
          {t('Cancel')}
        </Button>,
      ]}
    >
      <TextContent>
        <Text component={TextVariants.h6}>
          <Trans
            i18nKey={t(
              'The <strong>{{name}}</strong> instance will be deleted. Applications will no longer have access in this instance.',
              { name },
            )}
          ></Trans>
        </Text>
      </TextContent>
    </Modal>
  );
};

export { PreConfirmDeleteModal };
