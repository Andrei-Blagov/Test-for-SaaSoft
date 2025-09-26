<template>
    <div class="card">
        <div class="card-header">
            <h2>Список учётных записей</h2>
            <button class="btn add" @click="add">+</button>
        </div>

        <p v-if="store.accounts.length" class="info teg">
            Для указания нескольких меток одной учетной записи используйте разделитель ;
        </p>

        <p v-else="!store.accounts.length" class="info">
            Пока нет записей — добавьте первую
        </p>

        <div class="grid">
            <AccountItem v-for="acc in store.accounts" :key="acc.id" :account="acc" @remove="onRemove" @save="onSave" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '../store/accounts'
import AccountItem from './AccountItem.vue'

const store = useAccountsStore()
const add = () => store.addEmpty()
const onRemove = (id: string) => store.remove(id)
const onSave = (acc: any) => store.update(acc)
</script>
