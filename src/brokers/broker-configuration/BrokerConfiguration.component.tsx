import {
  Split,
  SplitItem,
  Title,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { BorkerConfigurationSettings } from './types';

export interface ConfigurationPageProps {
  configurationData: BorkerConfigurationSettings;
  onEditClick: () => void;
}
const ConfigurationPage: React.FC<ConfigurationPageProps> = ({
  configurationData,
  onEditClick
}) => {
  return (
    <div style={{ padding: "2%" }}>
      <Split
        hasGutter={true}
        component={'div'}
        className="pf-u-align-items-center"
      >
        <SplitItem isFilled={true} style={{ paddingBottom: "4%" }}>
          <Title headingLevel="h2" size="2xl">
            Settings
          </Title>
        </SplitItem>
        <SplitItem>
          <Button variant="primary" onClick={onEditClick}>Edit settings</Button>
        </SplitItem>
      </Split>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.name}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.status}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Size</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.size}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Persistance enabled</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.persistanceEnabled? 'Yes': 'No'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Message migration enabled</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.messageMigrationEnabled? 'Yes': 'No'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Image</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.image}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Created</DescriptionListTerm>
          <DescriptionListDescription>
            {configurationData.created}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </div>
  );
};

export default ConfigurationPage;
