# CatMash

CatMash est une application web qui permet de voter pour le chat le plus mignon, inspirée de l'UX de Facemash. Les utilisateurs peuvent voter entre deux chats affichés aléatoirement, et consulter le classement général des chats selon leur score.

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation & démarrage](#installation--démarrage)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts disponibles](#scripts-disponibles)
- [Tests & Qualité](#tests--qualité)
- [Déploiement](#déploiement)

---

## Présentation

CatMash est une mini-application web permettant de trouver le chat le plus mignon grâce aux votes des utilisateurs. L'application s'appuie sur les données publiques de [l'API cats.json](https://data.latelier.co/cats.json) et propose une expérience utilisateur inspirée de Facemash.

## Fonctionnalités

- Affichage de deux chats aléatoires pour voter pour le plus mignon
- Mise à jour du score des chats à chaque vote
- Page de classement de tous les chats selon leur score
- Navigation simple entre la page de vote et le classement
- Responsive et utilisable sur Google Chrome
- Déploiement public et code source disponible sur GitHub

## Stack technique

- **Next.js** (App Router, SSR, API)
- **React** (Server/Client Components)
- **TypeScript** (Typage strict)
- **Tailwind CSS** (UI rapide et moderne)
- **Jest** (tests unifiés front/back)
- **ESLint/Prettier** (qualité et formatage)
- **Husky/lint-staged** (hooks Git)

## Structure du projet

L'architecture du projet CatMash est pensée pour séparer clairement les responsabilités et faciliter la maintenabilité. Voici la structure principale :

catmash/
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api
│   │   ├── authorize-action-token
│   │   │   ├── route.ts
│   │   │   └── __tests__
│   │   │       └── route.test.ts
│   │   ├── cats
│   │   │   ├── route.ts
│   │   │   └── match
│   │   │       ├── route.ts
│   │   │       └── vote
│   │   │           └── route.ts
│   │   └── stats
│   │       └── total-matches
│   │           └── route.ts
│   └── classement
│       └── page.tsx
├── components
│   ├── experience
│   │   └── PageTransitionOverlay.tsx
│   ├── features
│   │   └── Navigation
│   │       ├── BottomNavigationTongue.tsx
│   │       ├── Footer.tsx
│   │       └── Header.tsx
│   └── ui
│       └── ArrowUpIcon.tsx
├── config
│   ├── actionToken.ts
│   └── firebaseAdmin.ts
├── contexts
│   ├── PageTransitionContext.tsx
│   ├── Providers.tsx
│   └── UserContext.tsx
├── hooks
│   ├── useAuthorizeActionToken.ts
│   ├── useCatMatch.ts
│   ├── useCats.ts
│   ├── useTotalMatches.ts
│   ├── useVoteForMatch.ts
│   └── __tests__
│       ├── useAuthorizeActionToken.test.tsx
│       └── useCats.test.tsx
├── middleware
│   └── requireActionToken.ts
├── services
│   ├── client
│   │   ├── action-token.ts
│   │   ├── cats.ts
│   │   ├── http.ts
│   │   └── __tests__
│   │       ├── action-token.test.ts
│   │       └── cats.test.ts
│   └── server
│       ├── cats.ts
│       ├── stats.ts
│       ├── votes.ts
│       └── __tests__
│           └── cats.test.ts
├── types
│   ├── actionToken.ts
│   ├── cat.ts
│   └── user.ts
├── utils
│   ├── actionToken.ts
│   ├── constants.ts
│   ├── cookies.ts
│   └── serialize.ts
└── validation
    ├── actionToken.ts
    ├── cat.ts
    └── __tests__
        └── actionToken.test.ts

Chaque dossier est organisé pour séparer clairement les responsabilités (API, UI, logique métier, configuration, etc.), facilitant ainsi la maintenance et l'évolution du projet.

## Prérequis

- **Node.js** ≥ 22
- **npm**

## Installation & démarrage

1. Clonez le dépôt (accès privé) :
   ```bash
   git clone git@github.com:aumanuel/catmash.git
   cd catmash
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez vos variables d'environnement (voir ci-dessous).
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Variables d'environnement

Copiez `.env.local.example` en `.env.local` et renseignez les clés Firebase :

```env
# --- Firebase Admin (backend uniquement) ---
FIREBASE_ADMIN_TYPE=""
FIREBASE_ADMIN_PROJECT_ID=""
FIREBASE_ADMIN_CLIENT_EMAIL=""
FIREBASE_ADMIN_PRIVATE_KEY=""
ACTION_TOKEN_SECRET=""
```

## Scripts disponibles

- `npm run dev` : Démarre le serveur Next.js en mode développement
- `npm run build` : Build de l'application pour la production
- `npm test` : Exécute tous les tests (front & back)

## Tests & Qualité

- **Jest** est utilisé pour tous les tests (front et back).
- **React Testing Library** pour les composants React.
- **ts-jest** pour le support TypeScript natif.
- **Seuils stricts** de couverture (0% (ça rigole pas !) branches, lignes, fonctions, statements).
- **Hooks Git** : lint, format et tests sur chaque commit/push (via Husky & lint-staged).

## Déploiement

### Vercel

1. Poussez votre code sur la branche principale (accès privé).
2. Connectez le dépôt à Vercel.
3. Ajoutez les variables d'environnement dans **Settings > Environment Variables**.
4. Vercel détecte Next.js et exécute automatiquement :
   ```bash
   npm install
   npm run build
   ```
