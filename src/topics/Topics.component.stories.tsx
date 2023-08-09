import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Topics, TopicsProps } from './Topics.component';

export default {
  title: 'Topics',
  component: Topics,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Topics>;

const props: TopicsProps = {
  topicData: [
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
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Topics> = () => <Topics {...props} />;

export const QueuesPageStory = Template.bind({});
