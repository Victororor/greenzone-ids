const { z } = require('zod');

const favoriteSchema = z.object({
    placeId: z.string().min(1),
    userId: z.string().min(1)
});

describe('TC-08 - Preferiti', () => {

    test('dovrebbe validare aggiunta preferito', () => {
        const validFavorite = { placeId: 'place123', userId: 'user456' };
        const result = favoriteSchema.safeParse(validFavorite);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare placeId mancante', () => {
        const invalidFavorite = { userId: 'user456' };
        const result = favoriteSchema.safeParse(invalidFavorite);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare userId mancante', () => {
        const invalidFavorite = { placeId: 'place123' };
        const result = favoriteSchema.safeParse(invalidFavorite);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare id vuoti', () => {
        const invalidFavorite = { placeId: '', userId: '' };
        const result = favoriteSchema.safeParse(invalidFavorite);
        expect(result.success).toBe(false);
    });
});