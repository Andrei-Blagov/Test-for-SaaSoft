export type AccountType = 'LDAP' | 'Local';

export type Tag = {
    text: string;
};

export type Account = {
    id: string;
    tags: Tag[];
    tagsInput?: string;
    type: AccountType;
    login: string;
    password: string | null;
};
