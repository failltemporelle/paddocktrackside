# Audit UX/UI

Périmètre : site Nuxt 3 (SPA, `ssr: false`), Tailwind + daisyUI, données Jolpica/Ergast. Audit réalisé par lecture du code uniquement (aucun rendu visuel). Les points incertains sont marqués « à vérifier visuellement ». Le dossier `.claude` est exclu.

## Résumé

État général : identité visuelle sombre forte et cohérente sur la page d'accueil, /stats, /records et /drivers/[id]. Les pages historiques (/standings, /races, /compare, /account, /login, /chat) utilisent un autre style et une règle CSS globale rend leurs titres invisibles. La navigation est incomplète et plusieurs liens mènent à des 404.
Problèmes les plus importants :
1. Titres `h1`-`h6` en `#0B0B0F` sur fond `#0B0B0F` (`assets/css/main.css:17-24`) : titres illisibles sur 6 pages.
2. Liens morts (`/about`, `/drivers/:id/races/:year`, `/drivers/:id/qualifying/:year`), pas de page 404, et fonctionnalités factices (formulaire de contact, comparateur à données aléatoires, connexion sans effet).
3. Éléments interactifs non accessibles au clavier (onglets `<a>` sans `href`, cartes cliquables `<div>`) et contrastes insuffisants (blanc sur `#FF1801` = 3,9:1, `gray-500` = 4,1:1).

## Cartographie du site

### Pages existantes (dossier `pages/`)

| Route | Fichier | Accessible depuis le menu ? |
|---|---|---|
| `/` | `pages/index.vue` (Hero, Dashboard, Features, About, Contact) | Oui (logo) |
| `/standings` | `pages/standings.vue` | Oui |
| `/races` | `pages/races/index.vue` | Oui |
| `/races/[year]/[round]` | `pages/races/[year]/[round].vue` | Via carte de course passée uniquement |
| `/stats` | `pages/stats.vue` | Oui |
| `/records` | `pages/records.vue` | Oui |
| `/drivers/[id]` | `pages/drivers/[id].vue` | Via Top 5 (accueil) et cartes pilotes (/standings) |
| `/dashboard` | `pages/dashboard.vue` | **Non (orpheline)** |
| `/compare/drivers` | `pages/compare/drivers.vue` | **Non (orpheline)** |
| `/chat` | `pages/chat/index.vue` | **Non (orpheline)** |
| `/login` | `pages/login.vue` | **Non (seulement depuis /chat et /account, eux-mêmes orphelins)** |
| `/account` | `pages/account.vue` | **Non (orpheline)** |

### Routes référencées mais inexistantes (404)
- `/about` : `components/home/About.vue:34` (bouton « EN SAVOIR PLUS »).
- `/drivers/:id/races/:year` et `/drivers/:id/qualifying/:year` : `pages/drivers/[id].vue:244-245` (« Résultats 20XX », « Qualifs 20XX »).
- Pas de `error.vue` ni de page 404 dédiée : la page d'erreur Nuxt par défaut (en anglais, hors charte) s'affiche.
- Assets référencés mais absents de `public/` (seuls `favicon.ico`, `images/driver-placeholder.jpg`, `robots.txt` existent) : `/apple-touch-icon.png` (`nuxt.config.ts:34`), `/images/og-image.jpg` (`composables/useSeo.ts:7`), `/images/circuit-placeholder.png` (`composables/useCircuitImages.ts:36`), `/images/chat-placeholder.png`, `/images/qualifying.png`, `/images/race.png` (`pages/chat/index.vue`).

### Composants
- Navigation/shell : `app.vue` (navbar sticky, menu burger mobile, footer). Pas de `layouts/`, pas de `error.vue`.
- Accueil : `components/home/{Hero,Dashboard,Features,About,Contact}.vue`.
- Classements : `DriversGrid`, `DriverCard`, `ConstructorsGrid`, `ConstructorCard`, `YearSelector`.
- Course : `race/{RaceHero,RaceInfo,RaceResults}`, `RacePodium`, `RaceResult`, `QualifyingResult`, `SprintResult`, `RaceCountdown`, `CircuitLayout`, `RaceCard`.
- Graphiques : `BarChart`, `PointsChart`, `DoughnutChart`, `SeasonProgressTable`.
- Chat : `chat/ChatWindow`, `chat/RoomCard`.
- Composants morts (jamais utilisés) : `Button.vue`, `Card.vue`, `StandingsTable.vue`, `ProgressBar.vue`, `SprintShootoutResult.vue`, `DriverComparisonCard` (utilisé seulement par la page orpheline /compare).

### Système de style en place
- Tailwind (`tailwind.config.ts`) + daisyUI avec un thème unique `f1theme` (`data-theme` posé dans `app.vue:2`). Couleurs custom : `f1-red #FF1801`, `f1-black #0B0B0F`, `f1-dark-gray #15151E`, `f1-gray #38383F`, `f1-silver`, `f1-light`.
- Polices : Inter (400-700) et Montserrat (600-800) chargées par `@import` Google Fonts dans `assets/css/main.css:1`.
- CSS globaux : `assets/css/main.css` (conçu pour un thème CLAIR : `body bg-f1-light text-f1-black`, `.card` blanc) et `assets/css/3d-card.css` (effet de tilt). L'application est en réalité sombre : incohérence de base, source de plusieurs bugs ci-dessous.

### Parcours actuel
- Menu (desktop et mobile) : Classements, Courses, Statistiques, Records. Footer : mêmes 4 liens. Aucun accès à Pilotes, Comparateur, Chat, Compte, Connexion, Contact, À propos.
- Accueil → Top 5 pilotes → `/drivers/:id` ; Accueil → « Voir le calendrier » → `/races` ; Accueil → « Tout voir » → `/standings`.
- `/standings` → carte pilote → `/drivers/:id` (les cartes écuries ne mènent nulle part).
- `/races` → carte d'une course passée → `/races/:year/:round` (les courses à venir ne sont pas cliquables). La page de résultats n'a aucun lien de retour hors état d'erreur.
- Profondeur : tout contenu est à 2 clics maximum de l'accueil (objectif de 3 clics respecté), mais les pages orphelines sont à l'infini.

---

## Problèmes identifiés

### Critique (bloque l'utilisation ou l'accessibilité)

- [C-01] Titres invisibles : couleur de titre sombre sur fond sombre
  - Où : `assets/css/main.css:17-24` (`h1..h6 { @apply ... text-f1-black }`), et `main.css:13-15` (`body bg-f1-light text-f1-black`). Pages touchées : `pages/standings.vue:3` (h1), `pages/races/index.vue:4` (h1), `pages/compare/drivers.vue:3` (h1) et `:56,:84,:103` (`h2.card-title`), `pages/account.vue:4` (h1) et `:79` (h2), `pages/chat/index.vue:3` (h1) et `:6` (h2), `pages/login.vue:5` (`h2.card-title`), `components/race/RaceResults.vue:6` (`h2.card-title` « Podium »).
  - Problème : ces titres n'ont pas de classe de couleur et héritent de `#0B0B0F`, identique au fond `f1-black` de `app.vue:2` et de `base-100`. Le titre principal des deux pages les plus utilisées (Classements et Courses) est invisible. Contraste ~1:1.
  - Correctif : dans `main.css`, supprimer `text-f1-black` de la règle `h1..h6` (les titres héritent alors de `text-white` posé sur `app.vue`) ; remplacer `body { @apply bg-f1-light ... text-f1-black }` par `bg-f1-black text-white` (évite aussi un flash clair en overscroll). Supprimer `.section-title text-f1-black` (`main.css:85`) ou passer en `text-white`. Vérifier : chaque `h1`/`h2` des 6 pages listées est lisible, contraste ≥ 4,5:1.

