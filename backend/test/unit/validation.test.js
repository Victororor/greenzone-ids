const { z } = require('zod');

const signupSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(6, 'Password deve avere almeno 6 caratteri'),
    nome: z.string().min(2, 'Nome deve avere almeno 2 caratteri').max(50),
    cognome: z.string().min(2, 'Cognome deve avere almeno 2 caratteri').max(50)
});

const loginSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(1, 'Password richiesta')
});

describe('Signup Schema Validation', () => {
    test('dovrebbe validare dati corretti', () => {
        const validData = {
            email: 'francescopezzuto.com',
            password: 'Password123!',
            nome: 'Francesco',
            cognome: 'Pezzuto'
        };

        const result = signupSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare email non valida', () => {
        const invalidData = {
            email: 'email non valida',
            password: 'Password123!',
            nome: 'Francesco',
            cognome: 'Pezzuto'
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.errors[0].message).toBe('Email non valida');
    });

    test('password troppo corta', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com',
            password: '12345',
            nome: 'Francesco',
            cognome: 'Pezzuto'
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.errors[0].message).toBe('Password deve avere almeno 6 caratteri');
    });

    test('dovrebbe rifiutare nome troppo corto', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com',
            password: 'Password123!',
            nome: 'F',
            cognome: 'Pezzuto'
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.errors[0].message).toBe('Nome deve avere almeno 2 caratteri');
    });

    test('dovrebbe rifiutare cognome troppo corto', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com',
            password: 'Password123!',
            nome: 'Francesco',
            cognome: 'Pezz'
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.errors[0].message).toBe('Cognome deve avere almeno 2 caratteri');
    });

    test('dovrebbe rifiutare nome troppo lungo', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com',
            password: 'Password123!',
            nome: 'F'.repeat(51),
            cognome: 'Pezzuto'
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare campi mancanti', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com'
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});

describe('Login Schema Validation', () => {
    test('dovrebbe validare credenziali corrette', () => {
        const validData = {
            email: 'francescopezzuto@test.com',
            password: 'password123'
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare email non valida', () => {
        const invalidData = {
            email: 'fff@mail.com',
            password: 'password123'
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.errors[0].message).toBe('Email non valida');
    });

    test('dovrebbe rifiutare password vuota', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com',
            password: ''
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.errors[0].message).toBe('Password richiesta');
    });

    test('dovrebbe rifiutare campi mancanti', () => {
        const invalidData = {
            email: 'francescopezzuto@test.com'
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});
