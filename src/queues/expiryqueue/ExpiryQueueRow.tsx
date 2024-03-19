import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { ExpiryQueue } from './ExpiryQueue.container';

export type ExporyQueueRowProps = RowProps<ExpiryQueue> & {
  columns: TableColumn<ExpiryQueue>[];
};

export const ExpiryQueueRow: FC<ExporyQueueRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { attribute, value } = obj;

  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {attribute}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {value}
      </TableData>
    </>
  );
};
