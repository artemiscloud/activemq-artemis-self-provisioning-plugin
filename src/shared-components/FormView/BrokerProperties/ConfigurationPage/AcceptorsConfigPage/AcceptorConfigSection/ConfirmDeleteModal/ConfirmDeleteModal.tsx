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
import { useTranslation } from '../../../../../../../i18n';

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
        title={t('delete_instance_title', { subject })}
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
            {t('delete')}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => setIsModalOpen(false)}
          >
            {t('cancel')}
          </Button>,
        ]}
      >
        <TextContent>
          <Text component={TextVariants.h6}>
            {t('preconfirm_delete_acceptor_message')}
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
