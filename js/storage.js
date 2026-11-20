export function getFavorites() {
  const data = localStorage.getItem("favorites");
  if (!data) return [];

  try {
    const favorites = JSON.parse(data);
    if (Array.isArray(favorites)) return favorites;
    return [];
  } catch (error) {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}