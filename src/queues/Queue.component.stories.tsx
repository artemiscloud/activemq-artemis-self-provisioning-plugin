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
      timestamp: 1710749484,
    },
    {
      name: 'DLQ',
      timestamp: 1710749484,
    },
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Queues> = () => <Queues {...props} />;

export const QueuesPageStory = Template.bind({});
