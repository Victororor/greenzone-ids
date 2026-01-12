const { z } = require('zod');

const logoutRequestSchema = z.object({
    userId: z.string().min(1)
});

describe('TC-10 - Logout', () => {

    test('dovrebbe validare richiesta logout', () => {
        const validRequest = { userId: 'user123' };
        const result = logoutRequestSchema.safeParse(validRequest);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare userId mancante', () => {
        const invalidRequest = {};
        const result = logoutRequestSchema.safeParse(invalidRequest);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare userId vuoto', () => {
        const invalidRequest = { userId: '' };
        const result = logoutRequestSchema.safeParse(invalidRequest);
        expect(result.success).toBe(false);
    });
});