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
      status: 200,
      timestamp: 1703261174,
      agent: '1.7.1',
    },
    {
      status: 200,
      timestamp: 1703261174,
      agent: '1.7.1',
    },
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Queues> = () => <Queues {...props} />;

export const QueuesPageStory = Template.bind({});
