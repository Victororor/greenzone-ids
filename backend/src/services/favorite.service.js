const { db } = require('../config/firebase');
const { AppError } = require('../utils/errorHandler');

const COLLECTION = "favorites";

const addFavorite = async (userId, placeId) => {
  const ref = db.collection(COLLECTION).doc(`${userId}_${placeId}`);
  const snap = await ref.get();

  if (snap.exists) return; // già presente

  await ref.set({
    userId,
    placeId,
    createdAt: new Date()
  });
};

const removeFavorite = async (userId, placeId) => {
  await db.collection(COLLECTION).doc(`${userId}_${placeId}`).delete();
};

const getUserFavorites = async (userId) => {
  const favSnap = await db.collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  const placeIds = favSnap.docs.map(d => d.data().placeId);

  if (placeIds.length === 0) return [];

  const placeRefs = placeIds.map(id => db.collection("places").doc(id));
  const placeDocs = await db.getAll(...placeRefs);

  return placeDocs
    .filter(doc => doc.exists)
    .map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = { addFavorite, removeFavorite, getUserFavorites };
