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
import { useTranslation } from '../../../../i18n';

export type BrokerRowProps = RowProps<K8sResourceCommon> & {
  columns: TableColumn<K8sResourceCommon>[];
  onEditBroker: (broker: K8sResourceCommon) => void;
  onOpenModal: (broker: K8sResourceCommon) => void;
};

export const BrokerRow: FC<BrokerRowProps> = ({
  obj,
  activeColumnIDs,
  columns,
  onEditBroker,
  onOpenModal,
}) => {
  const { t } = useTranslation();
  const {
    metadata: { name, creationTimestamp, namespace },
    status,
  } = obj;

  const size = obj.spec?.deploymentPlan?.size;

  const readyCondition = status
    ? getCondition(obj.status.conditions, BrokerConditionTypes.Ready)
    : null;

  const rowActions: IAction[] = [
    {
      title: t('edit_broker'),
      onClick: () => onEditBroker(obj),
    },
    {
      title: t('delete_broker'),
      onClick: () => onOpenModal(obj),
    },
  ];

  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <Link to={`/ns/${namespace}/brokers/${name}`}>{name}</Link>
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
