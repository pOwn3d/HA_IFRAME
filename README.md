# Système de Points pour Enfants

Une application React qui permet de gérer un système de points pour enfants, avec des récompenses et des défis.

## Fonctionnalités

- Gestion des points (ajouter, retirer, échanger)
- Système de récompenses basé sur des seuils de points
- Défis quotidiens
- Tableau de bord parent et vues enfants
- Authentification avec code parental
- Historique des actions
- Persistance des données via localStorage

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure de l'application

- `src/app/` - Configuration du store Redux et localStorage
- `src/features/` - Fonctionnalités principales organisées par domaine
  - `auth/` - Authentification et code parental
  - `points/` - Gestion des points et historique
  - `settings/` - Paramètres du système
  - `dashboard/` - Tableau de bord parent
  - `childView/` - Vue adaptée aux enfants

## Utilisation

1. Ouvrez l'application et choisissez une vue:
   - Vue parent (avec code parental)
   - Vue enfant (Noa ou Nathan)

2. Vue enfant:
   - Consulter les points actuels
   - Demander l'ajout ou le retrait de points (avec validation parentale)
   - Consulter l'historique récent
   - Compléter des défis

3. Vue parent:
   - Tableau de bord avec résumé pour les deux enfants
   - Gestion des points et récompenses
   - Configuration des défis quotidiens
   - Paramètres du système

## Personnalisation

Accédez aux paramètres du système depuis la vue parent pour:
- Modifier le code parental
- Ajuster les seuils de points pour les récompenses
- Configurer l'heure de réinitialisation quotidienne
- Personnaliser les thèmes pour chaque enfant

## Données

Les données sont stockées localement dans le navigateur (localStorage), ce qui permet de conserver l'état de l'application entre les sessions.