import { getFavorites, saveFavorites } from "./storage.js";

let favorites = getFavorites();

function escapeHTML(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  return String(value || "").replace(/[&<>"']/g, character => characters[character]);
}

export function isFavorite(id) {
  for (let i = 0; i < favorites.length; i++) {
    if (String(favorites[i].id) === String(id)) {
      return true;
    }
  }
  return false;
}

export function toggleFavorite(movie) {
  if (isFavorite(movie.id)) {
    favorites = favorites.filter(item => String(item.id) !== String(movie.id));
  } else {
    favorites.push(movie);
  }

  saveFavorites(favorites);
  displayFavorites();
}

export function displayFavorites() {
  const container = document.getElementById("favoritesList");

  if (!container) {
    return;
  }

  let movieCount = 0;
  let seriesCount = 0;
  let html = "";

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].type === "movie") {
      movieCount++;
    }
    if (favorites[i].type === "series") {
      seriesCount++;
    }
  }

  if (favorites.length === 0) {
    container.innerHTML = "<p>Aucun favori ajouté.</p>";
    return;
  }

  html = `
    <p class="text-slate-300 mb-3 pb-2 border-b border-slate-800">
      Films : <span class="text-white font-bold">${movieCount}</span> |
      Séries : <span class="text-white font-bold">${seriesCount}</span>
    </p>`;

  for (let i = 0; i < favorites.length; i++) {
    const movie = favorites[i];
    const title = escapeHTML(movie.title || "Sans titre");
    const poster = escapeHTML(movie.poster || movie.image || "");
    const year = escapeHTML(movie.releaseYear || "");
    const id = escapeHTML(movie.id);

    html += `
      <div class="flex items-center justify-between bg-slate-800 p-2 rounded mb-2 gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <img src="${poster}" alt="Affiche de ${title}" class="w-10 h-14 object-cover rounded">
          <div class="min-w-0">
            <p class="text-white text-sm font-bold">${title}</p>
            <span class="text-xs text-slate-400">${year}</span>
          </div>
        </div>
        <button type="button" class="remove-fav text-red-500 font-bold text-lg px-2" data-id="${id}">&times;</button>
      </div>`;
  }

  container.innerHTML = html;

  const buttons = container.querySelectorAll(".remove-fav");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      favorites = favorites.filter(movie => String(movie.id) !== String(id));

      saveFavorites(favorites);
      displayFavorites();

      const hearts = document.querySelectorAll(`.fav-btn[data-id="${id}"]`);
      hearts.forEach(heart => {
        heart.classList.remove("text-red-500");
        heart.classList.add("text-gray-400");
      });
    });
  });
}
