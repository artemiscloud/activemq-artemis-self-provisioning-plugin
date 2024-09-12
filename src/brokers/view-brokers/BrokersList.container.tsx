import { useState, FC } from 'react';
import {
  k8sDelete,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '@app/k8s/models';
import { K8sResourceCommonWithData, BrokerCR } from '@app/k8s/types';
import { BrokersList } from './components/BrokersList/BrokersList';
import { PreConfirmDeleteModal } from './components/PreConfirmDeleteModal/PreConfirmDeleteModal';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';

export const BrokersContainer: FC = () => {
  const navigate = useNavigate();
  const { ns: namespace } = useParams<{ ns?: string }>();

  //states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] =
    useState<K8sResourceCommonWithData>();
  const [_deleteError, setDeleteError] = useState<string | null>(null);
  const [_deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  const [brokers, loaded, loadError] = useK8sWatchResource<
    K8sResourceCommonWithData[]
  >({
    namespace,
    groupVersionKind: {
      kind: AMQBrokerModel.kind,
      version: AMQBrokerModel.apiVersion,
      group: AMQBrokerModel.apiGroup,
    },
    isList: true,
  });

  const onEditBroker = (broker: BrokerCR) => {
    const namespace = broker.metadata.namespace;
    const name = broker.metadata.name;
    navigate(`/k8s/ns/${namespace}/edit-broker/${name}`);
  };

  const onDeleteBroker = () => {
    k8sDelete({
      model: AMQBrokerModel,
      resource: { ...selectedBroker },
    })
      .then(() => {
        setDeleteSuccess(true);
        setDeleteError(null);
      })
      .catch((e) => {
        setDeleteError(`Failed to delete broker: ${e.message}`);
        setDeleteSuccess(false);
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };

  const onOpenModal = (broker?: BrokerCR) => {
    setSelectedBroker(broker);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <PreConfirmDeleteModal
        onDeleteButtonClick={onDeleteBroker}
        isModalOpen={isModalOpen}
        onOpenModal={onOpenModal}
        name={selectedBroker?.metadata?.name}
      />
      <BrokersList
        brokers={brokers}
        loadError={loadError}
        loaded={loaded}
        namespace={namespace}
        onOpenModal={onOpenModal}
        onEditBroker={onEditBroker}
      />
    </>
  );
};
