import { MemoryRouter } from 'react-router-dom-v5-compat';
import { render, screen } from '@app/test-utils';
import { PodRow, PodRowProps } from './PodRow';
import { BrokerCR } from '@app/k8s/types';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  TableData: ({
    id,
    activeColumnIDs,
    children,
  }: {
    id: string;
    activeColumnIDs: Set<string>;
    children: React.ReactNode;
  }) => (
    <td
      data-testid={id}
      data-active={activeColumnIDs.has(id) ? 'true' : 'false'}
    >
      {children}
    </td>
  ),
  Timestamp: ({ timestamp }: { timestamp: string }) => (
    <time>{new Date(timestamp).toLocaleString()}</time>
  ),
}));

const mockColumns: TableColumn<BrokerCR>[] = [
  { title: 'Name', id: 'name' },
  { title: 'Status', id: 'status' },
  { title: 'Ready', id: 'ready' },
  { title: 'Restarts', id: 'restarts' },
  { id: 'created', title: 'Created' },
];

const mockObj: BrokerCR = {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: {
    name: 'test-1-ss-0',
    creationTimestamp: '2024-08-08T07:23:00Z',
    namespace: 'test-namespace',
  },
  status: {
    phase: 'Running',
    containerStatuses: [
      { ready: true, restartCount: 2 },
      { ready: true, restartCount: 0 },
    ],
  },
};

const Props: PodRowProps = {
  obj: mockObj,
  rowData: {},
  activeColumnIDs: new Set(mockColumns.map((column) => column.id)),
  columns: mockColumns,
};

describe('PodRow', () => {
  it('renders pod name as a link', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <PodRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('test-1-ss-0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /test-1-ss-0/i })).toHaveAttribute(
      'href',
      '/k8s/ns/test-namespace/pods/test-1-ss-0',
    );
  });

  it('should renders pod status', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <PodRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('should renders pod readiness', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <PodRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('2/2')).toBeInTheDocument();
  });

  it('should renders pod restarts', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <PodRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should renders pod creation timestamp', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <PodRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText(/8\/8\/2024, 7:23:00 am/i)).toBeInTheDocument();
  });

  it('should handles missing status gracefully', () => {
    const mockObj1: BrokerCR = {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'test-1-ss-0',
        creationTimestamp: '2024-08-08T07:23:00Z',
      },
      status: undefined,
    };

    const Props: PodRowProps = {
      obj: mockObj1,
      rowData: {},
      activeColumnIDs: new Set(mockColumns.map((column) => column.id)),
      columns: mockColumns,
    };

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <PodRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('0/0')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
