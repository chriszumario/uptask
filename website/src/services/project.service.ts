import api from '@/lib/axios';
import {
    Project,
    ProjectFormData,
    dashboardProjectSchema,
    editProjectSchema,
    projectSchema,
} from '../types';
import { isAxiosError } from 'axios';
import { safeParse } from 'valibot';

export async function createProject(formData: ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getProjects() {
    try {
        const { data } = await api('/projects');
        const response = safeParse(dashboardProjectSchema, data);
        if (response.success) {
            return response.output;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`);
        const response = safeParse(editProjectSchema, data);
        if (response.success) {
            return response.output;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function getFullProject(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`);
        const response = safeParse(projectSchema, data);
        if (response.success) {
            return response.output;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData;
    projectId: Project['_id'];
};

export async function updateProject({ formData, projectId }: ProjectAPIType) {
    try {
        const { data } = await api.put(`/projects/${projectId}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function deleteProject(id: Project['_id']) {
    try {
        const url = `/projects/${id}`;
        const { data } = await api.delete(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}
