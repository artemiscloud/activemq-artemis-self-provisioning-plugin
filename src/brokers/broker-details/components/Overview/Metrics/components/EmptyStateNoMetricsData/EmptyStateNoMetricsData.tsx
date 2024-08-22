import { FunctionComponent } from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { useTranslation } from '../../../../../../../i18n/i18n';

export const EmptyStateNoMetricsData: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <EmptyState variant={EmptyStateVariant.xs}>
      <EmptyStateHeader
        titleText={<>{t('metric_not_available')}</>}
        icon={
          <EmptyStateIcon
            icon={ExclamationTriangleIcon}
            color="var(--pf-global--warning-color--100)"
          />
        }
        headingLevel="h3"
      />
    </EmptyState>
  );
};
