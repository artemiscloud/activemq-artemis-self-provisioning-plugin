import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { Queue } from './Queues.container';
//import { useTranslation } from '../i18n';

export type QueueRowProps = RowProps<Queue> & {
  columns: TableColumn<Queue>[];
};

export const QueueRow: FC<QueueRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { agent, agentType, timestamp, streaming } = obj;
  //const { t } = useTranslation();
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {agent}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {agentType}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {timestamp}
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {streaming}
      </TableData>
    </>
  );
};
