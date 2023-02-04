import {
    Split,
    SplitItem,
    Title,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    PageSection
} from '@patternfly/react-core';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';

export type ConfigurationProps = {
    name: string;
    status: string;
    size: number;
    persistanceEnabled: string;
    messageMigrationEnabled: string;
    image: string;
    created: string;
};

const Configuration: React.FC<ConfigurationProps> = ({
    name,
    status,
    size,
    persistanceEnabled,
    messageMigrationEnabled,
    image,
    created
}) => {
    return (
        <PageSection>
            <Split
                hasGutter={true}
                component={'div'}
                className="pf-u-align-items-center"
            >
                <SplitItem isFilled={true}>
                    <Title
                        headingLevel="h1"
                    >
                        Settings
                    </Title>
                </SplitItem>
                <SplitItem>
                    <Button variant='primary'>Edit settings</Button>
                </SplitItem>
            </Split>
            <DescriptionList
                isHorizontal
                horizontalTermWidthModifier={{
                    default: '20ch',
                    sm: '20ch',
                    md: '20ch',
                    lg: '28ch',
                    xl: '30ch',
                    '2xl': '35ch'
                }}
            >
                <DescriptionListGroup>
                    <DescriptionListTerm>Name</DescriptionListTerm>
                    <DescriptionListDescription>{name}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>{status}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Size</DescriptionListTerm>
                    <DescriptionListDescription>{size}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Persistance enabled</DescriptionListTerm>
                    <DescriptionListDescription>{persistanceEnabled}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Message migration enabled</DescriptionListTerm>
                    <DescriptionListDescription>{messageMigrationEnabled}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Image</DescriptionListTerm>
                    <DescriptionListDescription>{image}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Created</DescriptionListTerm>
                    <DescriptionListDescription><Timestamp timestamp={created} /></DescriptionListDescription>
                </DescriptionListGroup>
            </DescriptionList>
        </PageSection>
    );
};

export { Configuration };
