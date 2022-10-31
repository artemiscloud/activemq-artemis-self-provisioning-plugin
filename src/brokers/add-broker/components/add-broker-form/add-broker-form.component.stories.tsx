import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EditorPage } from './add-broker-form.component';

export default {
  title: 'Components/EditorPage',
  component: EditorPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof EditorPage>;

const Template: ComponentStory<typeof EditorPage> = (args) => {
  return <EditorPage {...args}/>;
};

export const EditorPageStory = Template.bind({});
