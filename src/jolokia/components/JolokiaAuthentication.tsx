import { FC, useState } from 'react';
import { OpenAPI as OpenAPIConfig } from '@app/openapi/jolokia/requests/core/OpenAPI';
import {
  useGetApiServerBaseUrl,
  useJolokiaLogin,
} from '@app/jolokia/customHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '../context';
import { BrokerCR } from '@app/k8s/types';
import {
  Button,
  Modal,
  ModalVariant,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';

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
        title={t('Login Failed')}
        titleIconVariant="danger"
        isOpen={isErrorModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleTryAgain}>
            {t('Try again')}
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            {t('Cancel')}
          </Button>,
        ]}
      >
        <TextContent>
          <Text component={TextVariants.h6}>
            {t('Token invalid. Please check your credentials and try again.')}
          </Text>
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
