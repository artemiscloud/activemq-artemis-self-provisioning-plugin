import { useEffect } from "@storybook/addons";
import { useState } from "react";
import ConfigurationPage from "./ConfigurationPage.component";
import { Settings } from "./types";

const ConfigurationPageContainer: React.FC = () => {
    const [configurationSettings, setConfigurationSettings] = useState<Settings>();
    const handleEditClick = () => {
        // handle edit click here
    }

    const getConfigurationSettings = () => {
        //make api call to get configuration settings
        setConfigurationSettings({
            name: 'build-infra',
            status: 'Active',
            size: 2,
            persistanceEnabled: 'Yes',
            messageMigrationEnabled: 'Yes',
            image: 'registry.redhat.io/amq7/amq-broker:7.8',
            created: new Date()
        })
    }

    useEffect(() => {
        getConfigurationSettings();
    }, []);

    return (
        <ConfigurationPage
            settingsData={configurationSettings}
            onEditClick={handleEditClick}
        />
    );
}

export default ConfigurationPageContainer