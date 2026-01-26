const { z } = require('zod');

const VALID_CATEGORIES = ['negozio', 'carica', 'fontane', 'parco'];

const filterSchema = z.object({
    category: z.enum(VALID_CATEGORIES).optional(),
    city: z.string().max(100).optional(),
    isVerified: z.boolean().optional(),
    radius: z.number().min(0.1).max(100).optional()
});

describe('TC-04 - Filtri', () => {

    test('dovrebbe validare filtro per categoria', () => {
        const validFilter = { category: 'fontane' };
        const result = filterSchema.safeParse(validFilter);
        expect(result.success).toBe(true);
    });

    test('dovrebbe validare tutte le categorie', () => {
        VALID_CATEGORIES.forEach(category => {
            const result = filterSchema.safeParse({ category });
            expect(result.success).toBe(true);
        });
    });

    test('dovrebbe rifiutare categoria non valida', () => {
        const invalidFilter = { category: 'invalid' };
        const result = filterSchema.safeParse(invalidFilter);
        expect(result.success).toBe(false);
    });

    test('dovrebbe validare filtro per città', () => {
        const validFilter = { city: 'Milano' };
        const result = filterSchema.safeParse(validFilter);
        expect(result.success).toBe(true);
    });

    test('dovrebbe validare filtri combinati', () => {
        const validFilter = { category: 'fontane', city: 'Milano', isVerified: true };
        const result = filterSchema.safeParse(validFilter);
        expect(result.success).toBe(true);
    });
});