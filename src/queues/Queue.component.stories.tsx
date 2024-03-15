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
      agent: '1.7.1',
      agentType: 'servlet',
      timestamp: 1709909566,
      streaming: true,
    },
    {
      agent: '1.7.1',
      agentType: 'servlet',
      timestamp: 1709909566,
      streaming: true,
    },
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Queues> = () => <Queues {...props} />;

export const QueuesPageStory = Template.bind({});
