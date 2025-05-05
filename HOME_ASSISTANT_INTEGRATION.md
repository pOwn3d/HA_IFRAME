# Guide d'intégration dans Home Assistant

Ce guide explique comment intégrer votre système de points pour enfants dans Home Assistant en utilisant des iframes et des boutons.

## Configuration requise

1. Votre application doit être accessible depuis Home Assistant

   - Option 1: Héberger l'application sur un serveur accessible sur votre réseau local
   - Option 2: Utiliser un service d'hébergement (Vercel, Netlify, etc.)

2. Configurer CORS dans Home Assistant (si nécessaire) pour permettre l'intégration des iframes

## URLs clés pour l'intégration

### Pages autonomes pour les cartes

Ces URLs sont idéales pour être intégrées dans des cartes iframe dans Home Assistant:

- `/standalone/points/noa` - Affichage des points de Noa
- `/standalone/points/nathan` - Affichage des points de Nathan
- `/standalone/challenge/noa` - Défi du jour pour Noa
- `/standalone/challenge/nathan` - Défi du jour pour Nathan
- `/standalone/history/noa` - Historique récent pour Noa
- `/standalone/history/nathan` - Historique récent pour Nathan
- `/standalone/rewards/noa` - Récompenses disponibles pour Noa
- `/standalone/rewards/nathan` - Récompenses disponibles pour Nathan

### Pages d'actions

Ces URLs sont parfaites pour des boutons d'action dans Home Assistant:

- `/actions/add-points/noa` - Ajouter des points à Noa
- `/actions/add-points/nathan` - Ajouter des points à Nathan
- `/actions/remove-points/noa` - Retirer des points à Noa
- `/actions/remove-points/nathan` - Retirer des points à Nathan
- `/actions/redeem-reward/noa` - Échanger des points contre une récompense pour Noa
- `/actions/redeem-reward/nathan` - Échanger des points contre une récompense pour Nathan
- `/actions/complete-challenge/noa` - Valider le défi du jour pour Noa
- `/actions/complete-challenge/nathan` - Valider le défi du jour pour Nathan

## Exemples d'intégration dans Home Assistant

### Affichage des points (avec la carte Iframe)

```yaml
type: iframe
url: http://votre-serveur:3000/standalone/points/noa
title: Points de Noa
aspect_ratio: 16:9
```

### Défi du jour (avec la carte Iframe)

```yaml
type: iframe
url: http://votre-serveur:3000/standalone/challenge/nathan
title: Défi du jour - Nathan
aspect_ratio: 21:9
```

### Bouton pour ajouter des points

```yaml
type: button
name: Ajouter des points à Noa
icon: mdi:plus-circle
tap_action:
  action: url
  url_path: http://votre-serveur:3000/actions/add-points/noa
```

### Panneau complet avec plusieurs éléments

```yaml
type: vertical-stack
cards:
  - type: horizontal-stack
    cards:
      - type: iframe
        url: http://votre-serveur:3000/standalone/points/noa
        aspect_ratio: 16:9
      - type: iframe
        url: http://votre-serveur:3000/standalone/points/nathan
        aspect_ratio: 16:9
  - type: horizontal-stack
    cards:
      - type: iframe
        url: http://votre-serveur:3000/standalone/challenge/noa
        aspect_ratio: 16:9
      - type: iframe
        url: http://votre-serveur:3000/standalone/challenge/nathan
        aspect_ratio: 16:9
  - type: horizontal-stack
    cards:
      - type: button
        name: Ajouter
        icon: mdi:plus-circle
        tap_action:
          action: url
          url_path: http://votre-serveur:3000/actions/add-points/noa
      - type: button
        name: Retirer
        icon: mdi:minus-circle
        tap_action:
          action: url
          url_path: http://votre-serveur:3000/actions/remove-points/noa
      - type: button
        name: Récompense
        icon: mdi:gift
        tap_action:
          action: url
          url_path: http://votre-serveur:3000/actions/redeem-reward/noa
```

## Automatisations possibles

Voici quelques exemples d'automatisations que vous pourriez configurer dans Home Assistant:

### Rappel quotidien pour les défis à 18h

```yaml
alias: Rappel des défis enfants
description: Envoie une notification à 18h pour rappeler les défis des enfants
trigger:
  - platform: time
    at: '18:00:00'
condition: []
action:
  - service: notify.mobile_app
    data:
      title: 'Défis des enfants'
      message: "N'oubliez pas de vérifier si les défis du jour ont été complétés"
      data:
        actions:
          - action: URI
            title: 'Voir les défis'
            uri: 'http://votre-serveur:3000/dashboard'
```

### Automatisation pour la réinitialisation des points

```yaml
alias: Réinitialisation des points quotidiens
description: Ouvre une iframe à 6h pour déclencher la réinitialisation des points
trigger:
  - platform: time
    at: '06:00:00'
condition: []
action:
  - service: browser_mod.popup
    data:
      title: 'Réinitialisation des points'
      content:
        type: iframe
        url: 'http://votre-serveur:3000/dashboard'
      hide_after: 5
      auto_close: true
```

## Conseils pour une meilleure intégration

1. **Tailles d'écran**: Utilisez des ratios d'aspect appropriés pour les différentes cartes en fonction de l'espace disponible dans votre interface Home Assistant.

2. **Placement**: Organisez les cartes et boutons de manière logique, par exemple:

   - Points et défis en haut
   - Boutons d'action au milieu
   - Historique en bas

3. **Thème**: Ajustez les couleurs des boutons dans Home Assistant pour correspondre aux thèmes personnalisés de chaque enfant (orange pour Noa, bleu pour Nathan).

4. **Performance**: Si vous rencontrez des problèmes de performance, réduisez le nombre d'iframes chargées simultanément.

5. **Sécurité**: Si vous rendez votre système accessible en dehors de votre réseau local, assurez-vous de sécuriser l'accès avec des authentifications appropriées.

## Dépannage

Si vous rencontrez des problèmes avec l'intégration:

1. **Problèmes de CORS**: Vérifiez que Home Assistant est configuré pour permettre les iframes depuis votre serveur.

2. **Pages non chargées**: Assurez-vous que votre serveur est accessible depuis Home Assistant. Testez les URLs directement dans un navigateur.

3. **Problèmes de taille**: Ajustez les ratios d'aspect ou utilisez des paramètres CSS personnalisés dans la configuration Lovelace pour améliorer l'affichage.

4. **Problèmes de communication**: La communication entre les iframes peut être limitée pour des raisons de sécurité. Si nécessaire, utilisez des URLs complètes plutôt que des communications JavaScript entre iframes.
