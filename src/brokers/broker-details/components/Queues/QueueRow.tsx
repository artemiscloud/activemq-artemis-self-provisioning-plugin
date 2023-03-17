import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { Queue } from './Queues.container';
import { useTranslation } from '../../../../i18n';

export type QueueRowProps = RowProps<Queue> & {
  columns: TableColumn<Queue>[];
};

export const QueueRow: FC<QueueRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { name, routingType, autoCreateQueues, autoDeleteQueues, created } =
    obj;
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
        {autoCreateQueues ? t('yes') : t('no')}
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {autoDeleteQueues ? t('yes') : t('no')}
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={created} />
      </TableData>
    </>
  );
};
