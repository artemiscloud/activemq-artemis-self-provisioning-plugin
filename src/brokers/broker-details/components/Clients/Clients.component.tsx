import { useTranslation } from '../../../../i18n/i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Client } from './Clients.container';
import { ClientsRow } from './ClientsRow';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

export type ClientProps = {
  clientData: Client[];
  isLoaded: boolean;
  loadError: boolean;
};

const Clients: React.FC<ClientProps> = ({
  clientData,
  isLoaded,
  loadError,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<Client>[] = [
    {
      title: t('name'),
      id: 'name',
    },
    {
      title: t('connections'),
      id: 'connections',
    },
    {
      title: t('expires'),
      id: 'expires',
    },
    {
      title: t('created'),
      id: 'created',
    },
  ];
  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{t('clients')}</Title>
      </PageSection>
      <VirtualizedTable<Client>
        data={clientData}
        unfilteredData={clientData}
        loaded={isLoaded}
        loadError={loadError}
        columns={columns}
        Row={({ obj, activeColumnIDs, rowData }) => (
          <ClientsRow
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

export { Clients };
