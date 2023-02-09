import { useTranslation as useReactI18NextTranslation } from 'react-i18next';

export function useTranslation() {
  return useReactI18NextTranslation(
    'plugin__activemq-artemis-self-provisioning-plugin',
  );
}
