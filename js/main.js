import { fetchMovies, fetchComments } from "./api.js";
import { renderMovies, setupCommentForm } from "./ui.js";
import { searchMatch, FilterMatch } from "./filter.js";
import { displayFavorites } from "./favorite.js";

document.addEventListener("DOMContentLoaded", async () => {
  const moviesGrid = document.getElementById("moviesGrid");
  const searchInput = document.getElementById("searchFilm");
  const typeFilter = document.getElementById("genreFilter");
  const pagination = document.getElementById("pagination");
  const modal = document.getElementById("movieModal");
  const closeModalButton = document.getElementById("closeModal");

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  closeModalButton.addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  moviesGrid.innerHTML = '<p class="col-span-full text-center text-slate-400 py-8">Chargement du catalogue...</p>';

  try {
    const movies = await fetchMovies();
    const allComments = await fetchComments();

    for (let i = 0; i < movies.length; i++) {
      movies[i].comments = allComments.filter(comment => {
        return String(comment.movieId) === String(movies[i].id);
      });

      let total = 0;
      for (let j = 0; j < movies[i].comments.length; j++) {
        total += Number(movies[i].comments[j].rating || 0);
      }

      if (movies[i].comments.length > 0) {
        movies[i].avgRating = (total / movies[i].comments.length).toFixed(1);
      } else {
        movies[i].avgRating = "N/A";
      }
    }

    let currentPage = 1;

    function showPage(list, page) {
      currentPage = page;

      const start = (page - 1) * 8;
      const pageMovies = list.slice(start, start + 8);
      renderMovies(pageMovies, moviesGrid);

      const totalPages = Math.ceil(list.length / 8);
      pagination.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        let color = "bg-slate-800 hover:bg-slate-700";
        if (i === page) {
          color = "bg-red-600";
        }

        pagination.innerHTML += `
          <button type="button" data-page="${i}" class="px-3 py-1 rounded ${color}">
            ${i}
          </button>`;
      }

      const buttons = pagination.querySelectorAll("button");
      buttons.forEach(button => {
        button.addEventListener("click", () => {
          showPage(list, Number(button.dataset.page));
        });
      });
    }

    function updateCatalog(page = 1) {
      const searchedMovies = searchMatch(movies, searchInput.value);
      const filteredMovies = FilterMatch(searchedMovies, typeFilter.value);
      showPage(filteredMovies, page);
    }

    setupCommentForm(() => updateCatalog(currentPage));
    displayFavorites();
    updateCatalog(1);

    searchInput.addEventListener("input", () => updateCatalog(1));
    typeFilter.addEventListener("change", () => updateCatalog(1));
  } catch (error) {
    moviesGrid.innerHTML = '<p class="col-span-full text-center text-red-500 py-8">Impossible de charger les données. Vérifiez votre connexion puis réessayez.</p>';
  }
});
