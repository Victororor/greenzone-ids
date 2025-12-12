import { apiPost } from "./api";

export function login(email, password) {
    return apiPost('/api/auth/login', { email, password });
}