import { render, screen, waitFor } from '../../test-utils';
import { AMQBrokerModel } from '../../k8s/models';
import { BrokersContainer } from './BrokersList.container';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { k8sListItems } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  k8sListItems: jest.fn(),
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
  const mockK8sListItems = k8sListItems as jest.Mock;

  beforeEach(() => {
    mockUseNavigate.mockReturnValue(jest.fn());
    mockUseParams.mockReturnValue({ ns: mockNamespace });
    mockK8sListItems.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should renders BrokersContainer component correctly', async () => {
    render(<BrokersContainer />);

    await waitFor(() => {
      expect(k8sListItems).toHaveBeenCalledWith({
        model: AMQBrokerModel,
        queryParams: { ns: mockNamespace },
      });
    });
    expect(screen.getByText('BrokersList Component')).toBeInTheDocument();
    expect(
      screen.getByText('PreConfirmDeleteModal Component'),
    ).toBeInTheDocument();
  });

  it('should handle API error on fetchK8sListItems', async () => {
    const errorMessage = 'Failed to load brokers';
    mockK8sListItems.mockRejectedValue(new Error(errorMessage));

    render(<BrokersContainer />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });
});
