import { render, screen } from '@app/test-utils';
import { PodsList, PodsListProps } from './PodList';
import { useListPageFilter } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  ListPageHeader: jest.fn(({ title }) => <div>{title}</div>),
  ListPageBody: jest.fn(({ children }) => <div>{children}</div>),
  ListPageFilter: jest.fn(() => <div>ListPageFilter</div>),
  VirtualizedTable: jest.fn(({ Row, data, columns }) => (
    <div>
      <div>VirtualizedTable</div>
      {data.map((item: any, index: number) => (
        <Row
          key={index}
          obj={item}
          activeColumnIDs={columns.map((col: any) => col.id)}
        />
      ))}
    </div>
  )),
  useListPageFilter: jest.fn(),
}));

jest.mock('./PodRow', () => ({
  PodRow: jest.fn(() => <div>PodRow Component</div>),
}));

describe('PodsList', () => {
  const mockPodsListProps: PodsListProps = {
    brokerPods: [
      {
        metadata: { name: 'pod-1' },
        spec: {},
        status: { phase: 'Running' },
      },
      {
        metadata: { name: 'pod-2' },
        spec: {},
        status: { phase: 'Pending' },
      },
    ],
    loaded: true,
    loadError: null,
  };

  beforeEach(() => {
    (useListPageFilter as jest.Mock).mockReturnValue([
      mockPodsListProps.brokerPods,
      mockPodsListProps.brokerPods,
      jest.fn(),
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the PodsList component', () => {
    render(<PodsList {...mockPodsListProps} />);
    expect(screen.getByText('Pods')).toBeInTheDocument();
  });

  it('should render the ListPageFilter', () => {
    render(<PodsList {...mockPodsListProps} />);
    expect(screen.getByText('ListPageFilter')).toBeInTheDocument();
  });

  it('should render the VirtualizedTable', () => {
    render(<PodsList {...mockPodsListProps} />);
    expect(screen.getByText('VirtualizedTable')).toBeInTheDocument();
  });

  it('should render PodRow components within the VirtualizedTable', () => {
    render(<PodsList {...mockPodsListProps} />);

    const podRowElements = screen.getAllByText('PodRow Component');
    expect(podRowElements.length).toBe(mockPodsListProps.brokerPods.length);
  });
});
