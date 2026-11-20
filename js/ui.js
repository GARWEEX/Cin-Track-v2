import { isFavorite, toggleFavorite } from "./favorite.js";
import { addMovieComment } from "./api.js";

let currentMovie = null;
let commentAddedCallback = null;

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

export function createCard(movie) {
  let heartColor = "text-gray-400";
  if (isFavorite(movie.id)) {
    heartColor = "text-red-500";
  }

  const title = escapeHTML(movie.title || "Sans titre");
  const poster = escapeHTML(movie.poster || movie.image || "");

  return `
    <div class="movie-card relative bg-slate-900 border border-slate-800 rounded p-3 cursor-pointer hover:scale-105" data-id="${escapeHTML(movie.id)}">
      <button type="button" class="fav-btn absolute top-4 right-4 bg-slate-950 px-2 py-0.5 rounded text-lg ${heartColor}" data-id="${escapeHTML(movie.id)}">♥</button>
      <img src="${poster}" alt="Affiche de ${title}" class="w-full h-56 object-cover rounded mb-2">
      <h3 class="text-base font-bold text-white">${title}</h3>
      <p class="text-xs text-slate-400 mt-1">• Type : ${escapeHTML(movie.type || "")}</p>
      <p class="text-xs text-slate-400 mt-1">• ${escapeHTML(movie.releaseYear || "")} | ⭐ ${escapeHTML(movie.avgRating || "N/A")}</p>
    </div>`;
}

function showComments() {
  const commentsList = document.getElementById("commentsList");
  const commentsTitle = document.getElementById("commentsTitle");

  commentsTitle.textContent = `Commentaires (${currentMovie.comments.length})`;

  if (currentMovie.comments.length === 0) {
    commentsList.innerHTML = '<p class="text-slate-400 text-xs">Aucun commentaire pour le moment.</p>';
    return;
  }

  let html = "";

  for (let i = 0; i < currentMovie.comments.length; i++) {
    const comment = currentMovie.comments[i];
    let rating = Number(comment.rating) || 5;

    if (rating < 1) rating = 1;
    if (rating > 5) rating = 5;

    html += `
      <div class="bg-slate-950 p-2 rounded border border-slate-800 mb-2">
        <div class="flex justify-between gap-2 text-xs">
          <span class="font-bold text-white">${escapeHTML(comment.author || "Anonyme")}</span>
          <span class="text-yellow-400">${"★".repeat(rating)}</span>
        </div>
        <p class="text-slate-300 text-xs mt-1">${escapeHTML(comment.content || "")}</p>
      </div>`;
  }

  commentsList.innerHTML = html;
}

function updateRating() {
  let total = 0;

  for (let i = 0; i < currentMovie.comments.length; i++) {
    total += Number(currentMovie.comments[i].rating || 0);
  }

  if (currentMovie.comments.length > 0) {
    currentMovie.avgRating = (total / currentMovie.comments.length).toFixed(1);
  } else {
    currentMovie.avgRating = "N/A";
  }

  document.getElementById("modalRating").textContent = `(⭐ ${currentMovie.avgRating})`;
}

function showMovie(movie) {
  currentMovie = movie;

  if (!Array.isArray(movie.comments)) {
    movie.comments = [];
  }

  let extraInfo = "";

  if (movie.type === "movie") {
    extraInfo = `<p>• Durée : ${escapeHTML(movie.duration || "")} min</p>`;
  } else {
    let seasons = movie.seasons || "";
    if (Array.isArray(movie.seasons)) {
      seasons = movie.seasons.length;
    }
    extraInfo = `<p>• Saisons : ${escapeHTML(seasons)}</p>`;
  }

  const title = escapeHTML(movie.title || "Sans titre");

  document.getElementById("modalContent").innerHTML = `
    <div class="bg-slate-900 rounded p-2 text-sm space-y-1">
      <img src="${escapeHTML(movie.poster || movie.image || "")}" alt="Affiche de ${title}" class="w-full h-64 object-cover rounded mb-3">
      <h3 class="text-lg font-bold text-white">${title} <span id="modalRating" class="text-yellow-400 text-sm">(⭐ ${escapeHTML(movie.avgRating || "N/A")})</span></h3>
      <p class="pt-1 text-slate-300">• Description : ${escapeHTML(movie.description || "")}</p>
      <p class="text-slate-300">• Type : ${escapeHTML(movie.type || "")} | Année : ${escapeHTML(movie.releaseYear || "")}</p>
      ${extraInfo}
      <p class="text-slate-300">• Genres : ${escapeHTML(movie.genres || "")}</p>
      <p class="text-slate-300">• Réalisateurs : ${escapeHTML(movie.directors || "")}</p>
      <p class="text-slate-300">• Pays : ${escapeHTML(movie.productionCountries || "")}</p>
    </div>`;

  document.getElementById("commentForm").reset();
  document.getElementById("commentMsg").className = "text-xs hidden";
  showComments();

  document.getElementById("movieModal").classList.remove("hidden");
  document.getElementById("movieModal").classList.add("flex");
}

export function setupCommentForm(onCommentAdded) {
  commentAddedCallback = onCommentAdded;

  document.getElementById("commentForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!currentMovie) {
      return;
    }

    const author = document.getElementById("commentAuthor").value.trim();
    const content = document.getElementById("commentText").value.trim();
    const rating = Number(document.getElementById("commentRating").value);
    const message = document.getElementById("commentMsg");
    const submitButton = document.getElementById("commentSubmit");

    if (!author || !content) {
      message.textContent = "Veuillez remplir votre nom et votre commentaire.";
      message.className = "text-xs text-red-500 block";
      return;
    }

    submitButton.disabled = true;
    message.textContent = "Envoi en cours...";
    message.className = "text-xs text-slate-400 block";

    try {
      const comment = {
        movieId: String(currentMovie.id),
        author: author,
        content: content,
        rating: rating,
        createdAt: new Date().toISOString()
      };

      const savedComment = await addMovieComment(currentMovie.id, comment);
      currentMovie.comments.push(savedComment);

      updateRating();
      showComments();
      document.getElementById("commentForm").reset();

      message.textContent = "Commentaire ajouté !";
      message.className = "text-xs text-green-500 block";

      if (commentAddedCallback) {
        commentAddedCallback();
      }
    } catch (error) {
      message.textContent = "Erreur lors de l'envoi. Vérifiez la connexion et réessayez.";
      message.className = "text-xs text-red-500 block";
    }

    submitButton.disabled = false;
  });
}

export function renderMovies(movies, container) {
  if (!container) {
    return;
  }

  if (movies.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center text-slate-400 py-8">Aucun contenu trouvé.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < movies.length; i++) {
    html += createCard(movies[i]);
  }
  container.innerHTML = html;

  const favoriteButtons = container.querySelectorAll(".fav-btn");
  favoriteButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();

      const movie = movies.find(item => String(item.id) === button.dataset.id);
      if (!movie) {
        return;
      }

      toggleFavorite(movie);

      if (isFavorite(movie.id)) {
        button.classList.add("text-red-500");
        button.classList.remove("text-gray-400");
      } else {
        button.classList.add("text-gray-400");
        button.classList.remove("text-red-500");
      }
    });
  });

  const cards = container.querySelectorAll(".movie-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const movie = movies.find(item => String(item.id) === card.dataset.id);
      if (movie) {
        showMovie(movie);
      }
    });
  });
}
