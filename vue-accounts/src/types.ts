export type AccountType = 'LDAP' | 'Local';

export type Tag = {
    text: string;
};

export type Account = {
    id: string; // uuid или timestamp
    tags: Tag[]; // хранится как массив объектов { text }
    tagsInput?: string; // вспомогательное поле для редактирования (строка с ;)
    type: AccountType;
    login: string;
    password: string | null;
};
