import { fetchMovies, createMovie, updateMovie, deleteMovie } from "./api.js";
import { getFavorites, saveFavorites } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("movieForm");
  const formTitle = document.getElementById("formTitle");
  const submitButton = document.getElementById("submitBtn");
  const cancelButton = document.getElementById("cancelBtn");
  const adminList = document.getElementById("adminList");
  const statusMsg = document.getElementById("statusMsg");
  const posterInput = document.getElementById("poster");
  const posterPreview = document.getElementById("posterPreview");

  let movies = [];
  let editId = null;

  function getValue(id) {
    return document.getElementById(id).value.trim();
  }

  function showStatus(message, error = false) {
    statusMsg.textContent = message;

    if (error) {
      statusMsg.className = "mb-4 p-3 rounded text-sm bg-red-900 text-red-200";
    } else {
      statusMsg.className = "mb-4 p-3 rounded text-sm bg-green-900 text-green-200";
    }
  }

  function resetForm() {
    form.reset();
    editId = null;
    formTitle.textContent = "Ajouter un contenu";
    submitButton.textContent = "Ajouter";
    cancelButton.classList.add("hidden");
    posterPreview.removeAttribute("src");
    posterPreview.classList.add("hidden");
  }

  function fillForm(movie) {
    const fields = [
      "title", "type", "releaseYear", "duration", "genres",
      "directors", "productionCountries", "description"
    ];

    for (let i = 0; i < fields.length; i++) {
      document.getElementById(fields[i]).value = movie[fields[i]] || "";
    }

    if (Array.isArray(movie.seasons)) {
      document.getElementById("seasons").value = movie.seasons.length;
    } else {
      document.getElementById("seasons").value = movie.seasons || "";
    }

    posterInput.value = movie.poster || movie.image || "";
    posterPreview.src = posterInput.value;
    posterPreview.classList.toggle("hidden", !posterInput.value);

    editId = movie.id;
    formTitle.textContent = "Modifier le contenu";
    submitButton.textContent = "Enregistrer";
    cancelButton.classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderTable() {
    let html = "";

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const poster = movie.poster || movie.image || "";
      const title = movie.title || "Sans titre";

      html += `
        <tr>
          <td class="py-2 pr-3"><img src="${poster}" alt="Affiche de ${title}" class="w-10 h-14 object-cover rounded"></td>
          <td class="py-2 pr-3 font-bold">${title}</td>
          <td class="py-2 pr-3 text-slate-400">${movie.type || ""}</td>
          <td class="py-2 pr-3 text-slate-400">${movie.releaseYear || ""}</td>
          <td class="py-2 text-right whitespace-nowrap">
            <button type="button" class="edit-btn bg-blue-600 px-2 py-1 rounded text-xs" data-id="${movie.id}">Modifier</button>
            <button type="button" class="delete-btn bg-red-600 px-2 py-1 rounded text-xs" data-id="${movie.id}">Supprimer</button>
          </td>
        </tr>`;
    }

    if (movies.length === 0) {
      html = '<tr><td colspan="5" class="py-4 text-center text-slate-400">Aucun contenu enregistré.</td></tr>';
    }

    adminList.innerHTML = html;

    adminList.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", () => {
        const movie = movies.find(item => String(item.id) === button.dataset.id);
        if (movie) {
          fillForm(movie);
        }
      });
    });

    adminList.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async () => {
        if (!confirm("Voulez-vous vraiment supprimer ce contenu ?")) {
          return;
        }

        button.disabled = true;

        try {
          await deleteMovie(button.dataset.id);

          movies = movies.filter(movie => String(movie.id) !== button.dataset.id);
          const favorites = getFavorites().filter(movie => String(movie.id) !== button.dataset.id);
          saveFavorites(favorites);

          if (String(editId) === button.dataset.id) {
            resetForm();
          }

          renderTable();
          showStatus("Contenu supprimé !");
        } catch (error) {
          showStatus("Erreur lors de la suppression. Vérifiez la connexion.", true);
          button.disabled = false;
        }
      });
    });
  }

  posterInput.addEventListener("input", () => {
    const poster = posterInput.value.trim();

    if (poster) {
      posterPreview.src = poster;
      posterPreview.classList.remove("hidden");
    } else {
      posterPreview.removeAttribute("src");
      posterPreview.classList.add("hidden");
    }
  });

  posterPreview.addEventListener("error", () => {
    posterPreview.classList.add("hidden");
  });

  cancelButton.addEventListener("click", resetForm);

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const title = getValue("title");
    const type = getValue("type");
    const year = Number(getValue("releaseYear"));
    const poster = getValue("poster");

    if (!title || !poster || year < 1888 || year > 2100 || !Number.isInteger(year)) {
      showStatus("Veuillez vérifier le titre, l'année et l'URL de l'affiche.", true);
      return;
    }

    if (!poster.startsWith("http://") && !poster.startsWith("https://")) {
      showStatus("L'URL de l'affiche doit commencer par http:// ou https://.", true);
      return;
    }

    const movie = {
      title: title,
      type: type,
      releaseYear: year,
      duration: type === "movie" ? Number(getValue("duration")) || 0 : 0,
      seasons: type === "series" ? Number(getValue("seasons")) || 0 : 0,
      genres: getValue("genres"),
      directors: getValue("directors"),
      productionCountries: getValue("productionCountries"),
      poster: poster,
      description: getValue("description")
    };

    submitButton.disabled = true;

    try {
      if (editId === null) {
        const newMovie = await createMovie(movie);
        movies.push(newMovie);
        showStatus("Contenu ajouté !");
      } else {
        const updatedMovie = await updateMovie(editId, movie);

        for (let i = 0; i < movies.length; i++) {
          if (String(movies[i].id) === String(editId)) {
            movies[i] = updatedMovie;
            break;
          }
        }

        showStatus("Contenu modifié !");
      }

      resetForm();
      renderTable();
    } catch (error) {
      showStatus("Erreur lors de l'enregistrement. Vérifiez la connexion.", true);
    }

    submitButton.disabled = false;
  });

  async function init() {
    adminList.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-400">Chargement...</td></tr>';

    try {
      movies = await fetchMovies();
      renderTable();
    } catch (error) {
      adminList.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-red-500">Impossible de charger les données. Vérifiez votre connexion puis réessayez.</td></tr>';
    }
  }

  init();
});
