import { FC } from 'react';
import { Configuration } from './Configuration.component';
import { BrokerCR, getCondition, BrokerConditionTypes } from '../utils';
import { Loading } from '../shared-components';
import { useTranslation } from '../i18n';

export type ConfigurationContainerProps = {
  configurationSettings: BrokerCR;
  loading: boolean;
};

const ConfigurationContainer: FC<ConfigurationContainerProps> = ({
  configurationSettings,
  loading,
}) => {
  const { t } = useTranslation();

  if (loading) return <Loading />;

  const readyCondition = configurationSettings?.status
    ? getCondition(
        configurationSettings?.status.conditions,
        BrokerConditionTypes.Ready,
      )
    : null;

  return (
    <Configuration
      name={configurationSettings?.metadata.name}
      created={configurationSettings?.metadata?.creationTimestamp}
      image={configurationSettings?.spec?.deploymentPlan.image}
      messageMigrationEnabled={
        configurationSettings?.spec?.deploymentPlan.messageMigration
          ? t('yes')
          : t('no')
      }
      persistanceEnabled={
        configurationSettings?.spec?.deploymentPlan.persistenceEnabled
          ? t('yes')
          : t('no')
      }
      size={configurationSettings?.spec?.deploymentPlan.size}
      status={
        readyCondition && readyCondition.status === 'True'
          ? t('active')
          : t('inactive')
      }
    />
  );
};

export { ConfigurationContainer };
