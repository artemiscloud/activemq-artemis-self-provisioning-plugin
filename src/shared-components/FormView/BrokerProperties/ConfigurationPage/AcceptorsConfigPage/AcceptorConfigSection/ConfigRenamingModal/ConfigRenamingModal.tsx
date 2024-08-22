import {
  Button,
  Modal,
  ModalVariant,
  TextInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import { FC, useContext, useState } from 'react';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  listConfigs,
} from '../../../../../../../reducers/7.12/reducer';
import { useTranslation } from '../../../../../../../i18n/i18n';
import { ConfigType, ConfigTypeContext } from '../../../ConfigurationPage';
export type ConfigRenamingModalProps = {
  initName: string;
};

export const ConfigRenamingModal: FC<ConfigRenamingModalProps> = ({
  initName,
}) => {
  const { t } = useTranslation();
  const configType = useContext(ConfigTypeContext);
  const dispatch = useContext(BrokerCreationFormDispatch);
  const [newName, setNewName] = useState(initName);
  const [toolTip, setTooltip] = useState('');
  const [validateStatus, setValidateStatus] = useState(null);
  const { cr } = useContext(BrokerCreationFormState);
  const uniqueSet = listConfigs(configType, cr, 'set') as Set<string>;

  const handleNewName = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorName,
        payload: {
          oldName: initName,
          newName: newName,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorName,
        payload: {
          oldName: initName,
          newName: newName,
        },
      });
    }
  };

  const validateName = (value: string) => {
    setNewName(value);
    if (value === '') {
      setValidateStatus(ValidatedOptions.error);
      setTooltip(t('name_not_empty'));
      return false;
    }
    if (uniqueSet?.has(value)) {
      setValidateStatus(ValidatedOptions.error);
      setTooltip(t('name_already_exists'));
      return false;
    }
    setValidateStatus(ValidatedOptions.success);
    setTooltip(t('name_available'));
    return true;
  };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Modal
        variant={ModalVariant.small}
        title="Rename"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={handleNewName}
            isDisabled={validateStatus !== ValidatedOptions.success}
          >
            {t('confirm')}
          </Button>,
          <Button key="cancel" variant="link" onClick={() => setIsOpen(false)}>
            {t('cancel')}
          </Button>,
        ]}
      >
        <TextInput
          value={newName}
          onChange={(_event, value: string) => validateName(value)}
          isRequired
          validated={validateStatus}
          type="text"
          aria-label="name input panel"
        />
        <p>{toolTip}</p>
      </Modal>
      <Button variant="plain" onClick={() => setIsOpen(true)}>
        {t('rename')}
      </Button>
    </>
  );
};
