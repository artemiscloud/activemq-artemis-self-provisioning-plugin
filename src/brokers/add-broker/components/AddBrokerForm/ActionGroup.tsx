import { FC } from 'react';
import { useTranslation } from '../../../../i18n';
import { ActionGroup, Button, ButtonVariant } from '@patternfly/react-core';

interface BrokerActionGroupProps {
  isUpdate: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const BrokerActionGroup: FC<BrokerActionGroupProps> = ({
  isUpdate,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <ActionGroup>
      <Button variant={ButtonVariant.primary} type="submit" onClick={onSubmit}>
        {isUpdate ? t('apply') : t('create')}
      </Button>
      <Button variant={ButtonVariant.secondary} onClick={onCancel}>
        {t('cancel')}
      </Button>
    </ActionGroup>
  );
};
