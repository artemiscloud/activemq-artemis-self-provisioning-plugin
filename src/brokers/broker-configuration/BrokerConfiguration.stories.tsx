import { ComponentStory, ComponentMeta } from '@storybook/react';
import ConfigurationPage, { ConfigurationPageProps } from './BrokerConfiguration.component';



export default {
    title: 'ConfigurationPage',
    component: ConfigurationPage,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof ConfigurationPage>;

const props: ConfigurationPageProps = {
    configurationData: {
        name: 'build-infra',
        status: 'Active',
        size: 2,
        persistanceEnabled: false,
        messageMigrationEnabled: false,
        image: 'registry.redhat.io/amq7/amq-broker:7.8',
        created: new Date()
    },
    onEditClick: () => {

    }
}
const Template: ComponentStory<typeof ConfigurationPage> = () => (
    <ConfigurationPage
        {...props}
    />
);
export const ConfigurationPageStory = Template.bind({});