- [C-02] Liens morts et absence de page 404
  - Où : `components/home/About.vue:34` (`/about`), `pages/drivers/[id].vue:244-245`, absence de `error.vue`.
  - Problème : trois liens conduisent à une page inexistante ; l'utilisateur tombe sur l'écran d'erreur Nuxt par défaut, sans lien de retour cohérent.
  - Correctif : (a) `About.vue` : supprimer le bouton « EN SAVOIR PLUS » (la section est déjà le contenu « à propos ») ou créer `pages/about.vue`. (b) `drivers/[id].vue` : retirer les deux boutons « Résultats/Qualifs » tant que les pages n'existent pas ; garder « Profil officiel ». (c) Créer `error.vue` à la racine, dans la charte (fond `f1-black`, `h1` « Page introuvable », texte français, boutons « Retour à l'accueil » et « Voir le calendrier », `clearError({ redirect: '/' })`). Vérifier : plus aucun `NuxtLink` ne pointe vers une route absente de la table du § Cartographie ; une URL inconnue affiche la page 404 française.

- [C-03] Formulaire de contact factice qui efface la saisie sans rien envoyer
  - Où : `components/home/Contact.vue:57-62` (`handleSubmit` : `console.log` puis vidage des champs), bouton `:40-45`.
  - Problème : l'utilisateur clique « ENVOYER LE MESSAGE », les champs se vident et rien n'indique le résultat ; le message est perdu. Aucun état de chargement, de succès ni d'erreur.
  - Correctif : soit brancher un envoi réel (endpoint Vercel/Formspree/Supabase) avec états `envoi en cours` (bouton désactivé + spinner), `succès` (message « Merci, votre message a bien été envoyé. » dans un `role="status"`) et `erreur` (message « Envoi impossible. Réessayez ou écrivez-nous à ... » dans un `role="alert"`, saisie conservée) ; soit retirer la section `HomeContact` de `pages/index.vue:7` tant que l'envoi n'est pas implémenté. Ne jamais vider le formulaire avant confirmation du succès.

- [C-04] Comparateur de pilotes : données inventées présentées comme réelles
  - Où : `pages/compare/drivers.vue:171-180` (attente simulée de 1 s, `Math.random()` pour les points par course, libellés « Course 1..10 »), `:160-162` (« N/A » codés en dur).
  - Problème : si un utilisateur atteint la page, il voit un graphique aléatoire différent à chaque sélection. Trompeur. Page en plus orpheline (voir M-01).
  - Correctif : ne pas exposer cette page (la retirer de la navigation, l'exclure du build ou afficher « Bientôt disponible ») jusqu'à branchement sur `fetchSeasonResults`. Supprimer le `setTimeout` et `Math.random()`. Couleur de la 2e série `#15151E` (`:70-71`) invisible sur fond sombre : utiliser une couleur claire (voir Système de design).

- [C-05] Authentification et chat présentés mais non fonctionnels
  - Où : `composables/useAuth.ts:3-11` (stubs vides, `user` toujours `null`), `middleware/auth.ts:1-2` (désactivé), `pages/login.vue:71-86` (le formulaire « réussit » et redirige vers `/`), `pages/account.vue:101-103` (`updateProfile` vide), `pages/chat/index.vue:5-8` (invite « Connectez-vous » impossible à satisfaire), `nuxt.config.ts:7` (commentaire Firebase obsolète).
  - Problème : boucle sans issue (/chat → /login → connexion « réussie » → aucun utilisateur → /chat redemande la connexion) ; « Enregistrer » ne fait rien.
  - Correctif : décider avant correction : (1) implémenter l'auth (Supabase est déjà configuré dans `nuxt.config.ts`) ou (2) masquer les 3 pages (ne pas les lier, y ajouter `definePageMeta({ robots: false })` ou les supprimer). Tant que (1) n'est pas fait, `login` ne doit pas simuler un succès.

- [C-06] Éléments interactifs inaccessibles au clavier et aux lecteurs d'écran
  - Où : onglets `<a class="tab" @click>` sans `href` : `pages/standings.vue:10-23`, `components/race/RaceResults.vue:15-36`, `pages/drivers/[id].vue:163-164` ; carte de course `<div @click>` : `components/RaceCard.vue:2-6` ; `components/chat/RoomCard.vue:2-5` ; suggestions Records `pages/records.vue:27-35` (boutons sans `type`, pas de navigation ↑/↓).
  - Problème : impossible de focaliser ni d'activer ces éléments au clavier (pas de Tab, pas d'Entrée/Espace) ; aucun rôle exposé. Les résultats d'une course ne sont donc pas accessibles sans souris.
  - Correctif : onglets → `<button type="button" role="tab" :aria-selected="..." >` dans un conteneur `role="tablist"` (ou `<div role="tablist" class="tabs">`) avec panneaux `role="tabpanel"`. `RaceCard` → enrober le contenu dans `<NuxtLink :to="/races/{season}/{round}">` pour les courses passées (les courses à venir : `<div>` non interactif, sans `cursor-pointer` ni `hover:-translate-y-1`, ce qui règle aussi le faux affordance). `RoomCard` → `<button type="button">`. Records : ajouter `type="button"` et implémenter le pattern combobox (`role="combobox"`, `aria-expanded`, `aria-controls`, `role="listbox"`/`option`, flèches ↑↓, Échap). Vérifier : tout parcours réalisable au clavier seul.

### Majeur (dégrade nettement l'expérience)

- [M-01] Navigation incomplète : pages orphelines et aucun accès aux fonctions clés
  - Où : `app.vue:35-38` (menu mobile), `:51-54` (menu desktop), `:84-87` (footer), `:59-63` (zone droite vide `<div class="w-8">`).
  - Problème : /dashboard, /compare/drivers, /chat, /login, /account n'ont aucun lien. Le footer duplique le menu sans ajouter de valeur (pas de Contact, À propos, source des données, mentions). `pages/dashboard.vue` fait doublon avec `/stats` (deux « dashboards » aux titres proches, voir M-14).
  - Correctif : voir « Proposition de navigation cible ». Actions minimales : décider du sort de chaque orpheline (supprimer, fusionner ou lier) ; footer : ajouter colonnes « Explorer » / « Le site » (Contact via `/#contact`, Sources des données, mentions) ; supprimer la `div.w-8` vide (`app.vue:59-63`) et le commentaire « Theme toggle removed » (`:60-61`).

