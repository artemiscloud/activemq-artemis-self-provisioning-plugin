import { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { useTranslation } from '../../../i18n';

export const EmptyStateNoMetricsData: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <EmptyState variant={EmptyStateVariant.xs}>
      <EmptyStateIcon
        icon={ExclamationTriangleIcon}
        color="var(--pf-global--warning-color--100)"
      />
      <Title headingLevel="h3" size="md">
        {t('metric_not_available')}
      </Title>
    </EmptyState>
  );
};
