export type BorkerConfigurationSettings = {
    name: string;
    status: string;
    size: number;
    persistanceEnabled: boolean;
    messageMigrationEnabled: boolean;
    image: string;
    created: Date;
}