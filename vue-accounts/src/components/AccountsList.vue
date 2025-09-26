<template>
    <div>
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
            <h2>Список учётных записей</h2>
            <button @click="add">+</button>
        </div>

        <div v-if="store.accounts.length === 0">Пока нет записей — нажмите + чтобы добавить</div>

        <div class="list">
            <AccountItem v-for="acc in store.accounts" :key="acc.id" :account="acc" @remove="onRemove" @save="onSave" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/store/accounts';
import AccountItem from './AccountItem.vue';
import { storeToRefs } from 'pinia';
const store = useAccountsStore();

function add() {
    store.addEmpty();
}

function onRemove(id: string) {
    store.remove(id);
}

function onSave(updatedAccount: any) {
    store.update(updatedAccount);
}
</script>
