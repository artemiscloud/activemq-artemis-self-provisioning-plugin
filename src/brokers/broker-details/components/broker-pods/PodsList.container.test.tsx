import { render, screen, waitFor } from '@app/test-utils';
import { PodsContainer } from './PodsList.container';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { useParams } from 'react-router-dom-v5-compat';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
}));

jest.mock('./components/PodList', () => ({
  PodsList: jest.fn(() => <div>PodsList Component</div>),
}));

describe('PodsContainer', () => {
  const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;
  const mockUseParams = useParams as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ ns: 'test-namespace', name: 'test-1' });
  });

  it('should renders loading state', async () => {
    mockUseK8sWatchResource.mockReturnValue([[], false, null]);
    render(<PodsContainer />);
    await waitFor(() => {
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });

  it('should renders error state', async () => {
    mockUseK8sWatchResource.mockReturnValue([
      [],
      true,
      new Error('Failed to load'),
    ]);
    render(<PodsContainer />);
    await waitFor(() => {
      expect(
        screen.getByText('Error while retrieving the pods list.'),
      ).toBeInTheDocument();
      expect(screen.getByText('No results match.')).toBeInTheDocument();
    });
  });

  it('should renders no results state when broker-pods length is zero', async () => {
    mockUseK8sWatchResource.mockReturnValue([[], true, null]);
    render(<PodsContainer />);
    await waitFor(() => {
      expect(
        screen.getByText(
          'No results found. Check the status of the deployment.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('No results match.')).toBeInTheDocument();
    });
  });

  it('should renders PodsList component with broker pods', async () => {
    const mockPods: K8sResourceCommon[] = [
      {
        metadata: {
          name: 'test-1-ss-0',
          ownerReferences: [
            {
              apiVersion: 'v1beta1',
              name: 'test-1-ss',
              kind: 'StatefulSet',
              uid: 'abcd1234z',
            },
          ],
        },
      },
    ];
    mockUseK8sWatchResource.mockReturnValue([mockPods, true, null]);

    render(<PodsContainer />);

    await waitFor(() => {
      expect(screen.getByText('PodsList Component')).toBeInTheDocument();
    });
  });

  it('should filter broker pods that do not match', async () => {
    const mockPods: K8sResourceCommon[] = [
      {
        metadata: {
          name: 'test-2-ss-0',
          ownerReferences: [
            {
              apiVersion: 'v1beta1',
              name: 'test-2-ss',
              kind: 'StatefulSet',
              uid: 'abcd1235z',
            },
          ],
        },
      },
    ];
    mockUseK8sWatchResource.mockReturnValue([mockPods, true, null]);

    render(<PodsContainer />);

    await waitFor(() => {
      expect(screen.getByText('No results match.')).toBeInTheDocument();
    });
  });
});
