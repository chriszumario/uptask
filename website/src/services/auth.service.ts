import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import {
    CheckPasswordForm,
    ConfirmToken,
    ForgotPasswordForm,
    NewPasswordForm,
    RequestConfirmationCodeForm,
    UserLoginForm,
    UserRegistrationForm,
    userSchema,
} from '../types';
import { safeParse } from 'valibot';

export async function createAccount(formData: UserRegistrationForm) {
    try {
        const url = '/auth/create-account';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function confirmAccount(formData: ConfirmToken) {
    try {
        const url = '/auth/confirm-account';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function requestConfirmationCode(
    formData: RequestConfirmationCodeForm
) {
    try {
        const url = '/auth/request-code';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function authenticateUser(formData: UserLoginForm) {
    try {
        const url = '/auth/login';
        const { data } = await api.post(url, formData);
        localStorage.setItem('AUTH_TOKEN', data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function validateToken(formData: ConfirmToken) {
    try {
        const url = '/auth/validate-token';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function updatePasswordWithToken({
    formData,
    token,
}: {
    formData: NewPasswordForm;
    token: ConfirmToken['token'];
}) {
    try {
        const url = `/auth/update-password/${token}`;
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api('/auth/user');
        const response = safeParse(userSchema, data);
        if (response.success) {
            return response.output;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function checkPassword(formData: CheckPasswordForm) {
    try {
        const url = '/auth/check-password';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}
