# YASS Parfumerie Backend API

Backend REST API (Node.js + Express + Prisma + MySQL) pour gérer le contenu du site YASS Parfumerie sans modifier le frontend HTML existant.

## Stack

- Node.js / Express.js
- MySQL
- Prisma ORM
- JWT + bcrypt
- Multer (upload image)
- Zod (validation)
- dotenv
- Morgan
- Helmet + CORS
- Swagger (`/api/docs`)

## Installation

```bash
cd backend
npm install
```

## Variables d'environnement

Copiez le modèle et complétez les valeurs:

```bash
cp .env.example .env
```

Variables principales:

- `DATABASE_URL` : connexion MySQL Hostinger
- `JWT_SECRET` : secret JWT (>=32 caractères)
- `PORT` : port API (défaut `4000`)
- `CORS_ORIGIN` : origine frontend autorisée (ou liste séparée par virgules)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` : admin de seed (`ADMIN_PASSWORD` obligatoire)

## Prisma: migration et seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Production (déploiement migrations):

```bash
npm run prisma:deploy
```

## Lancement

Développement:

```bash
npm run dev
```

Production:

```bash
npm start
```

Healthcheck:

- `GET /api/health`

Swagger:

- `GET /api/docs`

## Structure du projet

```text
backend/
  controllers/
  routes/
  middlewares/
  models/          # schémas Zod
  services/
  uploads/
  prisma/
    migrations/
    schema.prisma
    seed.js
  config/
  utils/
  app.js
  server.js
  .env.example
  README.md
```

## Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout` (JWT)
- `GET /api/auth/me` (JWT)

### Produits

- `GET /api/products` (filtres: categorie, prixMin, prixMax, featured, promotion, recherche, tri, page, limit)
- `GET /api/products/:id`
- `POST /api/products` (JWT)
- `PUT /api/products/:id` (JWT)
- `DELETE /api/products/:id` (JWT)

### Upload

- `POST /api/upload` (JWT, champ `image`, JPG/PNG/WEBP, max 5 Mo)

### Catégories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories` (JWT)
- `PUT /api/categories/:id` (JWT)
- `DELETE /api/categories/:id` (JWT)

### Paramètres du site

- `GET /api/settings`
- `PUT /api/settings` (JWT)

Champs gérés: `nomBoutique`, `telephone`, `whatsapp`, `adresse`, `email`, `facebook`, `instagram`, `tiktok`, `logo`, `banniere`, `messageAccueil`, `livraison`, `politiqueRetour`, `conditions`.

### Dashboard

- `GET /api/dashboard` (JWT)

Retourne:

- nombre produits
- nombre catégories
- produits actifs
- produits en rupture
- produits en promotion
- derniers produits ajoutés

## Notes frontend

Le frontend HTML peut consommer directement l'API via `fetch()` pour charger dynamiquement produits, catégories et paramètres du site.
