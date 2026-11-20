const BASE_URL = "https://6afd9c422a9c141d36b8bd63.mockapi.io/api/v1";

export async function fetchMovies() {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) {
    throw new Error("Erreur de chargement");
  }
  return await response.json();
}

export async function createMovie(movie) {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie)
  });

  if (!response.ok) {
    throw new Error("Erreur d'ajout");
  }
  return await response.json();
}

export async function updateMovie(id, movie) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie)
  });

  if (!response.ok) {
    throw new Error("Erreur de modification");
  }
  return await response.json();
}

export async function deleteMovie(id) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Erreur de suppression");
  }
}

export async function fetchComments() {
  const response = await fetch(`${BASE_URL}/comments`);

  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new Error("Erreur de chargement des commentaires");
  }

  const comments = await response.json();
  if (Array.isArray(comments)) {
    return comments;
  }
  return [];
}

export async function addMovieComment(movieId, comment) {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment)
  });

  if (!response.ok) {
    throw new Error("Erreur d'ajout du commentaire");
  }
  return await response.json();
}
