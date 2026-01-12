const { z } = require('zod');

// Schema per query nearby
const nearbyQuerySchema = z.object({
    lat: z.string().transform(val => parseFloat(val)).pipe(z.number().min(-90).max(90)),
    lng: z.string().transform(val => parseFloat(val)).pipe(z.number().min(-180).max(180)),
    radius: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0.1).max(100)).optional()
});

describe('TC-03 - Mappa dei luoghi sostenibili', () => {

    test('dovrebbe validare coordinate corrette', () => {
        const validQuery = { lat: '41.9028', lng: '12.4964', radius: '10' };
        const result = nearbyQuerySchema.safeParse(validQuery);
        expect(result.success).toBe(true);
        expect(result.data.lat).toBe(41.9028);
        expect(result.data.lng).toBe(12.4964);
    });

    test('dovrebbe rifiutare latitudine fuori range', () => {
        const invalidQuery = { lat: '91', lng: '12.4964' };
        const result = nearbyQuerySchema.safeParse(invalidQuery);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare longitudine fuori range', () => {
        const invalidQuery = { lat: '41.9028', lng: '181' };
        const result = nearbyQuerySchema.safeParse(invalidQuery);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare radius fuori range', () => {
        const invalidQuery = { lat: '41.9028', lng: '12.4964', radius: '101' };
        const result = nearbyQuerySchema.safeParse(invalidQuery);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare parametri mancanti', () => {
        const invalidQuery = { lat: '41.9028' };
        const result = nearbyQuerySchema.safeParse(invalidQuery);
        expect(result.success).toBe(false);
    });
});