- [M-02] Année codée en dur ou incohérente entre titre et données
  - Où : `pages/standings.vue:3` (titre `Classements F1 {{ currentYear }}` alors que les données suivent `selectedYear`), `components/home/Hero.vue:19` (« Saison 2025 en direct ») et `:47` (« CALENDRIER 2025 ») alors que la page /races ouvre l'année courante (`races/index.vue:35`, 2026 à la date de l'audit).
  - Problème : le titre affiche 2026 quand on consulte 1998 ; le bouton d'accueil promet 2025 et ouvre 2026. Information fausse.
  - Correctif : `standings.vue:3` → `{{ selectedYear }}` ; `Hero.vue` : utiliser `new Date().getFullYear()` (comme `Dashboard.vue:216`) ou retirer l'année du libellé (« CALENDRIER »). Supprimer « en direct » si aucune actualisation live n'existe (à vérifier : aucune mise à jour périodique dans le code).

- [M-03] Contexte perdu : année et onglet absents de l'URL, pas de retour depuis une course
  - Où : `pages/races/index.vue:35,52-55`, `pages/standings.vue:52-55`, `pages/stats.vue:250`, `components/race/*` (aucun lien de retour), `pages/races/[year]/[round].vue`.
  - Problème : choisir 2019, ouvrir une course puis « Précédent » ramène à l'année courante. L'onglet Pilotes/Constructeurs est aussi perdu. La page de résultats n'a pas de fil d'Ariane ni de lien « Retour au calendrier » (seulement dans l'état « non trouvée »).
  - Correctif : synchroniser l'année (et l'onglet) avec `route.query` (`?year=2019&tab=constructors`) via `useRoute`/`router.replace`. Sur `/races/[year]/[round]`, ajouter en tête un fil d'Ariane `Accueil > Courses {year} > {raceName}` (lien vers `/races?year={year}`) ; sur `/drivers/[id]`, le lien de retour existe (`:38`) mais renvoie toujours vers /standings : utiliser `router.back()` avec repli sur `/standings`.

