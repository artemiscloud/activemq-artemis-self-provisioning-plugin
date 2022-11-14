import { ComponentStory, ComponentMeta } from '@storybook/react';
import ConfigurationPage, { IConfigurationPageProps } from './ConfigurationPage.component';



export default {
    title: 'ConfigurationPage',
    component: ConfigurationPage,
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof ConfigurationPage>;

const props:IConfigurationPageProps = {
    settingsData: {
        name: 'build-infra',
        status: 'Active',
        size: 2,
        persistanceEnabled: 'Yes',
        messageMigrationEnabled: 'Yes',
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
