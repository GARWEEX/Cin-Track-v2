export function searchMatch(movies, searchInput) {
  const text = searchInput.toLowerCase().trim();

  return movies.filter(movie => {
    return (movie.title || "").toLowerCase().trim().includes(text);
  });
}

export function FilterMatch(movies, filterType) {
  if (filterType === "all") {
    return movies;
  }

  return movies.filter(movie => movie.type === filterType);
}
