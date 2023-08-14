import { FC, useEffect, useState } from 'react';
import { Topics } from './Topics.component';

export type Topic = {
  name: string;
  created: Date;
};

const TopicsContainer: FC = () => {
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const getTopicData = () => {
    setTopicData([
      {
        name: 'notifications',
        created: new Date('Mon Apr 3 2023 17:11:02'),
      },
      {
        name: 'agents.alpha',
        created: new Date('Mon Apr 3 2023 17:11:02'),
      },
      {
        name: 'agents.beta',
        created: new Date('Mon Apr 3 2023 17:11:02'),
      },
    ]);
  };

  useEffect(() => {
    getTopicData();
  }, []);
  return <Topics topicData={topicData} isLoaded={true} loadError={null} />;
};

export { TopicsContainer };