- [M-04] Trois « coquilles » de page différentes, deux styles de titre
  - Où : `standings.vue:2-3`, `races/index.vue:2-9`, `compare/drivers.vue:2-3`, `account.vue:2-4`, `chat/index.vue:2-3` (`container mx-auto p-4`, h1 `text-3xl font-bold`) ; `stats.vue:2-16` (`p-4 md:p-6`, h1 display italique + trait rouge) ; `records.vue:2` et `drivers/[id].vue:2` (`.page-container`) ; `races/[year]/[round].vue:2` et `dashboard.vue:2` (`min-h-screen bg-f1-black`, `max-w-7xl`).
  - Problème : le `<main>` de `app.vue:68` est déjà un `container mx-auto px-4 py-6`, donc chaque page ré-empile un conteneur et un padding (double gouttière, largeurs différentes d'une page à l'autre). Les pages Classements/Courses ressemblent à un gabarit non stylé, tandis que Stats/Records ont l'identité de la marque. `min-h-screen` imbriqué crée un défilement inutile (`dashboard.vue:2`, `[round].vue:2`).
  - Correctif : créer un composant `PageHeader` (h1 `font-display italic font-bold text-3xl md:text-5xl text-white`, sous-titre `text-gray-400 text-sm md:text-base`, trait d'accent) et l'utiliser sur toutes les pages. Retirer les conteneurs et paddings de niveau page (`container mx-auto p-4`, `page-container`, `min-h-screen`) : laisser `app.vue` gérer la largeur (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`). Pour les pages qui ont besoin de sections pleine largeur (accueil, page course), sortir de `<main class="container">` (voir M-05).

- [M-05] Sections pleine largeur de l'accueil et hero de course enfermés dans un conteneur
  - Où : `app.vue:68` (`main.container`), `components/home/*` (chaque section a `bg-f1-black`/`bg-f1-dark-gray` et son propre `container px-6`), `components/race/RaceHero.vue:2` (`h-[60vh] min-h-[500px] w-full`) inséré dans `pages/races/[year]/[round].vue:9` ; `-mt-20` `:19`.
  - Problème : les bandes de fond (`About.vue:2` `bg-f1-dark-gray`) ne vont pas bord à bord, elles forment un rectangle limité par `container` ; les conteneurs sont imbriqués (`container` dans `container`). Le hero de course n'est pas full-bleed et le contenu remonte de 80 px dessus (`-mt-20`) alors que le bloc de détails du hero a un `pb-16` (64 px) : chevauchement possible à vérifier visuellement.
  - Correctif : retirer `container px-4 py-6` de `<main>` et laisser chaque page/section définir sa largeur (composant `Section`/`PageContainer`). Sur la page course, retirer `-mt-20` ou porter le `pb` du hero à `pb-28`.

- [M-06] Hiérarchie de titres incorrecte
  - Où : `components/DriverCard.vue:70-71` (h2 prénom puis h1 nom, **un h1 par carte**, ~20 h1 sur /standings en plus du h1 de page), `components/ConstructorCard.vue:79` (h1 par carte), `pages/drivers/[id].vue:54-55` (h2 prénom avant le h1), `components/race/RaceHero.vue:33` (nom du circuit en h2 juste après le h1, sous-titre non sémantique), `components/RaceCard.vue:14` (h2 sans h1 parent cohérent, acceptable) mais sans niveau intermédiaire, `pages/login.vue:5` (aucun h1), `pages/dashboard.vue:7` (h1 en anglais « F1 Dashboard »).
  - Problème : plusieurs h1 par page et ordre h2→h1 ; la navigation par titres des lecteurs d'écran est inutilisable.
  - Correctif : un seul `h1` par page. Cartes : `h3` pour le nom (sous le h1 de la page), prénom en `<span>`. `drivers/[id]` : `<h1>` contenant `<span>prénom</span> <span>NOM</span>`. `RaceHero` : nom du circuit en `<p>`. `login.vue` : `h1`. Respecter h1 > h2 > h3 sans saut.

- [M-07] Contrastes sous WCAG AA (calculés à partir des valeurs du code)
  - Où et valeurs :
    - Texte blanc sur `bg-f1-red` (#FF1801) ≈ 3,9:1 (< 4,5:1) : bouton `Hero.vue:34` (16 px gras), badge « À venir » `RaceCard.vue:21` (12 px), cartes `DriverCard.vue:48` / `ConstructorCard.vue:57` (`bg-f1-red/80` encore plus faible), bouton `Contact.vue:42`, `btn-primary` global.
    - `text-gray-500` (#6B7280) sur `f1-black`/`f1-dark-gray` ≈ 4,0-4,1:1 : libellés `text-xs` (`Dashboard.vue:63,67,107,111,150,189`, `RaceCard.vue:39,43`, `RaceInfo.vue:31…`, `stats.vue:31`), pied de page `app.vue:93` (12 px).
    - `text-white/40` ≈ 3,8:1 et `text-white/30` : `records.vue:34,76,96`, `drivers/[id].vue:85,96,106,115,148-152,215…`.
    - Placeholders `placeholder-gray-600` sur `bg-black/30` (`Contact.vue:25,35`) ≈ 2,7:1 ; `placeholder:text-white/30` (`records.vue:18`).
    - `text-zinc-500` sur `bg-f1-gray` (#38383F) ≈ 2,4:1 (`dashboard.vue:12,47,398,427`).
    - Rang « Terminé » `text-gray-400 sur bg-white/10` acceptable (à vérifier visuellement).
  - Correctif : (1) définir un rouge « action » plus sombre pour les fonds avec texte blanc : `f1-red` #E10600 (≈ 5,0:1, déjà utilisé dans `theme-color` de `nuxt.config.ts:30`) et le rouge vif #FF1801 uniquement pour texte/accents sur fond sombre (≈ 5,0:1 sur f1-black). (2) Remplacer `text-gray-500` et `text-white/40` par `text-gray-400` (#9CA3AF ≈ 7:1) ; réserver `text-white/50` (≈ 5:1) au minimum. (3) Placeholders `text-gray-400`. (4) `dashboard.vue` : `text-zinc-300` pour le secondaire sur `f1-gray`.

- [M-08] Focus visible absent ou supprimé, pas de lien d'évitement
  - Où : `records.vue:18` (`focus:outline-none` sans anneau de remplacement franc), `Contact.vue:25,35` (`focus:ring-1` fin), `main.css:139-141` (classe `.focus-visible` définie mais jamais utilisée), `app.vue` (aucun « Aller au contenu »).
  - Problème : le focus clavier est peu ou pas visible sur liens et boutons personnalisés (`NuxtLink` du hero, cartes, liens du footer) ; la navigation sticky force à tabuler 6+ fois avant le contenu.
  - Correctif : règle globale `:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }` (ou anneau `ring-2 ring-white ring-offset-2 ring-offset-f1-black`) dans `main.css`, supprimer la classe `.focus-visible` orpheline, ne jamais mettre `outline-none` sans remplacement. Ajouter en premier enfant de `app.vue` : `<a href="#main" class="sr-only focus:not-sr-only ...">Aller au contenu</a>` et `id="main"` sur `<main>`.

- [M-09] Zones tactiles < 44 px
  - Où : `components/YearSelector.vue:3-9,23-29` (`btn-circle btn-sm` = 32 px), `app.vue:35-38` (`menu-sm` ≈ 32 px par entrée), `records.vue:56` (« ✕ » `btn-sm`), `drivers/[id].vue:126-127` (`btn-xs` = 24 px), `Dashboard.vue:122,166` (« Tout voir → » `text-xs` sans padding), `Dashboard.vue:80` (`btn-sm`), `RaceInfo.vue:13` (`btn-sm`), onglets `tab` daisyUI (~32 px), liens du footer `app.vue:84-87` (`text-sm`, sans padding).
  - Correctif : imposer `min-h-11 min-w-11` (44 px) sur ces contrôles ; `btn-md` au lieu de `btn-sm/xs` sur mobile ; liens de menu mobile `py-3`; liens de footer `inline-block py-2`.

- [M-10] Formulaires : libellés non associés, autocomplétion absente
  - Où : `Contact.vue:20,31` (`<label class="label">` sans `for`, input sans `id`), `login.vue:9-31`, `account.vue:14-47`, `compare/drivers.vue:10-30`, `YearRangeSelector.vue:4-30`, `YearSelector.vue:10` (select sans libellé) et `:3,:23` (flèches `❮ ❯` sans `aria-label`), `records.vue:14-20` (champ de recherche sans label, uniquement un placeholder), `ChatWindow.vue:42-55` (champ et bouton d'envoi sans nom accessible), `ChatWindow.vue:6`.
  - Problème : les lecteurs d'écran annoncent des champs sans nom ; le clic sur le libellé ne focalise pas le champ. Sur `login.vue`, absence d'`autocomplete="email"` / `current-password` / `new-password` et de `name`.
  - Correctif : relier chaque `label` à son champ (`<label for="contact-email">` + `id`), ou envelopper le champ dans le `label` ; `aria-label="Année précédente"` / `"Année suivante"` sur les flèches et `aria-label="Saison"` (ou `sr-only` label) sur le select ; `aria-label="Envoyer le message"` sur le bouton icône du chat, `aria-label="Fermer le record"` sur « ✕ » ; `aria-label="Rechercher un record"` sur l'input Records ; ajouter les attributs `autocomplete`.

- [M-11] États de chargement/erreur incomplets, messages trompeurs
  - Où : `stats.vue:386-390` (l'erreur est seulement loguée ; le badge « Données à jour » s'affiche même si le chargement a échoué car `v-if="!loading"`, `:12`), `dashboard.vue:185-205` (aucun état de chargement ni d'erreur, ~24 appels API séquentiels pour les résultats), `records.vue:179-187` (échec du catalogue ignoré : grille vide sans message), `drivers/[id].vue:16-20` (un échec d'API et « aucun point en F1 » partagent le même message), `races/[year]/[round].vue:87-90` (erreur réseau affichée comme « Course non trouvée »), `records.vue:62` (« Erreur lors du chargement du classement. » sans action).
  - Problème : l'utilisateur ne sait pas si c'est vide, en erreur ou en cours ; aucune possibilité de réessayer.
  - Correctif : introduire un composant `StateBlock` avec 3 états (chargement = skeleton, erreur = message + bouton « Réessayer », vide = message explicatif). Séparer `error` de `empty` dans chaque page. `stats.vue` : `error` ref, badge conditionné à `!error`. Messages types : « Impossible de charger les classements. Vérifiez votre connexion puis réessayez. »

- [M-12] Interface bilingue : libellés anglais dans un site français
  - Où : `components/RaceResult.vue:6,14-19,51` (« Race Results », « Pos », « Driver », « Team », « Laps », « Time/Status », « Points », « Lap »), `components/race/RaceInfo.vue:6,31` (« Circuit Information », « Nom du Circuit »), `race/RaceHero.vue:23` (« {{ season }} Season »), `pages/drivers/[id].vue:195` (badge « Best »), `SprintResult.vue:19` (« Temps/Status »), `pages/dashboard.vue:7,437`, libellé de série « Fastest Laps » (`:311`), « MAJ » (`:12`), `StandingsTable.vue` ; pays et nationalités renvoyés en anglais par l'API : `DriverCard.vue:68`, `ConstructorCard.vue:77` (« British »), `Dashboard.vue:56`, `RaceCard.vue:34`, `RaceHero.vue:65`.
  - Correctif : traduire (« Résultats de la course », « Pilote », « Écurie », « Tours », « Temps / Statut », « Saison 2025 », « Informations sur le circuit », « Meilleure »). Créer un utilitaire `utils/i18n.ts` avec deux tables (`nationalité → adjectif français`, `pays → nom français`) ou utiliser `Intl.DisplayNames(['fr'], { type: 'region' })` à partir du code pays déjà disponible (`getCountryCode`).

- [M-13] Ressources cassées et images sans fallback ni dimensions
  - Où : voir liste des assets absents (Cartographie) ; `Dashboard.vue:51,141,183` et `DriverCard.vue:63`, `SeasonProgressTable.vue:16` (images sans `width`/`height` → décalage de mise en page ; avatars sans `@error` ni `loading="lazy"`), `RaceHero.vue:89` (`computed(() => getCircuitImage(...))` renvoie une `ComputedRef` imbriquée : `:src="circuitImage"` peut afficher `[object Object]`, **à vérifier visuellement** ; comparer avec `CircuitLayout.vue:36` qui est correct), `composables/useCircuitImages.ts:36` (fallback vers un fichier inexistant).
  - Correctif : ajouter les fichiers manquants ou retirer les références ; `RaceHero.vue:89` → `const circuitImage = getCircuitImage(props.circuit.circuitId)` (sans `computed`) ; ajouter `width`/`height` (ex. avatars 40×40, drapeaux 20×12) ; `@error="$event.target.src='/images/driver-placeholder.jpg'"` sur les avatars ; `loading="lazy"` sur les images hors écran.

- [M-14] Deux tableaux de bord concurrents et données statiques douteuses
  - Où : `pages/dashboard.vue` (orpheline, `h1` « F1 Dashboard ») vs `pages/stats.vue` (h1 « Dashboard Statistiques »), `dashboard.vue:75-183` (≈ 60 valeurs codées en dur, commentaire « données arrêtées en 2024 »).
  - Problème : doublon de fonctionnalité, valeurs figées sans date visible ; plusieurs valeurs semblent incohérentes (ex. « Total des poles » = 1108 = nombre de GP, `:119`) : **à vérifier avant publication**. L'appel séquentiel d'une requête par course (`:196-201`) ralentit la page et risque le rate-limit signalé dans `drivers/[id].vue:456`.
  - Correctif : supprimer `pages/dashboard.vue` (ou rediriger `/dashboard` → `/stats`) et, si les chiffres historiques sont utiles, les déplacer dans `/records` avec la mention « Données au 31/12/2024 » et la source ; vérifier chaque chiffre.

- [M-15] Palette et composants dupliqués et divergents
  - Où :
    - Rouge : `#FF1801` (`tailwind.config.ts:20`) vs `#E10600` (`nuxt.config.ts:30`, `compare/drivers.vue:63`) vs `red-500/600` (`Hero.vue:23`, `Contact.vue:42`).
    - Couleurs d'écurie copiées 4 fois avec des valeurs différentes : `utils/teamColors.ts` (haas `#B6BABD`, rb `#1E3D9B`), `components/ConstructorCard.vue:130`, `components/RaceResult.vue:86`, `components/SeasonProgressTable.vue:141` (haas `#FFFFFF`, rb `#1634CB`, alphatauri, alfa). Audi `#00302E` et Red Bull `#0600EF` presque invisibles sur fond `#0B0B0F` (< 1,5:1).
    - Échelles de gris mélangées : `gray-*` partout, `zinc-*` dans `dashboard.vue` et `white/xx` dans records/drivers.
    - Cartes : trois recettes concurrentes (`card bg-base-100 shadow-xl` dans compare, RaceResults, RoomCard, `Card.vue` ; `bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl|3xl border-white/5` ≈ 30 fois ; `bg-f1-dark-gray/60 … shadow-lg`). Rayons `rounded-lg/xl/2xl/3xl` mélangés. `.card` dans `main.css:68-70` (fond blanc, bordure grise) contredit le thème sombre.
    - Boutons : liens custom (`Hero.vue:32-48`), `btn btn-primary` (daisyUI redéfini en `main.css:52-54`), `btn bg-white/5` (`Dashboard.vue:80`), `btn bg-f1-red hover:bg-red-600` (`[round].vue:36`, `Contact.vue:40`), et un composant `Button.vue` jamais utilisé.
  - Correctif : voir « Système de design recommandé » ; centraliser les couleurs d'écurie dans `utils/teamColors.ts` (un seul jeu de données `{ primary, gradient }`) et l'importer dans `ConstructorCard`, `RaceResult`, `SeasonProgressTable` ; définir les classes `.surface`, `.surface-elevated`, `.btn-primary`, `.btn-secondary` une seule fois ; supprimer le `.card` blanc.

- [M-16] Largeur 384 px fixe sur la carte de connexion
  - Où : `pages/login.vue:3` (`card w-96`), `pages/login.vue:2` (`min-h-screen` dans `main`).
  - Problème : 384 px > largeur utile d'un téléphone de 320-375 px moins les marges → défilement horizontal. `min-h-screen` imbriqué ajoute une barre de défilement.
  - Correctif : `card w-full max-w-sm` ; retirer `min-h-screen` (utiliser `min-h-[60vh]`).

- [M-17] Classements uniquement sous forme de cartes photo
  - Où : `pages/standings.vue:38-43`, `DriversGrid.vue:2`, `ConstructorsGrid.vue:2` ; `components/StandingsTable.vue` (existe mais inutilisé).
  - Problème : 20+ grandes cartes en grille 1-4 colonnes rendent difficile la lecture d'un classement (comparer les points, scanner le rang). Les cartes n'affichent pas l'écart au leader (la prop `maxPoints` est reçue mais jamais utilisée : `DriverCard.vue:104-107`, `ConstructorCard.vue:113-116`). Les cartes écuries ne sont pas cliquables sans le signaler.
  - Correctif : ajouter un sélecteur d'affichage « Cartes / Tableau » (bouton radio accessible) ; le mode Tableau réutilise `StandingsTable` restylé (fond `f1-dark-gray/40`, en-têtes `text-gray-400`, colonne Pilote cliquable). Utiliser `maxPoints` pour une fine barre de progression (ou retirer la prop).

- [M-18] Animations infinies et effets lourds sans `prefers-reduced-motion`
  - Où : `Hero.vue:11,18,54` (`animate-pulse-slow`, `animate-pulse`, `animate-bounce` infinis), `RaceCard.vue:21`, `RaceResult.vue:50`, `stats.vue:13`, `app.vue:5-7` et `Hero.vue:11-12` (blurs de 100-120 px), `3d-card.css` (tilt 3D + `backdrop-blur-md` sur 20+ cartes de /standings, à vérifier visuellement sur mobile), `animate-slide-up` etc.
  - Correctif : dans `main.css`, `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }` ; limiter l'animation « pulse » au seul badge « À venir » ; retirer `animate-bounce` de l'indicateur de scroll ou le supprimer ; réduire les blurs `blur-[120px]` à `blur-3xl` sur mobile.

- [M-19] Menu mobile : comportement incomplet
  - Où : `app.vue:18-40,104`.
  - Problème : le menu n'expose pas son état (`aria-expanded` absent), l'étiquette du bouton reste « Ouvrir » quand il est ouvert, il ne se ferme ni au clic extérieur, ni à Échap, ni au changement de route par retour navigateur ; l'entrée active n'est signalée que par une teinte (`.nav-link-mobile.router-link-active`, `:142`), et 4 liens seulement (voir M-01).
  - Correctif : `:aria-expanded="mobileMenuOpen"`, `aria-controls="mobile-menu"`, libellé dynamique (« Ouvrir/Fermer le menu »), `@keydown.esc`, fermeture au clic extérieur (`onClickOutside` de VueUse ou `watch(() => route.path, () => open = false)`), style actif avec marqueur non colorimétrique (barre rouge à gauche + `aria-current="page"`, que `NuxtLink` pose déjà sur l'entrée exacte).

### Mineur (finitions)

- [m-01] Titre d'onglet identique sur tout le site et `useHead` appelé hors contexte
  - Où : `nuxt.config.ts:25` (titre unique), `pages/index.vue:11-18` (SEO commenté), seule `[round].vue:57-71` utilise `useSeo` et appelle `useHead` dans un `watch` (hors du `setup`, le second appel s'ajoute au lieu de remplacer).
  - Correctif : `useHead({ title: computed(() => ...) })` dans chaque page (« Classements 2026 | Paddock Track Side », « Calendrier 2026 », « Statistiques », « Records », « {Pilote} | Paddock Track Side »). Décommenter `pages/index.vue` script. `useSeo.ts:34-35` duplique `viewport` et `Content-Type` déjà définis dans `nuxt.config.ts` : les retirer.

- [m-02] Typographie : tailles minuscules et fausses variantes de police
  - Où : `text-[10px]` (`DriverCard.vue:44,50`, `ConstructorCard.vue:53,59,91`), `text-xs` omniprésent pour libellés et badges, `main.css:1` (Montserrat 600/700/800 seulement, sans axe italique ni graisse 500 ; Inter 400-700), `font-light` (`Hero.vue:27`, `Dashboard.vue:17`, `Features.vue:13`, `About.vue:24`), `italic` sur Montserrat (`font-display font-bold italic` sur la quasi-totalité des titres et chiffres).
  - Problème : 10 px illisible ; le navigateur fabrique un italique synthétique (rendu dégradé) ; `font-light` (300) retombe sur 400 pour Inter (non chargé). Chargement des polices via `@import` CSS (bloquant et en cascade), sans `preconnect`.
  - Correctif : plancher à 12 px (`text-xs`) pour libellés en majuscules, 14 px (`text-sm`) pour les données secondaires ; charger `Montserrat:ital,wght@0,600..800;1,600..800` ou retirer `italic` ; supprimer `font-light` ou charger Inter 300 ; déplacer le chargement dans `nuxt.config.ts` (`app.head.link` avec `rel="preconnect"` sur `fonts.googleapis.com` et `fonts.gstatic.com` + feuille de style) ou utiliser `@nuxtjs/google-fonts`.

- [m-03] `group-hover` sans `group`, et zones 3D décalées
  - Où : `DriverCard.vue:21,71`, `ConstructorCard.vue:19,28,79` (`group-hover:*` sans ancêtre `.group` : hover jamais appliqué) ; `assets/css/3d-card.css:28-72` (les 9 `div` sont les enfants 1 à 9, mais les règles ciblent `nth-child(2)` à `(10)` : la 1re zone n'a pas de position, la 9e n'a pas d'effet) ; `main.css:88-90` (`.card-hover` utilise `scale-102`, classe Tailwind inexistante).
  - Correctif : ajouter `group` sur `.hover-3d` ou sur le `figure` ; décaler les sélecteurs (`nth-child(1)…(9)`) ; remplacer `hover:scale-102` par `hover:scale-[1.02]`. Désactiver le tilt sur `(hover: none)` et `prefers-reduced-motion`.

- [m-04] Texte alternatif redondant ou manquant, icônes emoji
  - Où : `alt` répétant le texte voisin (`Dashboard.vue:53,141`, `DriverCard.vue:65`, `ConstructorCard.vue:74`, `SeasonProgressTable.vue:18-20` alt + title identiques), image d'arrière-plan décorative avec alt (`Dashboard.vue:38`), emojis décoratifs lus par les lecteurs d'écran (`🏎️`, `📍`, `📅`, `🏆`, `⚡️`, `📊`, `📱`, `🏁` dans `RaceCard.vue:28-33`, `Features.vue`, `RaceInfo.vue:38`, `drivers/[id].vue:82-112`, `About.vue:11`), `role="progressbar"` sans `aria-valuenow`/`aria-label` (`Dashboard.vue:91-95`, `drivers/[id].vue:95`), graphiques canvas sans alternative textuelle (`BarChart`, `PointsChart`, `DoughnutChart`), tableaux sans `<caption>`/`scope="col"` (`RaceResult.vue`, `QualifyingResult.vue`, `stats.vue:126-134`).
  - Correctif : `alt=""` pour images décoratives ou redondantes ; `aria-hidden="true"` sur les emojis/icônes décoratifs ; `role="img"` + `aria-label` résumant les graphiques (ex. « Diagramme des points des pilotes, Verstappen 437 points en tête ») ; ajouter `scope="col"` et une légende `sr-only`.

- [m-05] Microcopy : ton et vocabulaire non homogènes
  - Où : tutoiement dans `records.vue:11,17,42` (« Cherche… », « Tape… », « Essaie… ») contre vouvoiement partout ailleurs (`Contact.vue:13`, `login.vue`, `chat/index.vue:6`) ; marque écrite « PADDOCKTRACKSIDE » (`app.vue:44`), « Paddock Track Side » (titre, footer) et « PADDOCK » (`Features.vue:11`) ; « Constructeurs » (onglet `standings.vue:20`, `stats.vue`) vs « Écuries » (Dashboard, RaceResult, records) ; « Temps Réel » et « en direct » (`Features.vue:28`, `Hero.vue:19`) alors que les données ne se rafraîchissent pas seules ; « Inscription/Connexion » de `login.vue:44` (le bouton qui bascule de mode s'appelle « S'inscrire » alors qu'il est à côté du bouton de soumission) ; `ENVOYER LE MESSAGE`/`EN SAVOIR PLUS`/`VOIR LES CLASSEMENTS` en capitales (moins lisibles ; préférer la casse phrase + `uppercase` CSS si voulu).
  - Correctif : vouvoyer partout (« Recherchez un record (ex. « victoires »)… ») ; choisir « Écuries » ou « Constructeurs » et s'y tenir (recommandé : Écuries dans l'interface, Constructeurs seulement pour le classement officiel) ; écrire la marque « Paddock Track Side » en texte, logo « PADDOCKTRACKSIDE » uniquement dans le composant logo ; nuancer « temps réel » (« Résultats mis à jour après chaque course »).

- [m-06] Détails de navigation et pied de page
  - Où : `app.vue:11` (barre rouge fixe étiquetée « Progress Line », décorative), `app.vue:74` (`p-10` sur mobile), `app.vue:83` (`<nav>` sans `aria-label`, deux landmarks `nav` non distingués), `app.vue:14` (navbar non sémantique : utiliser `<header>`), `app.vue:94-95` (mention de droits sans lien vers sources : Jolpica/Ergast, flagcdn, medias formula1.com), `app.vue:80` (« destination ultime » : slogan sans valeur).
  - Correctif : `<header>` + `<nav aria-label="Navigation principale">` et `<nav aria-label="Pied de page">` ; footer `p-6 md:p-10` ; ajouter « Données : Jolpica F1 API » avec lien ; supprimer la barre rouge fixe ou la relier à la progression de défilement.

- [m-07] Espacements et rythme non normalisés
  - Où : paddings de cartes `p-4/5/6/8/10`, rayons `rounded-lg/xl/2xl/3xl`, marges de section `py-20 md:py-28` (`Dashboard.vue:2`) vs `py-24` (autres sections), écarts de grille `gap-4/6/8/12`, `scale-90 origin-right` et `!mb-0` (`stats.vue:225`) pour contourner le `mb-4` interne de `YearSelector.vue:2`.
  - Correctif : voir échelle recommandée ; retirer `mb-4` de `YearSelector` (marge gérée par le parent) et supprimer les hacks.

- [m-08] CSS mort ou redondant
  - Où : `main.css:52-90` (`.form-input`, `.section-title`, `.loading-overlay`, `.loading-spinner`, `.tab-active`, `.card-hover`, `.nav-link`) et `.nav-link`/`.nav-link-mobile` redéfinis dans `app.vue:120-145`, `.sr-only` redéfini en `main.css:135-137` (déjà fourni par Tailwind), `app.vue:108-117` (`.page-enter-*` sans `pageTransition` configuré), `stats.vue:407-410` (`.table th` non ciblé), `tailwind.config.ts:32` (`hero-pattern` vers un fichier inexistant).
  - Correctif : supprimer les règles non utilisées et garder une seule définition de `.nav-link`.

- [m-09] Autres finitions
  - `pages/stats.vue:79,102` : badges « Total: 20 » / « Écuries: 10 » peu utiles, libellé « Total » ambigu → « 20 pilotes ».
  - `RaceCountdown.vue` : reste à « 0 jours 0 h… » après le départ (`:44-49`) ; ajouter l'état « Course en cours / terminée » ; zone non annoncée : ne pas placer `aria-live` (bruit toutes les secondes).
  - `RaceCard.vue:4` : `opacity-75` sur toute la carte d'une course passée réduit encore le contraste ; utiliser un badge « Terminé » et laisser le texte à pleine opacité.
  - `ChatWindow.vue:4,40` : `border-b`/`border-t` sans couleur (gris clair sur fond sombre), `h-[600px]` fixe (à vérifier visuellement sur mobile paysage).
  - `Hero.vue:5` : image Unsplash 2070 px (chargée à `opacity-40`) : réduire à `w=1200`, ajouter `fetchpriority`/préchargement ou l'héberger dans `public/`.
  - `nuxt.config.ts:6` : commentaire « Firebase Auth » obsolète ; `ssr: false` retarde le premier affichage (écran vide jusqu'à l'exécution JS) : envisager `nitro.prerender` pour l'accueil (choix technique à valider).
  - `tailwind.config.ts:11-18` : `xs: '320px'` ajouté après `2xl` dans `screens` : vérifier visuellement que le `container` n'est pas limité par l'ordre des media queries.
  - Couleurs de série insuffisamment distinctes du fond : `compare/drivers.vue:70-71` (`#15151E`), `dashboard.vue` (couleurs cyan/violet/lime hors charte).

---

## Proposition de navigation cible

Menu principal (desktop et mobile, mêmes entrées, même ordre) :

1. Accueil (logo, `/`)
2. Classements (`/standings`), avec onglets Pilotes / Écuries + année dans l'URL
3. Calendrier (`/races`) ; libellé « Courses » actuel à conserver ou renommer « Calendrier » pour cohérence avec le titre de la page
4. Statistiques (`/stats`)
5. Records (`/records`)
6. (Plus tard, une fois fonctionnels) Comparateur (`/compare/drivers`), Discussions (`/chat`)
7. Zone droite : bouton « Connexion » (`/login`) uniquement si l'authentification est implémentée ; sinon supprimer la zone vide.

Fil d'Ariane (pages de niveau 2) :
- `/races/2025/5` : Accueil › Calendrier 2025 › Grand Prix de Chine
- `/drivers/max_verstappen` : Accueil › Classements › Max Verstappen (retour via `router.back()`)

Pied de page en 3 blocs : Explorer (Classements, Calendrier, Statistiques, Records) ; Le site (À propos si créé, Contact `/#contact`, Sources des données) ; Légal (droits F1, mentions). Ajouter un lien « Retour en haut ».

Arborescence cible :
```
/                       Accueil (hero, aperçu saison, atouts, contact)
/standings?year=&tab=   Classements
/races?year=            Calendrier
  /races/:year/:round   Résultats d'un Grand Prix
/stats?year=            Statistiques
/records                Records (recherche + populaires)
/drivers/:id            Fiche pilote
(404)                   error.vue
(à décider) /compare/drivers, /chat, /login, /account
```
Pages à supprimer ou fusionner : `/dashboard` (doublon de `/stats`), liens `/about` et `/drivers/:id/{races,qualifying}/:year` tant qu'ils n'existent pas.

## Système de design recommandé

### Palette (jetons Tailwind à centraliser dans `tailwind.config.ts`)
| Rôle | Valeur | Usage |
|---|---|---|
| `f1-black` | `#0B0B0F` | fond de page |
| `f1-dark-gray` | `#15151E` | surfaces (cartes) |
| `f1-gray` | `#38383F` | bordures/surfaces relevées |
| `f1-red` (accent texte/icônes sur fond sombre) | `#FF1801` | rouge vif : ≈ 5,0:1 sur f1-black |
| `f1-red-action` (fond de bouton avec texte blanc) | `#E10600` | ≈ 5,0:1 avec texte blanc ; harmonise `theme-color` |
| Texte principal | `#FFFFFF` (`text-white`) | titres, valeurs |
| Texte secondaire | `gray-400` `#9CA3AF` (≥ 7:1) | libellés, descriptions |
| Texte tertiaire minimal | `white/50` (≈ 5:1) ; **interdits** : `gray-500`, `white/40`, `white/30`, `zinc-500` sur fond sombre | |
| Succès / points / alerte | `emerald-400`, `yellow-400`, `red-400` | toujours associés à un texte ou une icône |
| Séries de graphiques | rouge `#FF1801`, blanc `#E5E7EB`, `#FFD700`, `#9CA3AF` | remplace cyan/violet/lime et `#15151E` |
| Couleurs d'écurie | table unique dans `utils/teamColors.ts`, avec liseré clair de 1 px si contraste < 3:1 (Red Bull, Audi) | |

Ne jamais transmettre l'information par la couleur seule : conserver les libellés (« Terminé », « À venir », P1-P3, statuts DNF).

### Typographie
- Deux familles seulement : **Montserrat** (titres, chiffres clés) et **Inter** (texte). Charger exactement les graisses/styles utilisés (Montserrat 600-800 avec italiques réels si l'italique est conservé, Inter 400-600) via `<link rel="preconnect">` + feuille de style dans `nuxt.config.ts`.
- Échelle : h1 `text-3xl md:text-5xl` ; h2 `text-2xl md:text-3xl` ; h3 `text-lg md:text-xl` ; corps `text-base` (16 px) ; secondaire `text-sm` (14 px) ; libellé majuscule `text-xs` (12 px minimum, `tracking-wider`). Interligne du corps `leading-relaxed` ; longueur de ligne ≤ 65-75 caractères (`max-w-prose`/`max-w-2xl`, déjà respecté sur l'accueil).
- Un seul `h1` par page ; harmoniser via `PageHeader`.

### Espacements et rayons
- Échelle : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px (`1, 2, 3, 4, 6, 8, 12, 16`).
- Gouttière de page : `px-4 sm:px-6 lg:px-8`, largeur max `max-w-7xl`. Sections d'accueil : `py-16 md:py-24`. Écart de grille : `gap-4` (cartes) / `gap-6` (blocs).
- Padding de carte : `p-5 md:p-6`. Rayons : 2 niveaux seulement, `rounded-xl` (contrôles, badges, boutons) et `rounded-2xl` (cartes/blocs) ; `rounded-full` pour pastilles.

### Composants à unifier
- **Surface (carte)** : `bg-f1-dark-gray/60 border border-white/10 rounded-2xl` (+ `backdrop-blur` uniquement sur les blocs superposés à un fond décoratif). Un seul composant `Card`/classe `.surface` ; supprimer `.card` blanc de `main.css` et les `card bg-base-100 shadow-xl`.
- **Bouton primaire** : `bg-f1-red-action text-white font-bold rounded-xl min-h-11 px-6 hover:brightness-110 focus-visible:ring-2` ; **secondaire** : `bg-white/5 border border-white/10 text-white` ; **lien/tertiaire** : `text-gray-300 hover:text-white underline-offset`. Hauteur mini 44 px. État désactivé : `opacity-50 cursor-not-allowed` + `disabled`. Réactiver/adapter `Button.vue` pour porter ces variantes et l'utiliser partout.
- **Onglets** : composant `Tabs` accessible (`role="tablist/tab/tabpanel"`, flèches gauche/droite), état actif = fond `f1-red-action` + texte blanc gras.
- **Champs de formulaire** : `label` visible, `bg-black/30 border-white/20 text-white`, placeholder `gray-400`, focus `ring-2 ring-white`, erreur = bordure `red-400` + message `text-red-300` sous le champ avec icône, `aria-invalid` et `aria-describedby`.
- **Tableaux** : un seul style (déjà présent dans `RaceResult`/`QualifyingResult` : `bg-white/5` d'en-tête, `divide-white/5`), `<caption class="sr-only">`, `scope="col"`, `overflow-x-auto` avec ombre indicatrice de défilement sur mobile.
- **États** : `StateBlock` (chargement skeleton, vide, erreur + « Réessayer »).
- **Focus** : anneau blanc 2 px + décalage 2 px, sur tous les éléments interactifs.
- **Badges** : « Terminé » (gris) / « À venir » (rouge action) / « Sprint » ; texte ≥ 12 px, contraste ≥ 4,5:1.

## Plan d'exécution

Chaque lot est indépendant et vérifiable ; l'ordre limite les régressions.

### Lot 1 : Navigation et architecture (C-02, C-05, M-01, M-03, M-19, m-01, m-06)
1. Créer `error.vue` (404 français).
2. Retirer ou corriger les liens morts : `About.vue:34`, `drivers/[id].vue:244-245`.
3. Décider du sort des pages orphelines (`/dashboard` supprimer/rediriger ; `/compare`, `/chat`, `/login`, `/account` masquer tant que non fonctionnelles).
4. Refondre menu et footer selon « Navigation cible » ; `<header>`/`<nav aria-label>` ; comportement complet du menu mobile.
5. Ajouter fil d'Ariane sur `/races/:year/:round` et `/drivers/:id` ; synchroniser année/onglet avec l'URL.
6. Titres d'onglet par page (`useHead`).
Vérification : chaque lien mène à une page existante ; retour navigateur conserve l'année.

### Lot 2 : Design system (C-01, M-02, M-07, M-15, m-02, m-07, m-08)
1. Corriger `main.css` (titres, body sombre, supprimer `.card` blanc et CSS mort).
2. Centraliser palette, rouge d'action, couleurs d'écurie, échelle d'espacement/rayons dans `tailwind.config.ts` et `utils/teamColors.ts`.
3. Remplacer `gray-500`/`white/40`/`zinc-500` sur fond sombre ; placeholders.
4. Polices : `preconnect`, graisses réellement chargées, retirer `italic` synthétique ou charger l'italique ; tailles plancher 12/14 px.
5. Corriger l'année codée en dur (Hero, titre de /standings).
Vérification : audit de contraste (outil navigateur) sans échec sur les 6 pages ; tous les h1-h6 lisibles.

### Lot 3 : Composants et états (C-03, C-04, M-04, M-05, M-11, M-12, M-13, M-17)
1. Créer `PageHeader`, `PageContainer`/`Section`, `Card`/`.surface`, `Button`, `Tabs`, `StateBlock` ; migrer les pages (standings, races, compare, account, chat en priorité).
2. Contact : envoi réel + états succès/erreur (ou retrait).
3. Comparateur : retirer les données aléatoires.
4. États chargement/erreur/vide avec « Réessayer » sur toutes les pages de données.
5. Traduire les libellés anglais et localiser pays/nationalités.
6. Corriger `RaceHero.vue:89`, ajouter les assets manquants ou retirer les références, `width`/`height` et `@error` sur les images.
7. Vue Tableau des classements (`StandingsTable` restylé).

### Lot 4 : Responsive (M-09, M-16, M-05)
1. Zones tactiles ≥ 44 px (YearSelector, menu mobile, boutons `btn-sm/xs`, liens du footer).
2. `login.vue` : `w-full max-w-sm`, sans `min-h-screen`.
3. Sections pleine largeur (retirer `container` de `main`), page course sans `-mt-20` ou avec marge suffisante.
4. Vérifier à 320, 375, 768, 1024, 1440 px : aucun défilement horizontal de page ; graphiques à 20 libellés lisibles ; `xs: 320px` du `container`.

### Lot 5 : Accessibilité (C-06, M-08, M-10, M-06, m-04)
1. Onglets, cartes et suggestions au clavier (rôles, `Tabs`, `RaceCard` en `NuxtLink`, combobox Records).
2. Focus visible global + lien d'évitement `#main`.
3. Labels associés, `aria-label` des boutons icônes, `autocomplete`.
4. Hiérarchie de titres (un h1/page ; cartes en h3).
5. `alt` pertinents ou vides, emojis `aria-hidden`, alternatives textuelles des graphiques, `scope`/`caption` des tableaux.
Vérification : parcours complet au clavier seul ; passage axe/Lighthouse ≥ 95 accessibilité ; test rapide avec un lecteur d'écran (VoiceOver).

### Lot 6 : Finitions (M-14, M-18, m-03, m-05, m-09)
1. `prefers-reduced-motion`, réduction des animations infinies et des blurs.
2. Corriger `group-hover`, zones 3D, `scale-102`.
3. Uniformiser la microcopy (vouvoiement, Écuries/Constructeurs, marque).
4. Supprimer ou fusionner `/dashboard` et vérifier les chiffres historiques.
5. Optimiser l'image du hero et envisager le pré-rendu de l'accueil.
6. Revoir le compte à rebours après le départ, les badges « Total », l'opacité des cartes passées.

### Points à vérifier visuellement avant/pendant correction
- Image du hero de course (`RaceHero.vue:89`).
- Chevauchement `-mt-20` sur la page course.
- Ordre des media queries `container` avec l'écran `xs`.
- Lisibilité des graphiques (20 libellés) à 320-375 px.
- Fluidité de /standings sur mobile (tilt 3D + `backdrop-blur` sur 20+ cartes).
- Exactitude des chiffres historiques de `dashboard.vue`.
