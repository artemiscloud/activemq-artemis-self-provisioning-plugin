import { useTranslation } from '../i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Address } from '../openapi/jolokia/requests';
import { AddressRow } from './AddressRow';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

export type AddressProps = {
  addressData: Address[];
  isLoaded: boolean;
  loadError: boolean;
};

const Addresses: React.FC<AddressProps> = ({
  addressData,
  isLoaded,
  loadError,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<Address>[] = [
    {
      title: t('name'),
      id: 'name',
    },
    {
      title: t('routing_type'),
      id: 'routing_type',
    },
  ];
  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{t('addresses')}</Title>
      </PageSection>
      <VirtualizedTable<Address>
        data={addressData}
        unfilteredData={addressData}
        loaded={isLoaded}
        loadError={loadError}
        columns={columns}
        Row={({ obj, activeColumnIDs, rowData }) => (
          <AddressRow
            obj={obj}
            rowData={rowData}
            activeColumnIDs={activeColumnIDs}
            columns={columns}
          />
        )}
      />
    </Page>
  );
};

export { Addresses };
