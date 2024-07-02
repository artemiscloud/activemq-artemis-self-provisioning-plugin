import { FC, useEffect, useState } from 'react';
import { Clients } from './Clients.component';

export type Client = {
  name: string;
  connections: number;
  expires: Date;
  created: Date;
};

const ClientsContainer: FC = () => {
  const [clientData, setClientData] = useState<Client[]>([]);
  const getClientData = () => {
    setClientData([
      {
        name: 'build-infra-36cd',
        connections: 12,
        expires: new Date('2023-03-30,20:12:15'),
        created: new Date('Thu Mar 30 2023,20:12:15'),
      },
      {
        name: 'build-infra-4ed8',
        connections: 2,
        expires: new Date('2023-03-30,20:12:15'),
        created: new Date('Thu Mar 30 2023,20:12:15'),
      },
      {
        name: 'build-infra-e0d7',
        connections: 1,
        expires: new Date('2023-03-30,20:12:15'),
        created: new Date('Thu Mar 30 2023,20:12:15'),
      },
    ]);
  };

  useEffect(() => {
    getClientData();
  }, []);
  return <Clients clientData={clientData} isLoaded={true} loadError={null} />;
};

export { ClientsContainer };
