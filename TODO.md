# TODO CatMash (MVP 1h)

## 1. Structure et navigation

- [x] Adapter le fichier README pour qu'il corresponde au projet
- [x] Initialiser le projet en local et sur Vercel avec Next.js, TypeScript, et Tailwind CSS
- [x] Concevoir et intégrer le logo du projet
- [x] Personnaliser l'en-tête, le pied de page et le favicon
- [x] Développer les deux pages principales :
  - Page de vote
  - Page de résultats
- [x] Mettre en place une navigation persistante en bas de page (onglets)
  - [x] Ajouter une animation de transition lors du changement d'onglet (l'onglet actif se soulève et entraîne la page suivante, l'ancienne reste visible brièvement)

## 2. Gestion des données des chats

- [x] Définir la structure de la base de données pour stocker les informations des chats (id, URL, score, etc.)
- [x] Insérer les données des chats dans la base de données Firebase

## 3. Page de résultats

- [x] Récupérer le classement des chats depuis le backend (triés par score Elo décroissant)
- [x] Afficher la liste des chats triés (image, nom/ID, score)

## 4. Page de vote

- [x] Demander un « match » au backend :
  - [x] Le backend sélectionne deux chats, génère un jeton sécurisé (incluant les deux chats et la requête du front)
  - [x] Le backend renvoie le jeton et les informations des deux chats au frontend
- [x] Afficher les deux chats à l'utilisateur (image et nom/ID)
- [x] Lors d'un vote :
  - [x] Envoyer au backend : le jeton reçu, l'identifiant du chat gagnant, l'identifiant du chat perdant et le visitorId (stocké en cookie)
  - [x] Le backend vérifie le jeton, met à jour les scores Elo des deux chats, enregistre le vote (et empêche de voter à nouveau pour le même match)
  - [x] Rafraîchir les chats proposés au vote
  - [x] Mettre à jour le compteur de matchs effectués
  - [x] Garantir l'unicité du vote et éviter qu'un même match soit reproposé ou recompté

## 5. Finalisation

- [ ] Nettoyer le projet (suppression des fichiers inutiles, organisation du code, etc.)