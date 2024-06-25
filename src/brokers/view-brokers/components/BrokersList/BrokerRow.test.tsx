import { render, waitForI18n } from '../../../../test-utils';
import { BrowserRouter } from 'react-router-dom';
import { BrokerRow } from './BrokerRow';

describe('BrokerRow', () => {
  const obj = {
    metadata: {
      name: 'test-1',
      creationTimestamp: '2023-07-24T12:34:56Z',
      namespace: 'test',
    },
    spec: {
      deploymentPlan: {
        size: 2,
      },
    },
    status: {
      conditions: [
        {
          type: 'Ready',
          status: 'True',
        },
      ],
    },
  };
  const activeColumnIDs = new Set([
    'column1',
    'column2',
    'column3',
    'column4',
    'column5',
    'column6',
  ]);
  const columns = [
    { title: 'Name', id: 'column1', label: 'Name' },
    { title: 'Ready', id: 'column2', label: 'Ready' },
    { title: 'Status', id: 'column3', label: 'Status' },
    { title: 'Size', id: 'column4', label: 'Size' },
    { title: 'Creation Timestamp', id: 'column5', label: 'Creation Timestamp' },
    { title: 'Actions', id: 'column6', label: 'Actions' },
  ];
  const onEditBroker = jest.fn();
  const onOpenModal = jest.fn();

  it('should render the componet currectly', async () => {
    const comp = render(
      <BrowserRouter>
        <BrokerRow
          obj={obj}
          activeColumnIDs={activeColumnIDs}
          columns={columns}
          onEditBroker={onEditBroker}
          onOpenModal={onOpenModal}
          rowData={undefined}
        />
      </BrowserRouter>,
    );
    await waitForI18n(comp);
    expect(comp.getByText('test-1')).toBeInTheDocument();
  });

  it('should render the state of the broker Ready', async () => {
    const comp = render(
      <BrowserRouter>
        <BrokerRow
          obj={obj}
          activeColumnIDs={activeColumnIDs}
          columns={columns}
          onEditBroker={onEditBroker}
          onOpenModal={onOpenModal}
          rowData={undefined}
        />
      </BrowserRouter>,
    );
    await waitForI18n(comp);
    expect(comp.getByText('Ready')).toBeInTheDocument();
  });

  it('should generate the correct link URL to navigate on click', async () => {
    const comp = render(
      <BrowserRouter>
        <BrokerRow
          obj={obj}
          activeColumnIDs={activeColumnIDs}
          columns={columns}
          onEditBroker={onEditBroker}
          onOpenModal={onOpenModal}
          rowData={undefined}
        />
      </BrowserRouter>,
    );
    await waitForI18n(comp);

    const linkElement = comp.getByText('test-1');
    expect(linkElement.getAttribute('href')).toBe('/ns/test/brokers/test-1');
  });
});
