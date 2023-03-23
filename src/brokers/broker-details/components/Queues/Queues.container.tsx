import { FC, useEffect, useState } from 'react';
import { Queues } from './Queues.component';
// export interface QueuesContainerProps {
//   // TODO:add any prop if requried in future
// }

export type Queue = {
  name: string;
  routingType: string; // this maybe an enum
  autoCreateQueues: boolean;
  autoDeleteQueues: boolean;
  created: Date;
};

const QueuesContainer: FC = () => {
  // TODO:need to add real loading state after connection with real api
  // TODO:need to add error state after connection with real api
  const [queueData, setQueueData] = useState<Queue[]>([]);
  const getQueueData = () => {
    // TODO:make the real api call(using mock data now)
    setQueueData([
      {
        name: 'jobs',
        routingType: 'Anycast',
        autoCreateQueues: true,
        autoDeleteQueues: true,
        created: new Date('Thu Mar 16 2023 12:05:22'),
      },
      {
        name: 'commands',
        routingType: 'Multicast',
        autoCreateQueues: false,
        autoDeleteQueues: false,
        created: new Date('Thu Mar 16 2023 12:05:22'),
      },
    ]);
  };

  useEffect(() => {
    getQueueData();
  }, []);
  // TODO: replace hardcoded value with real data
  return <Queues queueData={queueData} isLoaded={true} loadError={null} />;
};

export { QueuesContainer };
