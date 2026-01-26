const { z } = require('zod');

const VALID_CATEGORIES = ['negozio', 'carica', 'fontane', 'parco'];

const createPlaceSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(1000).optional(),
    category: z.enum(VALID_CATEGORIES),
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
    })
});

describe('TC-06 - Segnalazione luogo', () => {

    test('dovrebbe validare segnalazione completa', () => {
        const validPlace = {
            name: 'Negozio Bio',
            description: 'Bio',
            category: 'Negozio',
            location: { latitude: 41.9028, longitude: 12.4964 }
        };
        const result = createPlaceSchema.safeParse(validPlace);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare nome troppo corto', () => {
        const invalidPlace = {
            name: 'A',
            category: 'negozio',
            location: { latitude: 41.9028, longitude: 12.4964 }
        };
        const result = createPlaceSchema.safeParse(invalidPlace);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare categoria non valida', () => {
        const invalidPlace = {
            name: 'Test Place',
            category: 'invalid',
            location: { latitude: 41.9028, longitude: 12.4964 }
        };
        const result = createPlaceSchema.safeParse(invalidPlace);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare posizione mancante', () => {
        const invalidPlace = {
            name: 'Test Place',
            category: 'negozio'
        };
        const result = createPlaceSchema.safeParse(invalidPlace);
        expect(result.success).toBe(false);
    });
});