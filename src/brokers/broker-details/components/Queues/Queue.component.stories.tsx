import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Queues, QueuesProps } from './Queues.component';

export default {
  title: 'Queues',
  component: Queues,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Queues>;

const props: QueuesProps = {
  queueData: [
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
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Queues> = () => <Queues {...props} />;

export const QueuesPageStory = Template.bind({});
