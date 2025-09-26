import type { Account } from '../types';

export function validateAccount(a: Account) {
    const errors: Record<string, string | null> = {
        tags: null,
        type: null,
        login: null,
        password: null,
    };

    if (!a.login || a.login.trim().length === 0) {
        errors.login = 'Логин обязателен';
    } else if (a.login.length > 100) {
        errors.login = 'Максимум 100 символов';
    }

    if (a.type === 'Local') {
        if (a.password === null || a.password === undefined || a.password.toString().trim().length === 0) {
            errors.password = 'Пароль обязателен для Локальной учётной записи';
        } else if (a.password.toString().length > 100) {
            errors.password = 'Максимум 100 символов';
        }
    }

    if (a.tags && a.tags.some(t => t.text.length > 50)) {
        errors.tags = 'Каждая метка максимум 50 символов';
    }

    const isValid = Object.values(errors).every(v => v === null);

    return { isValid, errors };
}
