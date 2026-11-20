CinéTrack

Application web complète de catalogue de films et de séries développée en JavaScript moderne (ES6+) et connectée à une API REST MockAPI. Elle permet aux utilisateurs d'explorer les contenus, de laisser des avis notés et de gérer leurs favoris, tout en offrant aux administrateurs une interface dédiée pour gérer le catalogue (CRUD).

Fonctionnalités

Catalogue Utilisateur (index.html)

Affichage dynamique : Présentation des films et séries sous forme de cards (affiche, titre, type, année de sortie et note moyenne).

Recherche et filtrage : Recherche instantanée par titre et filtrage par type (Tous, Films, Séries).

Pagination : Navigation fluide avec 8 contenus affichés par page.

Détails, Commentaires et Notation (Modal) :

Consultation des informations détaillées (durée pour un film, nombre de saisons pour une série, genres, réalisateurs, pays et description).

Affichage des commentaires publiés par les utilisateurs.

Ajout d'un avis avec une note de 1 à 5 étoiles et mise à jour automatique de la note moyenne.

Gestion des favoris :

Ajout et suppression via le bouton cœur sans ouvrir la modale (stopPropagation).

Sidebar récapitulative avec compteur par catégorie (Films / Séries) et sauvegarde dans le localStorage.

Espace Administration (admin.html)

Consultation : Tableau listant l'ensemble des films et séries enregistrés sur l'API.

Ajout (POST) : Formulaire complet avec validation des champs et prévisualisation de l'affiche en temps réel.

Modification (PUT) : Pré-remplissage automatique du formulaire pour éditer un contenu existant.

Suppression (DELETE) : Suppression d'un film ou d'une série après boîte de dialogue de confirmation, avec synchronisation des favoris locaux.

États de l'interface : Gestion des indicateurs de chargement (Chargement...) et des notifications de succès ou d'erreur.

Technologies et concepts utilisés

HTML5 & Tailwind CSS (interface responsive mobile, tablette et desktop)

JavaScript ES6+ :

Architecture modulaire (import / export)

Programmation asynchrone (async / await, Promise.all())

Fetch API avec méthodes HTTP (GET, POST, PUT, DELETE) et vérification de response.ok

Gestion des erreurs avec try / catch

Manipulation sécurisée du DOM et protection contre les injections HTML

Persistance locale avec localStorage

Structure du projet

Cin-Track/
├── img/
│   ├── full-heart.svg
│   └── heart.svg
├── js/
│   ├── admin.js      # Logique CRUD, validation et prévisualisation pour l'administration
│   ├── api.js        # Requêtes Fetch vers MockAPI (movies et comments)
│   ├── favorite.js   # Gestion des favoris et comptage par type
│   ├── filter.js     # Fonctions de recherche et de filtrage
│   ├── main.js       # Initialisation du catalogue, Promise.all et pagination
│   ├── storage.js    # Lecture et sauvegarde sécurisée dans le localStorage
│   └── ui.js         # Génération des cards, modale, commentaires et calcul des notes
├── index.html        # Page principale du catalogue
├── admin.html        # Page d'administration des contenus
└── README.md         # Documentation du projet


Configuration MockAPI

L'application communique avec deux ressources REST configurées sur MockAPI.io :

/movies : title, type (movie ou series), releaseYear, duration, seasons, genres, directors, productionCountries, poster, description

/comments : movieId, author, content, rating (1 à 5), createdAt

Installation et lancement

Cloner le dépôt :

git clone https://github.com/GARWEEX/Cin-Track-v2.git
cd Cin-Track


Ouvrir le projet dans VS Code.

Démarrer index.html à l'aide de l'extension Live Server (nécessaire pour le chargement des modules JavaScript ES6).