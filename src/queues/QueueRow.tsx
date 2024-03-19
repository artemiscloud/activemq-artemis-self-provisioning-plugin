import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { Queue } from './Queues.container';
import { useTranslation } from '../i18n';

export type QueueRowProps = RowProps<Queue> & {
  columns: TableColumn<Queue>[];
};

export const QueueRow: FC<QueueRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { name, routingType, messageCount, durable, autoDelete } = obj;
  const { t } = useTranslation();

  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {name}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {routingType}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {messageCount}
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {durable ? t('yes') : t('no')}
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        {autoDelete ? t('yes') : t('no')}
      </TableData>
    </>
  );
};
