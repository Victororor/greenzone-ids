const { z } = require('zod');

const VALID_CATEGORIES = ['negozio', 'carica', 'fontane', 'parco'];

const updatePlaceSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(1000).optional(),
    category: z.enum(VALID_CATEGORIES).optional(),
    isActive: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'Almeno un campo deve essere fornito'
});

describe('TC-07 - Modifica/Eliminazione', () => {

    test('dovrebbe validare modifica nome', () => {
        const validUpdate = { name: 'Nuovo Nome' };
        const result = updatePlaceSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
    });

    test('dovrebbe validare modifica multipla', () => {
        const validUpdate = { name: 'Nuovo Nome', description: 'Nuova descrizione' };
        const result = updatePlaceSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare oggetto vuoto', () => {
        const invalidUpdate = {};
        const result = updatePlaceSchema.safeParse(invalidUpdate);
        expect(result.success).toBe(false);
    });

    test('dovrebbe validare disattivazione (soft delete)', () => {
        const validUpdate = { isActive: false };
        const result = updatePlaceSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
    });
});