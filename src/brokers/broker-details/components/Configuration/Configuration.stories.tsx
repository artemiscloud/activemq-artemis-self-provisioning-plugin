import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConfigurationProps, Configuration } from './Configuration.component';

export default {
    title: 'ConfigurationPage',
    component: Configuration,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Configuration>;

const props: ConfigurationProps = {

    name: 'build-infra',
    status: 'Active',
    size: 2,
    persistanceEnabled: 'Yes',
    messageMigrationEnabled: 'Yes',
    image: 'registry.redhat.io/amq7/amq-broker:7.8',
    created: '20-10-2022'
}
const Template: ComponentStory<typeof Configuration> = () => (
    <Configuration
        {...props}
    />
);
export const ConfigurationPageStory = Template.bind({});
