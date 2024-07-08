import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { BrokerCR } from '../../../k8s';

export type PodRowProps = RowProps<BrokerCR> & {
  columns: TableColumn<BrokerCR>[];
  brokerName: string;
};

export const PodRow: FC<PodRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
  brokerName,
}) => {
  const {
    metadata: { name, namespace, creationTimestamp },
    status,
  } = obj;

  const readyCount = status?.containerStatuses
    ? status.containerStatuses.filter((container: any) => container.ready)
        .length
    : 0;
  const totalCount = status?.containerStatuses?.length || 0;
  const podReadiness = `${readyCount}/${totalCount}`;

  const restarts = status?.containerStatuses
    ? status.containerStatuses[0]?.restartCount || 0
    : 0;

  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <Link to={`/ns/${namespace}/brokers/${brokerName}/${name}`}>
          {name}
        </Link>
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {status?.phase || '-'}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {podReadiness}
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {restarts}
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={creationTimestamp} />
      </TableData>
    </>
  );
};
