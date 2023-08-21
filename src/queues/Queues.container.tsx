import { FC, useEffect, useState } from 'react';
import { Queues } from './Queues.component';
import { useGetQueues } from '../../artemis-service';
import { SortByDirection } from '@patternfly/react-table';

export type Queue = {
  name: string;
  routingType: string; // this maybe an enum
  autoCreated: boolean;
  autoDelete: boolean;
  created?: Date;
};

const QueuesContainer: FC = () => {
  const getQueues = useGetQueues();
  const [queueData, setQueueData] = useState<Queue[]>([]);

  const getQueuesList = async () => {
    const response = await getQueues(
      1,
      10,
      { id: 'name', order: SortByDirection.desc },
      {
        column: '',
        operation: '',
        input: '',
      },
    );
    const parseResponse = JSON.parse(response.value);
    setQueueData(parseResponse.data);
  };

  useEffect(() => {
    getQueuesList();
  }, []);

  return <Queues queueData={queueData} isLoaded={true} loadError={null} />;
};

export { QueuesContainer };
