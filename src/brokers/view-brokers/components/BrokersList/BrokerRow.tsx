import { FC, useState } from 'react';
import {
  RowProps,
  TableData,
  TableColumn,
  Timestamp,
} from '@openshift-console/dynamic-plugin-sdk';
import { ActionsColumn, IAction } from '@patternfly/react-table';
import {
  BrokerCR,
  BrokerConditionTypes,
  K8sResourceConditionStatus,
} from '../../../../k8s/types';
import { useTranslation } from '../../../../i18n/i18n';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { K8sResourceCondition } from '@app/k8s/types';
import { Link } from 'react-router-dom-v5-compat';

const getConditionOKCount = (conditions: K8sResourceCondition[]): number =>
  conditions.filter((c) => c.status === K8sResourceConditionStatus.True).length;

const getConditionString = (conditions: K8sResourceCondition[]): string =>
  `${getConditionOKCount(conditions)} OK / ${conditions.length}`;

type ConditionModalProps = {
  status: BrokerCR['status'];
};

const ConditionModal: FC<ConditionModalProps> = ({ status }) => {
  const [isOpen, setIsOpen] = useState(false);
  const conditions = status?.conditions
    ? (status.conditions as K8sResourceCondition[])
    : undefined;
  if (!conditions) {
    return <>-</>;
  }
  return (
    <>
      <Button variant="link" onClick={() => setIsOpen(true)}>
        {status ? getConditionString(status?.conditions) : '-'}
      </Button>
      <Modal
        bodyAriaLabel="Status report"
        tabIndex={0}
        variant={ModalVariant.medium}
        title="Status report"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DescriptionList>
          {conditions.map((condition, index) => {
            return (
              <DescriptionListGroup
                key={`${condition.type}-${condition.lastTransitionTime}`}
              >
                {index > 0 && <Divider />}
                <DescriptionListTerm>
                  Condition at {condition.lastTransitionTime}
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <DescriptionList columnModifier={{ lg: '2Col' }}>
                    <DescriptionListTerm>status</DescriptionListTerm>
                    <DescriptionListDescription>
                      {condition.status}
                    </DescriptionListDescription>
                    <DescriptionListTerm>type</DescriptionListTerm>
                    <DescriptionListDescription>
                      {condition.type}
                    </DescriptionListDescription>
                    <DescriptionListTerm>reason</DescriptionListTerm>
                    <DescriptionListDescription>
                      {condition.reason}
                    </DescriptionListDescription>
                    {condition.message !== '' && (
                      <>
                        <DescriptionListTerm>message</DescriptionListTerm>
                        <DescriptionListDescription>
                          {condition.message}
                        </DescriptionListDescription>
                      </>
                    )}
                  </DescriptionList>
                </DescriptionListDescription>
              </DescriptionListGroup>
            );
          })}
        </DescriptionList>
      </Modal>
    </>
  );
};

export type BrokerRowProps = RowProps<BrokerCR> & {
  columns: TableColumn<BrokerCR>[];
  onEditBroker: (broker: BrokerCR) => void;
  onOpenModal: (broker: BrokerCR) => void;
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
    ? obj.status.conditions.find(
        (c: K8sResourceCondition) => c.type === BrokerConditionTypes.Ready,
      )
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
        <Link to={`/k8s/ns/${namespace}/brokers/${name}`}>{name}</Link>
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {(readyCondition && readyCondition.status) || '-'}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <ConditionModal status={status} />
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
