import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { Client } from './Clients.container';

export type ClientRowProps = RowProps<Client> & {
  columns: TableColumn<Client>[];
};

export const ClientsRow: FC<ClientRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { name, connections, expires, created } = obj;
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {name}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {connections}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={expires} />
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={created} />
      </TableData>
    </>
  );
};
