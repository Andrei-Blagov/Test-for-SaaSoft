<template>
    <div class="account">
        <div class="row">
            <label>Метки</label>
            <input v-model="tagsInput" @blur="onTagsBlur" :class="{ invalid: errors.tags }"
                placeholder="метка1;метка2" />
            <div v-if="errors.tags" class="err">{{ errors.tags }}</div>
        </div>

        <div class="row">
            <label>Тип записи</label>
            <select v-model="local.type" @change="onTypeChange">
                <option value="LDAP">LDAP</option>
                <option value="Local">Локальная</option>
            </select>
        </div>

        <div class="row">
            <label>Логин</label>
            <input v-model="local.login" @blur="onBlurSave" :class="{ invalid: errors.login }" maxlength="100" />
            <div v-if="errors.login" class="err">{{ errors.login }}</div>
        </div>

        <div class="row" v-if="local.type === 'Local'">
            <label>Пароль</label>
            <input v-model="local.password" type="password" @blur="onBlurSave" :class="{ invalid: errors.password }"
                maxlength="100" />
            <div v-if="errors.password" class="err">{{ errors.password }}</div>
        </div>

        <div class="controls">
            <button @click="$emit('remove', local.id)">Удалить</button>
            <button @click="forceSave">Сохранить</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Account } from '@/types';
import { validateAccount } from '@/utils/validation';
import { toRaw } from 'vue';

const props = defineProps<{ account: Account }>();
const emit = defineEmits<{
    (e: 'remove', id: string): void;
    (e: 'save', account: Account): void;
}>();

// локальная копия, чтобы редактировать без немедленного пуша в стор
const local = reactive({ ...props.account } as Account);
const tagsInput = ref(props.account.tagsInput ?? props.account.tags.map(t => t.text).join(';'));
const errors = reactive<{ [k: string]: string | null }>({
    tags: null,
    login: null,
    password: null,
});

watch(() => props.account, (v) => {
    Object.assign(local, v);
    tagsInput.value = v.tags.map(t => t.text).join(';');
});

function parseTags(input: string) {
    return input
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(text => ({ text }));
}

function onTagsBlur() {
    const parsed = parseTags(tagsInput.value);
    local.tags = parsed;
    local.tagsInput = tagsInput.value;
    const { isValid, errors: e } = validateAccount(local);
    Object.assign(errors, e);
    if (isValid) {
        emit('save', toRaw(local));
    }
}

function onBlurSave() {
    const { isValid, errors: e } = validateAccount(local);
    Object.assign(errors, e);
    if (isValid) {
        emit('save', toRaw(local));
    }
}

function onTypeChange() {
    if (local.type === 'LDAP') {
        local.password = null;
    } else if (local.type === 'Local' && (local.password === null)) {
        local.password = '';
    }
    onBlurSave();
}

function forceSave() {
    const { isValid, errors: e } = validateAccount(local);
    Object.assign(errors, e);
    if (isValid) emit('save', toRaw(local));
}
</script>

<style scoped>
.account {
    border: 1px solid #ddd;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 6px;
}

.row {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
}

.controls {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.invalid {
    border: 1px solid red;
}

.err {
    color: red;
    font-size: 12px;
}
</style>
