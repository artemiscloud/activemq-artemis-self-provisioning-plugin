import { FC } from 'react';
import { BrokersList, BrokersListProps } from './components';

export type BrokersProps = BrokersListProps;

const BrokersPage: FC<BrokersProps> = ({
  brokers,
  loaded,
  loadError,
  onDeleteBroker,
  onEditBroker,
}) => {
  return (
    <BrokersList
      brokers={brokers}
      loaded={loaded}
      loadError={loadError}
      onDeleteBroker={onDeleteBroker}
      onEditBroker={onEditBroker}
    />
  );
};

export { BrokersPage };
