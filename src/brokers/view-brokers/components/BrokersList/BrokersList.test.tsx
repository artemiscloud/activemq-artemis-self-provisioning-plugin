import { cleanup, render, screen, waitForI18n } from '../../../../test-utils';
import { BrokersList } from '../BrokersList/BrokersList';

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

// jest.mock('react-i18next');
console.log('render', render);
console.log('brokerlist', BrokersList);

// jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
//   ...jest.requireActual('@openshift-console/dynamic-plugin-sdk'),
//   useListPageFilter: jest.fn(),
// }));

describe('BrokerList', () => {
  const onEditBroker = jest.fn();
  const onOpenModal = jest.fn();
  const mockBrokersData = [
    {
      id: '1',
      name: 'test-1',
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
    },
    {
      id: '2',
      name: 'test-2',
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
    },
  ];

  it('should renders the component correctly', async () => {
    const comp = render(
      <BrokersList
        brokers={mockBrokersData}
        onEditBroker={onEditBroker}
        onOpenModal={onOpenModal}
        loaded={true}
        loadError={null}
      />,
    );
    await waitForI18n(comp);
    expect(screen.getByText('brokers')).toBeInTheDocument();
    expect(screen.getByText('create_broker')).toBeInTheDocument();
  });

  xit('should display data in BrokersTable', async () => {
    const comp = render(
      <BrokersList
        brokers={mockBrokersData}
        onEditBroker={onEditBroker}
        onOpenModal={onOpenModal}
        loaded={true}
        loadError={null}
      />,
    );
    await waitForI18n(comp);
    for (const broker of mockBrokersData) {
      expect(screen.getByText(broker.name)).toBeInTheDocument();
      expect(screen.getByText(broker.spec.deploymentPlan.size)).toBe(2);
    }
  });

  xit('should display an error message when loadError is not null', async () => {
    const errorMessage = 'An error occurred while loading data.';
    const comp = render(
      <BrokersList
        brokers={[]}
        onEditBroker={onEditBroker}
        onOpenModal={onOpenModal}
        loaded={false}
        loadError={errorMessage}
      />,
    );
    await waitForI18n(comp);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
