const { z } = require('zod');

const profileSchema = z.object({
    uid: z.string().min(1),
    email: z.string().email(),
    nome: z.string().min(2).max(50),
    cognome: z.string().min(2).max(50),
    ruolo: z.enum(['user', 'admin'])
});

describe('TC-09 - Profilo', () => {

    test('dovrebbe validare profilo completo', () => {
        const validProfile = {
            uid: 'user123',
            email: 'test@example.com',
            nome: 'Francesco',
            cognome: 'Pezzuto',
            ruolo: 'user'
        };
        const result = profileSchema.safeParse(validProfile);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare email non valida', () => {
        const invalidProfile = {
            uid: 'user123',
            email: 'invalid-email',
            nome: 'Francesco',
            cognome: 'Pezzuto',
            ruolo: 'user'
        };
        const result = profileSchema.safeParse(invalidProfile);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare ruolo non valido', () => {
        const invalidProfile = {
            uid: 'user123',
            email: 'test@example.com',
            nome: 'Francesco',
            cognome: 'Pezzuto',
            ruolo: 'superadmin'
        };
        const result = profileSchema.safeParse(invalidProfile);
        expect(result.success).toBe(false);
    });

    test('dovrebbe validare profilo admin', () => {
        const validProfile = {
            uid: 'admin123',
            email: 'admin@example.com',
            nome: 'Admin',
            cognome: 'User',
            ruolo: 'admin'
        };
        const result = profileSchema.safeParse(validProfile);
        expect(result.success).toBe(true);
    });
});