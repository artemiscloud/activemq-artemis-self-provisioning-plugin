import { useTranslation } from '../../../../i18n';
import { FC, createContext } from 'react';
import { Text } from '@patternfly/react-core';
import { AcceptorsConfigPage } from './AcceptorsConfigPage/AcceptorsConfigPage';
import { ConsoleConfigPage } from './ConsoleConfigPage/ConsoleConfigPage';

export const enum ConfigType {
  connectors = 'connectors',
  acceptors = 'acceptors',
  console = 'console',
}

type BrokerConfigProps = {
  brokerId: number;
  target: any;
  isPerBrokerConfig: boolean;
};

export const ConfigTypeContext = createContext<ConfigType>(
  ConfigType.acceptors,
);

export const GetConfigurationPage: FC<BrokerConfigProps> = ({
  brokerId,
  target,
  isPerBrokerConfig,
}) => {
  const { t } = useTranslation();
  if (isPerBrokerConfig) {
    return <Text>{t('broker_config_disabled')}</Text>;
  }

  const configType: ConfigType = target;

  if (target) {
    return (
      <ConfigTypeContext.Provider value={configType}>
        {target === 'console' ? (
          <ConsoleConfigPage brokerId={brokerId} />
        ) : (
          <AcceptorsConfigPage brokerId={brokerId} />
        )}
      </ConfigTypeContext.Provider>
    );
  }
  return <Text>{t('broker_configuration_page')}</Text>;
};
