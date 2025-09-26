import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '../types';

const STORAGE_KEY = 'accounts_v1';

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([]);

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) accounts.value = JSON.parse(raw);
        } catch (e) {
            console.error('load accounts error', e);
        }
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value));
        } catch (e) {
            console.error('persist accounts error', e);
        }
    }

    function addEmpty() {
        const id = Date.now().toString();
        accounts.value.push({
            id,
            tags: [],
            tagsInput: '',
            type: 'Local',
            login: '',
            password: '',
        });
        persist();
    }

    function remove(id: string) {
        accounts.value = accounts.value.filter(a => a.id !== id);
        persist();
    }

    function update(account: Account) {
        const idx = accounts.value.findIndex(a => a.id === account.id);
        if (idx !== -1) {
            accounts.value[idx] = { ...account };
        } else {
            accounts.value.push(account);
        }
        persist();
    }

    load();
    
    return { 
        accounts, 
        addEmpty, 
        remove, 
        update, 
        load, 
        persist };
});
