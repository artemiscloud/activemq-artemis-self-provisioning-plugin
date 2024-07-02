import { YamlEditorView } from '../../../../shared-components/YamlEditorView/YamlEditorView';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Components/AddBrokerForm',
  component: YamlEditorView,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof YamlEditorView>;

const Template: ComponentStory<typeof YamlEditorView> = (args) => {
  return <YamlEditorView {...args} />;
};

export const YamlEditorViewStory = Template.bind({});
