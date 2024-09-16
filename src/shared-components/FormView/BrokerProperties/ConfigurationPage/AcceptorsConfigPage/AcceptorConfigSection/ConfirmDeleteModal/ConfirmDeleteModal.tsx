import {
  Button,
  Modal,
  ModalVariant,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';
import { FC, useState } from 'react';
import { useTranslation } from '@app/i18n/i18n';

type ConfirmDeleteProps = {
  subject: string;
  action: () => void;
};

export const ConfirmDeleteModal: FC<ConfirmDeleteProps> = ({
  subject,
  action,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Modal
        variant={ModalVariant.small}
        title={t('Permanently delete the {{subject}}', { subject })}
        titleIconVariant="warning"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            onClick={() => {
              try {
                action();
              } finally {
                setIsModalOpen(false);
              }
            }}
          >
            {t('Delete')}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => setIsModalOpen(false)}
          >
            {t('Cancel')}
          </Button>,
        ]}
      >
        <TextContent>
          <Text component={TextVariants.h6}>
            {t('The associated configuration will be lost.')}
          </Text>
        </TextContent>
      </Modal>
      <Button
        variant="plain"
        aria-label="Remove"
        onClick={() => setIsModalOpen(true)}
      >
        <TrashIcon />
      </Button>
    </>
  );
};
