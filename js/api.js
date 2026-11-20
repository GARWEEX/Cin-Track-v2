const BASE_URL = "https://6afd9c422a9c141d36b8bd63.mockapi.io/api/v1";

export async function fetchMovies() {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) throw new Error("Impossible de charger les contenus.");
  const movies = await response.json();
  if (!Array.isArray(movies)) throw new Error("Les données reçues sont invalides.");
  return movies;
}

export async function createMovie(movie) {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie)
  });
  if (!response.ok) throw new Error("Impossible d'ajouter le contenu.");
  return await response.json();
}

export async function updateMovie(id, movie) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie)
  });
  if (!response.ok) throw new Error("Impossible de modifier le contenu.");
  return await response.json();
}

export async function deleteMovie(id) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Impossible de supprimer le contenu.");
}

export async function fetchComments() {
  const response = await fetch(`${BASE_URL}/comments`);
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Impossible de charger les commentaires.");
  const comments = await response.json();
  return Array.isArray(comments) ? comments : [];
}

export async function addMovieComment(movieId, comment) {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment)
  });
  if (!response.ok) throw new Error("Impossible d'ajouter le commentaire.");
  return await response.json();
}