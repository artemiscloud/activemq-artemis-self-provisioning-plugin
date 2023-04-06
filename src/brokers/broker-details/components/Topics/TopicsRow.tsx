import { FC } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { Topic } from './Topics.container';

export type TopicRowProps = RowProps<Topic> & {
  columns: TableColumn<Topic>[];
};

export const TopicsRow: FC<TopicRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
}) => {
  const { name, created } = obj;
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        {name}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={created} />
      </TableData>
    </>
  );
};
