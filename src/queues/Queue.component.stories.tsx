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
      name: 'ExpiryQueue',
      routingType: 'anycast',
      messageCount: 0,
      durable: true,
      autoDelete: false,
    },
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Queues> = () => <Queues {...props} />;

export const QueuesPageStory = Template.bind({});
