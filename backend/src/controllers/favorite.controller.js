const { z } = require("zod");
const favoriteService = require("../services/favorite.service");
const { AppError } = require("../utils/errorHandler");


const placeIdSchema = z.string().min(1, "placeId mancante o non valido");

/**
 * GET /api/favorites/me
 * Ritorna i preferiti dell'utente loggato
 */
const getMyFavorites = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const favorites = await favoriteService.getUserFavorites(userId);

    res.status(200).json({
      status: "success",
      results: favorites.length,
      data: { favorites },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/favorites/:placeId
 * Aggiunge ai preferiti
 */
const addFavorite = async (req, res, next) => {
  try {
    const parsed = placeIdSchema.parse(req.params.placeId);

    await favoriteService.addFavorite(req.user.uid, parsed);

    res.status(201).json({
      status: "success",
      message: "Aggiunto ai preferiti",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

/**
 * DELETE /api/favorites/:placeId
 * Rimuove dai preferiti
 */
const removeFavorite = async (req, res, next) => {
  try {
    const parsed = placeIdSchema.parse(req.params.placeId);

    await favoriteService.removeFavorite(req.user.uid, parsed);

    res.status(200).json({
      status: "success",
      message: "Rimosso dai preferiti",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

module.exports = {
  getMyFavorites,
  addFavorite,
  removeFavorite,
};
