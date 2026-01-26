const { z } = require('zod');

const routeRequestSchema = z.object({
    origin: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
    }),
    destination: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
    }),
    mode: z.enum(['walking', 'bicycling'])
});

describe('TC-05 - Percorso', () => {

    test('dovrebbe validare percorso a piedi', () => {
        const validRoute = {
            origin: { lat: 41.9028, lng: 12.4964 },
            destination: { lat: 41.9100, lng: 12.5000 },
            mode: 'walking'
        };
        const result = routeRequestSchema.safeParse(validRoute);
        expect(result.success).toBe(true);
    });

    test('dovrebbe validare percorso in bici', () => {
        const validRoute = {
            origin: { lat: 41.9028, lng: 12.4964 },
            destination: { lat: 41.9100, lng: 12.5000 },
            mode: 'bicycling'
        };
        const result = routeRequestSchema.safeParse(validRoute);
        expect(result.success).toBe(true);
    });

    test('dovrebbe rifiutare modalità non valida', () => {
        const invalidRoute = {
            origin: { lat: 41.9028, lng: 12.4964 },
            destination: { lat: 41.9100, lng: 12.5000 },
            mode: 'driving'
        };
        const result = routeRequestSchema.safeParse(invalidRoute);
        expect(result.success).toBe(false);
    });

    test('dovrebbe rifiutare coordinate mancanti', () => {
        const invalidRoute = {
            origin: { lat: 41.9028, lng: 12.4964 },
            mode: 'walking'
        };
        const result = routeRequestSchema.safeParse(invalidRoute);
        expect(result.success).toBe(false);
    });
});