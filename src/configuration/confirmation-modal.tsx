import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { ExclamationTriangleIcon, TrashIcon } from '@patternfly/react-icons';
import { FC, useState } from 'react';

type ConfirmDeleteProps = {
  subject: string;
  action: () => void;
};

export const ConfirmDeleteModal: FC<ConfirmDeleteProps> = ({
  subject,
  action,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Modal
        variant={ModalVariant.small}
        header={
          <p>
            <ExclamationTriangleIcon /> Permanently delete the {' ' + subject}
          </p>
        }
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
            Delete
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>,
        ]}
      >
        The associated configuration will be lost.
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
