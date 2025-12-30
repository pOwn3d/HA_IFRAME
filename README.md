<!-- Header Banner -->
<div align="center">

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&duration=3000&pause=1000&color=41BDF5&center=true&vCenter=true&width=600&lines=Kids+Points+System;Home+Assistant+Integration;Smart+Home+Dashboard" alt="Typing SVG" />
  </a>

  <br><br>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.2-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux">
  <img src="https://img.shields.io/badge/MUI-5.15-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI">
  <img src="https://img.shields.io/badge/Home_Assistant-Ready-41BDF5?style=for-the-badge&logo=homeassistant&logoColor=white" alt="Home Assistant">

  <br><br>

  <img src="https://img.shields.io/github/stars/pOwn3d/HA_IFRAME?style=social" alt="Stars">
  <img src="https://img.shields.io/github/forks/pOwn3d/HA_IFRAME?style=social" alt="Forks">

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## About

> **Kids Points System for Home Assistant** - Une application React permettant de gerer un systeme de points pour enfants, integrable dans Home Assistant via iframes.

<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/color/96/plus.png" width="50"/><br>
      <b>Gestion Points</b><br>
      <sub>Ajouter, retirer, echanger</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/color/96/gift.png" width="50"/><br>
      <b>Recompenses</b><br>
      <sub>Seuils personnalisables</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/color/96/target.png" width="50"/><br>
      <b>Defis</b><br>
      <sub>Challenges quotidiens</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.icons8.com/color/96/home.png" width="50"/><br>
      <b>Home Assistant</b><br>
      <sub>Integration native</sub>
    </td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,redux,materialui,nodejs&theme=dark" alt="Tech Stack"/>

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## Features

- Gestion des points (ajouter, retirer, echanger)
- Systeme de recompenses base sur des seuils
- Defis quotidiens personnalisables
- Tableau de bord parent et vues enfants
- Authentification avec code parental
- Themes specifiques par enfant
- Persistance localStorage
- Reinitialisation automatique quotidienne
- Interface moderne et attrayante
- **Pages independantes pour Home Assistant**

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## Quick Start

```bash
# Clone
git clone https://github.com/pOwn3d/HA_IFRAME.git
cd HA_IFRAME

# Install
npm install

# Run
npm start
```

Application accessible sur [http://localhost:3000](http://localhost:3000)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## Home Assistant Integration

### Main Pages

| Route | Description |
|-------|-------------|
| `/login` | Page de connexion |
| `/dashboard` | Tableau de bord parent |
| `/child/noa` | Vue pour Noa |
| `/child/nathan` | Vue pour Nathan |

### Standalone Widgets

| Route | Description |
|-------|-------------|
| `/standalone/points/noa` | Affichage points |
| `/standalone/challenge/noa` | Defi du jour |
| `/standalone/history/noa` | Historique recent |

### Action Pages

| Route | Description |
|-------|-------------|
| `/actions/add-points/noa` | Ajouter des points |
| `/actions/remove-points/noa` | Retirer des points |
| `/actions/redeem-reward/noa` | Echanger recompense |
| `/actions/complete-challenge/noa` | Valider defi |

### Home Assistant YAML Example

```yaml
# Dashboard iframe
type: iframe
url: http://your-server:3000/dashboard
aspect_ratio: 16:9

# Points widget
type: iframe
url: http://your-server:3000/standalone/points/noa
aspect_ratio: 3:1

# Action button
type: button
name: Ajouter des points
icon: mdi:plus-circle
tap_action:
  action: url
  url_path: http://your-server:3000/actions/add-points/noa
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## Project Structure

```
src/
├── app/              # Redux store & localStorage
├── features/         # Feature modules
├── pages/            # Page components
│   ├── auth/         # Login
│   ├── dashboard/    # Parent dashboard
│   ├── childView/    # Child views
│   ├── actions/      # Action pages
│   └── standalone/   # Iframe widgets
└── ...
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

## Customization

Access settings to:
- Modify parental code
- Adjust point thresholds
- Configure daily reset time
- Customize themes per child

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="line">

<div align="center">

### Author

**Made with passion by [Christophe Lopez](https://github.com/pOwn3d)**

<a href="https://www.linkedin.com/in/christophe-lopez/">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
<a href="https://github.com/pOwn3d">
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>

<br><br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>

<!-- Update 2025-12-30 -->
