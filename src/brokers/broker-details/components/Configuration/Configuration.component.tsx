import {
  Title,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
} from '@patternfly/react-core';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from '../../../../i18n';

export type ConfigurationProps = {
  name: string;
  status: string;
  size: number;
  persistanceEnabled: string;
  messageMigrationEnabled: string;
  image: string;
  created: string;
};

const Configuration: React.FC<ConfigurationProps> = ({
  name,
  status,
  size,
  persistanceEnabled,
  messageMigrationEnabled,
  image,
  created,
}) => {
  const { t } = useTranslation();

  return (
    <PageSection>
      <Title headingLevel="h1" className="pf-u-pb-md">
        {t('settings')}
      </Title>
      <DescriptionList
        isHorizontal
        horizontalTermWidthModifier={{
          default: '20ch',
          sm: '20ch',
          md: '20ch',
          lg: '28ch',
          xl: '30ch',
          '2xl': '35ch',
        }}
      >
        <DescriptionListGroup>
          <DescriptionListTerm>{t('name')}</DescriptionListTerm>
          <DescriptionListDescription>{name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('status')}</DescriptionListTerm>
          <DescriptionListDescription>{status}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('size')}</DescriptionListTerm>
          <DescriptionListDescription>{size}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('persistance_enabled')}</DescriptionListTerm>
          <DescriptionListDescription>
            {persistanceEnabled}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            {t('message_migration_enabled')}
          </DescriptionListTerm>
          <DescriptionListDescription>
            {messageMigrationEnabled}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('image')}</DescriptionListTerm>
          <DescriptionListDescription>{image}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>{t('created')}</DescriptionListTerm>
          <DescriptionListDescription>
            <Timestamp timestamp={created} />
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
};

export { Configuration };
