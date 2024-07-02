import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Clients, ClientProps } from './Clients.component';

export default {
  title: 'Clients',
  component: Clients,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Clients>;

const props: ClientProps = {
  clientData: [
    {
      name: 'build-infra-36cd',
      connections: 12,
      expires: new Date('2023-03-30,20:12:15'),
      created: new Date('Thu Mar 30 2023,20:12:15'),
    },
    {
      name: 'build-infra-4ed8',
      connections: 2,
      expires: new Date('2023-03-30,20:12:15'),
      created: new Date('Thu Mar 30 2023,20:12:15'),
    },
    {
      name: 'build-infra-e0d7',
      connections: 1,
      expires: new Date('2023-03-30,20:12:15'),
      created: new Date('Thu Mar 30 2023,20:12:15'),
    },
  ],
  isLoaded: true,
  loadError: null,
};
const Template: ComponentStory<typeof Clients> = () => <Clients {...props} />;

export const ClientPageStory = Template.bind({});
