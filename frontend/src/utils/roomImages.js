// Fallback photos by room type, used when a room has no image saved
// (e.g. rooms created before images were added).
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const typeImages = {
  single: u('photo-1631049307264-da0ec9d70304'),
  double: u('photo-1590490360182-c33d57733427'),
  deluxe: u('photo-1611892440504-42a792e24d32'),
  suite: u('photo-1582719478250-c89cae4dc85b'),
};

export const HERO_IMAGE = u('photo-1566073771259-6a8506099945');
export const AUTH_IMAGE = u('photo-1542314831-068cd1dbfeeb');

export const getRoomImage = (room) => room?.image || typeImages[room?.type] || typeImages.double;

export const getRoomGallery = (room) => {
  const list = [room?.image, ...(room?.images || [])].filter(Boolean);
  const unique = [...new Set(list)];
  return unique.length ? unique : [getRoomImage(room)];
};

// If an image URL is broken, swap in a plain gradient so the layout never breaks.
export const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.removeAttribute('src');
  e.currentTarget.classList.add('img-fallback');
};
