import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import {Brokers, Broker } from './brokers.component';

export default {
  title: 'Components/Brokers',
  component: Brokers,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Brokers>;

const brokers: Broker[] = [
  { name: 'build-infra', status: 'Active', size: 1, created: '2022-10-18T11:20:51.87402Z' },
  { name: 'order-processing', status: 'Active', size: 2, created: '2022-10-18T11:20:20.87402Z' },
  { name: 'notifications', status: 'Disabled', size: 1, created: '2022-09-18T11:19:51.87402Z' },
  { name: 'new-build-infra', status: 'Active', size: 4, created: '2022-10-18T11:20:10.87402Z' },
];

const Template: ComponentStory<typeof Brokers> = (args) => (
  <MemoryRouter>
    <Brokers {...args} />
  </MemoryRouter>
);

export const EmptyBrokersStory = Template.bind({});
EmptyBrokersStory.args = {
  brokers: [],
};

export const BrokersStory = Template.bind({});
BrokersStory.args = {
  brokers
};
