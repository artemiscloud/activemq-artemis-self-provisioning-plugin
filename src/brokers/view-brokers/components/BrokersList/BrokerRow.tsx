import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { ActionsColumn, IAction } from '@patternfly/react-table';
import {
  K8sResourceCommon,
  BrokerConditionTypes,
  getCondition,
  getConditionString,
} from '../../../../utils';

export type BrokerRowProps = RowProps<K8sResourceCommon> & {
  columns: TableColumn<K8sResourceCommon>[];
  onEditBroker: (broker: K8sResourceCommon) => void;
  onDeleteBroker: (broker: K8sResourceCommon) => void;
};

export const BrokerRow: FC<BrokerRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
  onEditBroker,
  onDeleteBroker,
}) => {
  const {
    metadata: { name, creationTimestamp },
    spec: {
      deploymentPlan: { size },
    },
    status,
  } = obj;

  const readyCondition = status
    ? getCondition(obj.status.conditions, BrokerConditionTypes.Ready)
    : null;

  const rowActions: IAction[] = [
    {
      title: 'Edit Broker',
      onClick: () => onEditBroker(obj),
    },
    {
      title: 'Delete Broker',
      onClick: () => onDeleteBroker(obj),
    },
  ];

  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <Link to={`/k8s/ns/${obj.metadata.namespace}/brokers/${name}`}>{name}</Link>
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {(readyCondition && readyCondition.status) || '-'}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {status ? getConditionString(status?.conditions) : '-'}
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {size}
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={creationTimestamp} />
      </TableData>
      <TableData id={columns[5].id} activeColumnIDs={activeColumnIDs}>
        <ActionsColumn items={rowActions} />
      </TableData>
    </>
  );
};
