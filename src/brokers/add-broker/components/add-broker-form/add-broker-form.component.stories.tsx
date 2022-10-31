import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddBrokerForm } from './add-broker-form.component';

export default {
  title: 'Components/AddBrokerForm',
  component: AddBrokerForm,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AddBrokerForm>;

const Template: ComponentStory<typeof AddBrokerForm> = (args) => {
  return <AddBrokerForm {...args} />;
};

export const AddBrokerFormStory = Template.bind({});
