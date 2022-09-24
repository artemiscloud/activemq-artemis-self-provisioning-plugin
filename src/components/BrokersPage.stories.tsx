import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import BrokersPage from './BrokersPage';

export default {
  title: 'Components/BrokersPage',
  component: BrokersPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BrokersPage>;

const Template: ComponentStory<typeof BrokersPage> = () => (
  <MemoryRouter>
    <BrokersPage />
  </MemoryRouter>
);
export const BrokersPageStory = Template.bind({});
