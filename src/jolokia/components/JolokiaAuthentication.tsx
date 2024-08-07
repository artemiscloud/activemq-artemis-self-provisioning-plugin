import { FC, useState } from 'react';
import { OpenAPI as OpenAPIConfig } from '../../openapi/jolokia/requests/core/OpenAPI';
import {
  useGetApiServerBaseUrl,
  useJolokiaLogin,
} from '../../jolokia/customHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '../context';
import { BrokerCR } from '../../k8s/types';
import {
  Button,
  Modal,
  ModalVariant,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n/i18n';

type JolokiaPropTypes = {
  brokerCR: BrokerCR;
  podOrdinal: number;
};

const Authentication: FC<JolokiaPropTypes> = ({
  children,
  brokerCR,
  podOrdinal,
}) => {
  const jolokiaLogin = useJolokiaLogin(brokerCR, podOrdinal);
  const handleModalToggle = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const handleTryAgain = () => {
    setIsErrorModalOpen(false);
    window.location.reload();
  };
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [hasNotified, setHasNotified] = useState(false);

  if (!hasNotified && jolokiaLogin.isError && jolokiaLogin.source === 'api') {
    setIsErrorModalOpen(true);
    setHasNotified(true);
  }
  const { t } = useTranslation();
  return (
    <AuthContext.Provider value={jolokiaLogin}>
      <Modal
        variant={ModalVariant.small}
        title={t('login_failed')}
        titleIconVariant="danger"
        isOpen={isErrorModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleTryAgain}>
            {t('try_again')}
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            {t('cancel')}
          </Button>,
        ]}
      >
        <TextContent>
          <Text component={TextVariants.h6}>{t('login_failed_message')}</Text>
        </TextContent>
      </Modal>
      {children}
    </AuthContext.Provider>
  );
};

export const JolokiaAuthentication: FC<JolokiaPropTypes> = ({
  children,
  brokerCR,
  podOrdinal,
}) => {
  OpenAPIConfig.BASE = useGetApiServerBaseUrl();
  const querClient = new QueryClient();
  return (
    <QueryClientProvider client={querClient}>
      <Authentication brokerCR={brokerCR} podOrdinal={podOrdinal}>
        {children}
      </Authentication>
    </QueryClientProvider>
  );
};
