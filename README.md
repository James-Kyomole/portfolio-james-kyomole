# Portfolio — MUHINDO KYOMOLE James

Site portfolio professionnel, bilingue (FR/EN), avec un espace administrateur permettant de modifier tout le contenu sans toucher au code.

## Structure du projet

```
index.html                 Page principale (une seule page, sections ancrées)
assets/css/style.css       Styles du site public
assets/js/main.js          Rendu dynamique du contenu + traduction FR/EN + graphiques
assets/img/                Photos et favicons optimisés pour le web
data/content.json          TOUT le contenu du site (source unique, bilingue)
data/*.xlsx                Fichiers Excel téléchargeables liés aux projets
cv/CV_James_Kyomole.pdf    CV téléchargeable
admin/index.html           Espace administrateur (édition du contenu)
admin/admin.js             Logique de connexion GitHub + sauvegarde
```

Le site est 100% statique (HTML/CSS/JS, aucun serveur ni base de données requis) : il peut être hébergé gratuitement sur Vercel via GitHub.

## Modifier le contenu

Deux façons :

1. **Recommandée : l'espace admin** (`/admin`) — interface graphique, enregistre directement dans GitHub, republiée automatiquement par Vercel. Voir le guide fourni dans la conversation pour la configuration du jeton GitHub.
2. **Directe : éditer `data/content.json`** à la main, committer et pousser — utile pour de gros changements ou en cas de souci avec l'admin.

⚠️ Avant de publier le site, pensez à :
- Changer `GATE_PASS` dans `admin/admin.js` (phrase de passage de l'écran d'accueil admin — pas une vraie sécurité, juste un filtre).
- Remplacer `contact.formspreeEndpoint` dans `data/content.json` par votre propre URL Formspree (voir guide).

## Développement local

Comme le site charge `data/content.json` via `fetch`, ouvrir `index.html` directement dans le navigateur (`file://`) ne fonctionne pas (le navigateur bloque cette requête). Lancez un petit serveur local :

```bash
python -m http.server 8090
```

puis ouvrez `http://localhost:8090`.
