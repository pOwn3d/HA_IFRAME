# Système de Points pour Enfants

Une application React moderne pour gérer un système de points pour enfants, avec des récompenses et des défis. Conçue pour être facilement intégrable dans Home Assistant via des iframes.

## Fonctionnalités

- Gestion des points (ajouter, retirer, échanger)
- Système de récompenses basé sur des seuils de points
- Défis quotidiens personnalisables
- Tableau de bord parent et vues enfants
- Authentification avec code parental (1234 par défaut)
- Thèmes spécifiques pour chaque enfant (couleurs chaudes pour Noa, froides pour Nathan)
- Persistance des données avec localStorage
- Réinitialisation automatique des points quotidiens
- Interface utilisateur moderne et attrayante
- Pages indépendantes pour faciliter l'intégration dans Home Assistant

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
- `src/pages/` - Pages dédiées pour différentes vues
  - `auth/` - Page de connexion
  - `dashboard/` - Tableau de bord parent
  - `childView/` - Vue adaptée aux enfants
  - `actions/` - Pages d'actions isolées (ajouter/retirer des points, etc.)
  - `standalone/` - Composants autonomes pour les iframes

## Intégration avec Home Assistant

L'application est conçue pour être facilement intégrable dans Home Assistant via des iframes. Voici les différentes URL que vous pouvez utiliser:

### Pages principales

- `/login` - Page de connexion
- `/dashboard` - Tableau de bord parent
- `/child/noa` - Vue pour Noa
- `/child/nathan` - Vue pour Nathan

### Widgets autonomes pour les cartes de Home Assistant

- `/standalone/points/noa` - Affichage des points de Noa
- `/standalone/points/nathan` - Affichage des points de Nathan
- `/standalone/challenge/noa` - Défi du jour pour Noa
- `/standalone/challenge/nathan` - Défi du jour pour Nathan
- `/standalone/history/noa` - Historique récent pour Noa
- `/standalone/history/nathan` - Historique récent pour Nathan

### Pages d'actions dédiées

- `/actions/add-points/noa` - Ajouter des points à Noa
- `/actions/add-points/nathan` - Ajouter des points à Nathan
- `/actions/remove-points/noa` - Retirer des points à Noa
- `/actions/remove-points/nathan` - Retirer des points à Nathan
- `/actions/redeem-reward/noa` - Échanger des points contre une récompense pour Noa
- `/actions/redeem-reward/nathan` - Échanger des points contre une récompense pour Nathan
- `/actions/complete-challenge/noa` - Valider le défi du jour pour Noa
- `/actions/complete-challenge/nathan` - Valider le défi du jour pour Nathan

### Configuration dans Home Assistant

Exemples de configuration pour l'intégration:

```yaml
# Configuration du tableau de bord
type: iframe
url: http://votre-serveur:3000/dashboard
aspect_ratio: 16:9

# Widget de points dans une carte
type: iframe
url: http://votre-serveur:3000/standalone/points/noa
aspect_ratio: 3:1

# Bouton pour ajouter des points
type: button
name: Ajouter des points
icon: mdi:plus-circle
tap_action:
  action: url
  url_path: http://votre-serveur:3000/actions/add-points/noa
```

## Personnalisation

Accédez aux paramètres du système depuis la vue parent pour:

- Modifier le code parental
- Ajuster les seuils de points pour les récompenses
- Configurer l'heure de réinitialisation quotidienne
- Personnaliser les thèmes pour chaque enfant

## Données

Les données sont stockées localement dans le navigateur (localStorage), ce qui permet de conserver l'état de l'application entre les sessions.

## Développement

Commandes disponibles:

```bash
# Démarrer l'application en mode développement
npm start

# Construire l'application pour la production
npm run build

# Exécuter les tests
npm test
```

L'application est construite avec:

- React (Create React App)
- Redux Toolkit pour la gestion d'état
- Material UI et Framer Motion pour l'interface utilisateur
- React Router pour la navigation
