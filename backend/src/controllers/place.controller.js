// Controller per la gestione dei luoghi "bio"
const placeService = require('../services/place.service');
const { AppError } = require('../utils/errorHandler');
const { z } = require('zod');

// Categorie valide
const VALID_CATEGORIES = ['restaurant', 'shop', 'farm', 'market', 'cafe', 'bakery', 'other'];

// Schema di validazione per la creazione
const createPlaceSchema = z.object({
    name: z.string().min(2, 'Nome deve avere almeno 2 caratteri').max(100),
    description: z.string().max(1000).optional(),
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        address: z.string().max(200).optional(),
        city: z.string().max(100).optional(),
        country: z.string().max(100).optional()
    }),
    category: z.enum(VALID_CATEGORIES, {
        errorMap: () => ({ message: `Categoria non valida. Valori: ${VALID_CATEGORIES.join(', ')}` })
    }),
    tags: z.array(z.string().max(30)).max(10).optional(),
    openingHours: z.record(z.string(), z.object({
        open: z.string(),
        close: z.string()
    })).optional(),
    contact: z.object({
        phone: z.string().max(20).optional(),
        email: z.string().email().optional().or(z.literal('')),
        website: z.string().url().optional().or(z.literal(''))
    }).optional()
});

// Schema di validazione per l'aggiornamento
const updatePlaceSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(1000).optional(),
    location: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        address: z.string().max(200).optional(),
        city: z.string().max(100).optional(),
        country: z.string().max(100).optional()
    }).optional(),
    category: z.enum(VALID_CATEGORIES).optional(),
    tags: z.array(z.string().max(30)).max(10).optional(),
    openingHours: z.record(z.string(), z.object({
        open: z.string(),
        close: z.string()
    })).optional(),
    contact: z.object({
        phone: z.string().max(20).optional(),
        email: z.string().email().optional().or(z.literal('')),
        website: z.string().url().optional().or(z.literal(''))
    }).optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'Almeno un campo deve essere fornito'
});

// Schema per query nearby
const nearbyQuerySchema = z.object({
    lat: z.string().transform(val => parseFloat(val)).pipe(z.number().min(-90).max(90)),
    lng: z.string().transform(val => parseFloat(val)).pipe(z.number().min(-180).max(180)),
    radius: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0.1).max(100)).optional()
});

/**
 * GET /api/places
 * Lista tutti i luoghi
 */
const getAllPlaces = async (req, res, next) => {
    try {
        const filters = {
            category: req.query.category,
            city: req.query.city,
            isVerified: req.query.isVerified === 'true' ? true : undefined
        };

        const places = await placeService.getAllPlaces(filters);

        res.status(200).json({
            status: 'success',
            results: places.length,
            data: { places }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/places/nearby
 * Luoghi vicini a una posizione
 */
const getNearbyPlaces = async (req, res, next) => {
    try {
        const validated = nearbyQuerySchema.parse(req.query);
        const { lat, lng, radius = 10 } = validated;

        const places = await placeService.getNearbyPlaces(lat, lng, radius);

        res.status(200).json({
            status: 'success',
            results: places.length,
            params: { latitude: lat, longitude: lng, radius },
            data: { places }
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return next(new AppError('Parametri non validi: lat e lng sono obbligatori', 400));
        }
        next(error);
    }
};

/**
 * GET /api/places/category/:category
 * Luoghi per categoria
 */
const getPlacesByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        if (!VALID_CATEGORIES.includes(category)) {
            return next(new AppError(`Categoria non valida. Valori: ${VALID_CATEGORIES.join(', ')}`, 400));
        }

        const places = await placeService.getPlacesByCategory(category);

        res.status(200).json({
            status: 'success',
            results: places.length,
            data: { places }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/places/user/:uid
 * Luoghi creati da un utente
 */
const getPlacesByUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const places = await placeService.getPlacesByUser(uid);

        res.status(200).json({
            status: 'success',
            results: places.length,
            data: { places }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/places/:id
 * Dettaglio luogo
 */
const getPlaceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await placeService.getPlaceById(id);

        res.status(200).json({
            status: 'success',
            data: { place }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/places
 * Crea nuovo luogo
 */
const createPlace = async (req, res, next) => {
    try {
        const validatedData = createPlaceSchema.parse(req.body);
        const newPlace = await placeService.createPlace(validatedData, req.user.uid);

        res.status(201).json({
            status: 'success',
            message: 'Luogo creato con successo',
            data: { place: newPlace }
        });
    } catch (error) {
        if (error.name === 'ZodError' && error.errors && error.errors.length > 0) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * PUT /api/places/:id
 * Aggiorna luogo
 */
const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = updatePlaceSchema.parse(req.body);

        // Solo admin può modificare isVerified
        if (validatedData.isVerified !== undefined && req.user.role !== 'admin') {
            return next(new AppError('Solo admin può verificare un luogo', 403));
        }

        const updatedPlace = await placeService.updatePlace(id, validatedData);

        res.status(200).json({
            status: 'success',
            message: 'Luogo aggiornato con successo',
            data: { place: updatedPlace }
        });
    } catch (error) {
        if (error.name === 'ZodError' && error.errors && error.errors.length > 0) {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

/**
 * DELETE /api/places/:id
 * Soft delete
 */
const softDeletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await placeService.softDeletePlace(id);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/places/:id/permanent
 * Hard delete (solo admin)
 */
const hardDeletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await placeService.hardDeletePlace(id);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /api/places/:id/restore
 * Ripristina luogo eliminato (solo admin)
 */
const restorePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await placeService.restorePlace(id);

        res.status(200).json({
            status: 'success',
            message: 'Luogo ripristinato con successo',
            data: { place }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPlaces,
    getNearbyPlaces,
    getPlacesByCategory,
    getPlacesByUser,
    getPlaceById,
    createPlace,
    updatePlace,
    softDeletePlace,
    hardDeletePlace,
    restorePlace
};
