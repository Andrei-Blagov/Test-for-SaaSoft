<template>
    <div class="card account">
        <div class="field">
            <label>Метки</label>
            <input v-model="tagsInput" @blur="onTagsBlur" :class="{ error: errors.tags }"
                placeholder="Метка1; Метка2..." />
            <span v-if="errors.tags" class="error-msg">{{ errors.tags }}</span>
        </div>

        <div class="field">
            <label>Тип записи</label>
            <select v-model="local.type" @change="onTypeChange">
                <option value="LDAP">LDAP</option>
                <option value="Local">Локальная</option>
            </select>
        </div>

        <div class="field">
            <label>Логин</label>
            <input v-model="local.login" @blur="onBlurSave" maxlength="100" :class="{ error: errors.login }"
                placeholder="Значение" />
            <span v-if="errors.login" class="error-msg">{{ errors.login }}</span>
        </div>

        <div class="field" v-if="local.type === 'Local'">
            <label>Пароль</label>
            <div class="password-wrapper">
                <input :type="showPassword ? 'text' : 'password'" v-model="local.password" @blur="onBlurSave"
                    maxlength="100" :class="{ error: errors.password }" placeholder="Введите пароль" />
                <button type="button" class="toggle-btn" @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'">
                    {{ showPassword ? '👁️' : '🙈' }}
                </button>
            </div>
            <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <div class="actions">
            <button class="btn danger" @click="$emit('remove', local.id)">Удалить</button>
            <button class="btn primary" @click="forceSave">Сохранить</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Account } from '../types'
import { validateAccount } from '../utils/validation'

const props = defineProps<{ account: Account }>()
const emit = defineEmits<{ (e: 'remove', id: string): void; (e: 'save', acc: Account): void }>()

const local = reactive({ ...props.account })
const tagsInput = ref(props.account.tags.map(t => t.text).join(';'))
const errors = reactive<{ [k: string]: string | null }>({ tags: null, login: null, password: null, type: null })

const showPassword = ref(false)

watch(() => props.account, (v) => {
    Object.assign(local, v)
    tagsInput.value = v.tags.map(t => t.text).join(';')
})

function parseTags(input: string) {
    return input.split(';').map(s => s.trim()).filter(Boolean).map(text => ({ text }))
}

function onTagsBlur() {
    local.tags = parseTags(tagsInput.value)
    validateAndSave()
}

function onBlurSave() {
    validateAndSave()
}

function onTypeChange() {
    if (local.type === 'LDAP') local.password = null
    if (local.type === 'Local' && local.password === null) local.password = ''
    validateAndSave()
}

function forceSave() {
    validateAndSave(true)
}

function validateAndSave(force = false) {
    const { isValid, errors: e } = validateAccount(local)
    Object.assign(errors, e)
    if (isValid || force) {
        emit('save', {
            ...local,
            tags: parseTags(tagsInput.value)
        })
    }
}

function togglePassword() {
    /// const input = document.getElementById('password-input');
    input.type = input.type === 'password' ? 'text' : 'password';
}
</script>
