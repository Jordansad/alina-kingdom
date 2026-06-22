# ALINA KINGDOM – Site Vitrine

Site web statique professionnel pour **ALINA KINGDOM**, programme de séjours touristiques au Bénin.

---

## Structure des fichiers

```
alina-kingdom/
├── index.html          → Page principale (toutes sections)
├── css/
│   └── style.css       → Styles (variables CSS, responsive)
├── js/
│   ├── main.js         → Interactions (nav, lightbox, formulaire)
│   └── i18n.js         → Système multilingue FR / EN / IT
├── images/
│   └── logo.jpeg       → Logo ALINA KINGDOM
└── README.md           → Ce fichier
```

---

## Déploiement rapide

### Option 1 – Netlify Drop (gratuit, 0 configuration)
1. Allez sur [netlify.com/drop](https://app.netlify.com/drop)
2. Glissez-déposez le dossier `alina-kingdom/` entier
3. Votre site est en ligne immédiatement avec une URL Netlify

### Option 2 – GitHub Pages
```bash
git init
git add .
git commit -m "Initial ALINA KINGDOM website"
git remote add origin https://github.com/VOTRE_COMPTE/alina-kingdom.git
git push -u origin main
# Activez GitHub Pages dans Settings → Pages → Source: main
```

### Option 3 – Hébergement classique (OVH, Infomaniak, etc.)
- Téléversez tous les fichiers via FTP dans `/public_html/`
- Aucune configuration serveur requise (site statique)

---

## Personnalisation du contenu

### 1. Remplacer les photos

Recherchez les commentaires `<!-- TODO: Remplacez ... -->` dans `index.html`.

Remplacez les URLs Unsplash par vos vraies photos. Pour chaque image :
```html
<!-- Avant -->
<img src="https://images.unsplash.com/..." />

<!-- Après -->
<img src="images/nom-de-votre-photo.jpg" />
```

**Tailles recommandées :**
| Zone | Dimensions | Format |
|------|-----------|--------|
| Hero | 1920×1080 | WebP/JPG |
| Programmes | 800×450 | WebP/JPG |
| Galerie | 800×600 | WebP/JPG |
| À propos | 900×1125 | WebP/JPG |

**Sources photos gratuites :**
- [Unsplash](https://unsplash.com) → recherchez "Benin culture", "Vodun festival", "Africa tourism"
- [Pexels](https://pexels.com) → recherchez "West Africa", "Benin"

### 2. Mettre à jour les informations de contact

Dans `index.html`, recherchez et remplacez :
- `contact@alinakingdom.com` → votre email réel
- `+22901524141733` → votre numéro WhatsApp (format international sans espaces)
- Les liens `href="#"` des réseaux sociaux → vos URLs réelles

### 3. Modifier les textes

**Pour le français :** Modifiez directement `index.html` (attributs `data-i18n` ignorés si vous supprimez le système i18n)

**Pour les traductions :** Ouvrez `js/i18n.js` et modifiez les valeurs dans les objets `fr`, `en`, `it`.

---

## Fonctionnalités

| Fonctionnalité | Statut |
|---------------|--------|
| Multilingue FR/EN/IT | ✅ Opérationnel |
| Navigation sticky | ✅ Opérationnel |
| Menu hamburger mobile | ✅ Opérationnel |
| Animations au scroll | ✅ Opérationnel |
| Galerie + lightbox | ✅ Opérationnel |
| Bouton WhatsApp flottant | ✅ Opérationnel |
| Formulaire + validation JS | ✅ Opérationnel |
| SEO meta tags | ✅ En place |
| Responsive (mobile/tablette/desktop) | ✅ Opérationnel |

### Formulaire de contact
Le formulaire valide les champs côté client. Pour recevoir les messages, vous avez 3 options :
1. **Formspree** (gratuit) : changez `action` du form et retirez `e.preventDefault()`
2. **Netlify Forms** : ajoutez `netlify` au `<form>` (fonctionne automatiquement sur Netlify)
3. **EmailJS** : service d'envoi d'emails depuis le navigateur

---

## Maintenance

### Mettre à jour les dates de programmes
Dans `js/i18n.js`, modifiez les clés `prog1.dates` et `prog2.dates` dans les 3 langues.

### Ajouter une photo à la galerie
Dans `index.html`, dupliquez un bloc `.galerie__item` existant et mettez à jour :
- `data-src` → URL haute résolution pour la lightbox
- `data-caption` → Légende
- `src` de l'`<img>` → URL miniature

### Modifier la palette de couleurs
Dans `css/style.css`, modifiez les variables CSS au début du fichier :
```css
:root {
  --c-green:  #2D6A4F;  /* Vert forêt */
  --c-gold:   #F4A823;  /* Or/Jaune */
  --c-ochre:  #C1440E;  /* Ocre/Rouge */
  --c-cream:  #FAF7F0;  /* Blanc cassé */
  --c-dark:   #1A1A1A;  /* Noir doux */
}
```

---

## Crédits
- **Fonts** : [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [Lato](https://fonts.google.com/specimen/Lato) via Google Fonts
- **Photos placeholder** : [Unsplash](https://unsplash.com)
- **Icônes** : SVG vanilla (aucune dépendance externe)
- **Frameworks** : Aucun – HTML/CSS/JS vanilla uniquement

---

*Site développé pour ALINA KINGDOM – Tourisme au Bénin*
