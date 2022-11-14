/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    Split,
    SplitItem,
    Title,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm
} from '@patternfly/react-core';
import { Settings } from './types';

export interface IConfigurationPageProps {
    settingsData: Settings,
    onEditClick: () => void;
}
const ConfigurationPage: React.FC<IConfigurationPageProps> = ({
    settingsData
}) => {
    return (
        <>
            <Split
                hasGutter={true}
                component={'div'}
                className="pf-u-align-items-center"
            >
                <SplitItem isFilled={true}>
                    <Title
                        headingLevel="h2"
                        size="2xl"
                    >
                        Settings
                    </Title>
                </SplitItem>
                <SplitItem>
                    <Button variant='primary'>Edit settings</Button>
                </SplitItem>
            </Split>
            <DescriptionList isHorizontal>
                <DescriptionListGroup>
                    <DescriptionListTerm>Name</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.name}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.status}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Size</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.size}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Persistance enabled</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.persistanceEnabled}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Message migration enabled</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.messageMigrationEnabled}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Image</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.image}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                    <DescriptionListTerm>Created</DescriptionListTerm>
                    <DescriptionListDescription>{settingsData.created.toDateString()}</DescriptionListDescription>
                </DescriptionListGroup>
            </DescriptionList>
        </>
    );
};

export default ConfigurationPage;
