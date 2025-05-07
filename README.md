# fast-start-web

Un starter kit full-stack moderne, développé à titre personnel, pour lancer rapidement des applications web avec Next.js, React, API Node.js et Firebase.

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
- [Licence](#licence)

---

## Présentation

Ce starter est conçu pour accélérer la création d'applications web, en combinant une architecture moderne, des outils de qualité, et une configuration prête à l'emploi. Il sert de base pour démarrer rapidement des projets, sans perdre de temps sur le code ou la configuration initiale.


## Fonctionnalités

- **Next.js App Router** avec **TypeScript**
- **React Server Components**
- **API routes** (Node.js, Edge Runtime support)
- **Firebase SDK** v10+ (Auth, Firestore, Storage)
- **Tailwind CSS** pour le styling
- **ESLint**, **Prettier**, **Husky**, **lint-staged**
- **Jest** + **React Testing Library** pour les tests front et back

## Stack technique

- **Next.js** (App Router, SSR, API)
- **React** (Server/Client Components)
- **Firebase** (Admin SDK côté serveur)
- **TypeScript** (Typage strict)
- **Tailwind CSS** (UI rapide et moderne)
- **Jest** (tests unifiés front/back)
- **ESLint/Prettier** (qualité et formatage)
- **Husky/lint-staged** (hooks Git)

## Structure du projet

L'architecture du projet est pensée pour séparer clairement les responsabilités et faciliter la maintenabilité. Voici la structure principale :

```
fast-start-web/
├── src/
│   ├── app/                      # Routing Next.js & API
│   │   ├── favicon.ico
│   │   ├── globals.css           # Styles globaux
│   │   ├── layout.tsx            # Layout racine
│   │   ├── page.tsx              # Page d'accueil (/)
│   │   ├── demo/
│   │   │   └── page.tsx          # Exemple de page (/demo)
│   │   └── api/                  # Endpoints API (Node.js)
│   │       ├── authorize-action-token/
│   │       │   └── route.ts
│   │       │   └── __tests__/
│   │       │       └── route.test.ts
│   │       └── generic-data/
│   │           ├── route.ts
│   │           └── __tests__/
│   │               └── route.test.ts
│   │           └── [id]/
│   │               └── route.ts
│   │               └── __tests__/
│   │                   └── route.test.ts
│   ├── components/
│   │   ├── features/             # Composants métier
│   │   │   ├── Navigation/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Header.tsx
│   │   │   └── generic-data/
│   │   │       ├── DataList.tsx
│   │   │       ├── DataForm.tsx
│   │   │       └── __tests__/
│   │   │           ├── DataList.test.tsx
│   │   │           └── DataForm.test.tsx
│   │   └── ui/                   # Composants réutilisables
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Modal.tsx
│   ├── config/                   # Configuration centralisée
│   │   ├── actionToken.ts
│   │   └── firebaseAdmin.ts
│   ├── contexts/                 # Contexts React globaux
│   │   ├── Providers.tsx
│   │   └── UserContext.tsx
│   ├── hooks/                    # Hooks React globaux
│   │   ├── useAuthorizeActionToken.ts
│   │   ├── useGenericData.ts
│   │   └── __tests__/
│   │       ├── useAuthorizeActionToken.test.tsx
│   │       └── useGenericData.test.tsx
│   ├── middleware/               # Middlewares Next.js & utilitaires
│   │   ├── requireActionToken.ts
│   │   └── __tests__/
│   │       └── requireActionToken.test.ts
│   ├── services/                 # Services client (HTTP) & serveur (DB, logique)
│   │   ├── client/
│   │   │   ├── action-token.ts
│   │   │   ├── generic-data.ts
│   │   │   ├── http.ts
│   │   │   └── __tests__/
│   │   │       ├── generic-data.test.ts
│   │   │       └── action-token.test.ts
│   │   └── server/
│   │       └── generic-data.ts
│   │       └── __tests__/
│   │           └── generic-data.test.ts
│   ├── types/                    # Types TypeScript globaux
│   │   ├── actionToken.ts
│   │   ├── generic-data.ts
│   │   └── user.ts
│   ├── utils/                    # Fonctions utilitaires
│   │   ├── actionToken.ts
│   │   ├── constants.ts
│   │   └── serialize.ts
│   └── validation/               # Schémas de validation (Zod)
│       ├── actionToken.ts
│       ├── generic-data.ts
│       └── __tests__/
│           ├── actionToken.test.ts
│           └── generic-data.test.ts
├── jest.config.ts                # Configuration Jest
├── jest.setup.ts                 # Setup tests
├── tsconfig.json                 # Configuration TypeScript
└── ...                           # Autres fichiers de configuration et scripts
```

Chaque dossier est organisé pour séparer clairement les responsabilités (API, UI, logique métier, configuration, etc.), facilitant ainsi la maintenance et l'évolution du projet.

## Prérequis

- **Node.js** ≥ 22
- **npm**

## Installation & démarrage

1. Clonez le dépôt (accès privé) :
   ```bash
   git clone git@github.com:aumanuel/fast-start-web.git
   cd fast-start-web
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
