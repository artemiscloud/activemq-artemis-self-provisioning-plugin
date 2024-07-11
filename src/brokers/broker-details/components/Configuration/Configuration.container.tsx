import { FC } from 'react';
import { Configuration } from './Configuration.component';
import {
  BrokerCR,
  BrokerConditionTypes,
  K8sResourceCondition,
} from '../../../../k8s/types';
import { Loading } from '../../../../shared-components/Loading/Loading';
import { useTranslation } from '../../../../i18n/i18n';

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
    ? configurationSettings?.status.conditions.find(
        (c: K8sResourceCondition) => c.type === BrokerConditionTypes.Ready,
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
