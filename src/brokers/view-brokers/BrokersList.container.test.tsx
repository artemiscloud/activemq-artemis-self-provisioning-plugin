import { render, screen, waitFor } from '@app/test-utils';
import { AMQBrokerModel } from '@app/k8s/models';
import { BrokersContainer } from './BrokersList.container';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
  k8sDelete: jest.fn(),
}));

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('./components/BrokersList/BrokersList', () => ({
  BrokersList: jest.fn((props) => {
    const { brokers, loaded, loadError, onOpenModal, onEditBroker } = props;

    if (loadError) {
      return <div>Error: {loadError}</div>;
    }

    if (!loaded) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        BrokersList Component
        <button onClick={() => onOpenModal(brokers[0])}>Open Modal</button>
        <button onClick={() => onEditBroker(brokers[0])}>Edit Broker</button>
      </div>
    );
  }),
}));

jest.mock('./components/PreConfirmDeleteModal/PreConfirmDeleteModal', () => ({
  PreConfirmDeleteModal: jest.fn(() => (
    <div data-testid="delete-modal">PreConfirmDeleteModal Component</div>
  )),
}));

describe('BrokersContainer', () => {
  const mockUseNavigate = useNavigate as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const mockNamespace = 'test-namespace';
  const mockK8sWatchResource = useK8sWatchResource as jest.Mock;

  beforeEach(() => {
    mockUseNavigate.mockReturnValue(jest.fn());
    mockUseParams.mockReturnValue({ ns: mockNamespace });
    mockK8sWatchResource.mockReturnValue([[], true, null]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should renders BrokersContainer component correctly', async () => {
    render(<BrokersContainer />);

    await waitFor(() => {
      expect(useK8sWatchResource).toHaveBeenCalledWith({
        namespace: mockNamespace,
        groupVersionKind: {
          kind: AMQBrokerModel.kind,
          version: AMQBrokerModel.apiVersion,
          group: AMQBrokerModel.apiGroup,
        },
        isList: true,
      });
    });
    expect(screen.getByText('BrokersList Component')).toBeInTheDocument();
    expect(
      screen.getByText('PreConfirmDeleteModal Component'),
    ).toBeInTheDocument();
  });

  it('should handle API error on fetching the ListItems', async () => {
    const errorMessage = 'Failed to load brokers';

    mockK8sWatchResource.mockReturnValue([[], false, errorMessage]);

    render(<BrokersContainer />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });
});
