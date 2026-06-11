# express-prisma-postgres-api

Mini API REST Express moderne pour démontrer une stack backend TypeScript propre, testable et orientée production.

## Stack retenue pour 2026

- **Express 5.x** : Express 5 est la ligne stable actuelle, avec support direct des handlers `async` qui propagent les promesses rejetées au middleware d'erreur.
- **Node.js 22+ ou 24 LTS** : le projet accepte Node 22 LTS pour une installation Windows simple, tout en restant compatible Node 24 LTS.
- **TypeScript 5.9.x** : version recommandée par Prisma 7 au moment de la génération de ce repo.
- **Prisma 7.x + PostgreSQL** : client généré hors `node_modules`, config CLI dans `prisma.config.ts`, et driver adapter PostgreSQL obligatoire.
- **Zod 4.x** : validation runtime typée pour body, params, query et variables d'environnement.
- **JWT via jose** : lib ESM moderne, sans dépendance runtime.
- **Vitest + Supertest** : tests d'intégration HTTP rapides.

## Fonctionnalités

- Healthcheck : `GET /health`
- Auth JWT : `POST /api/v1/auth/login`
- Utilisateurs : inscription, profil courant, lecture, liste admin
- Posts : CRUD minimal avec contrôle propriétaire/admin
- Sécurité : Helmet, CORS contrôlé, rate limiting, JSON body limit, logs structurés, erreurs normalisées
- Database : PostgreSQL 17, Prisma Migrate, seed de démo
- Qualité : TypeScript strict, architecture modulaire, services/repositories séparés, tests d'intégration

## Architecture

```txt
src/
  app.ts                       # Composition Express
  server.ts                    # Bootstrap HTTP + shutdown
  config/                      # Env + CORS
  errors/                      # AppError + error handler
  health/                      # Healthcheck
  lib/                         # Prisma, logger, helpers
  middleware/                  # 404
  modules/
    auth/                      # JWT, login, middleware auth
    users/                     # Users routes/controllers/services/repositories
    posts/                     # Posts routes/controllers/services/repositories
  routes/                      # API v1 router
  types/                       # Express request augmentation
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  *.test.ts
```

## Prérequis

- Node.js 22.12+ ou 24 LTS
- npm 11+
- PostgreSQL 17+
- Docker Desktop est optionnel, uniquement si tu veux lancer PostgreSQL en container.

## Installation rapide avec Docker, optionnelle

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Installation Windows sans Docker ni Linux

Installe PostgreSQL nativement sur Windows, puis crée les deux bases utilisées par Prisma :

```powershell
npm install
Copy-Item .env.windows.example .env

# Si psql est dans le PATH
psql -U postgres -h localhost -p 5432 -f scripts/create-databases.sql

# Sinon, adapte le chemin selon ta version PostgreSQL
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -f scripts/create-databases.sql

npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Si tu as choisi un autre mot de passe que `postgres` pendant l'installation PostgreSQL, modifie `DATABASE_URL` et `SHADOW_DATABASE_URL` dans `.env`.

API disponible sur `http://localhost:3000`.

## Comptes de démo

```txt
admin@example.com / password123
jane@example.com  / password123
```

## Exemples curl

### Healthcheck

```bash
curl http://localhost:3000/health
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Créer un post

```bash
TOKEN="copier_le_token_ici"

curl -X POST http://localhost:3000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Express 5 + Prisma 7","content":"Post créé via JWT.","published":true}'
```

### Lister les posts publiés

```bash
curl "http://localhost:3000/api/v1/posts?published=true&page=1&limit=10"
```

## Scripts utiles

```bash
npm run dev          # API en watch mode
npm run build        # build TypeScript
npm run start        # lance dist/server.js
npm run typecheck    # vérification TypeScript stricte
npm run lint         # lint strict
npm run test         # tests Vitest
npm run db:studio    # Prisma Studio
npm run docker:down  # stop + suppression volume Postgres
```

## Workflow de test

Les tests sont des tests d'intégration HTTP. Ils utilisent la base configurée dans `DATABASE_URL` et réinitialisent les tables avant chaque test.

Avec Docker :

```bash
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:migrate
npm run test
```

Sur Windows sans Docker :

```powershell
Copy-Item .env.windows.example .env
psql -U postgres -h localhost -p 5432 -f scripts/create-databases.sql
npm run db:generate
npm run db:migrate
npm run test
```

## Endpoints

| Méthode | Route | Auth | Rôle | Description |
|---|---|---:|---:|---|
| GET | `/health` | Non | - | Healthcheck |
| POST | `/api/v1/auth/login` | Non | - | Login JWT |
| POST | `/api/v1/users` | Non | - | Inscription |
| GET | `/api/v1/users/me` | Oui | USER/ADMIN | Profil courant |
| GET | `/api/v1/users` | Oui | ADMIN | Liste utilisateurs |
| GET | `/api/v1/users/:id` | Oui | USER/ADMIN | Détail utilisateur |
| GET | `/api/v1/posts` | Non | - | Liste posts |
| GET | `/api/v1/posts/:id` | Non | - | Détail post |
| POST | `/api/v1/posts` | Oui | USER/ADMIN | Créer post |
| PUT | `/api/v1/posts/:id` | Oui | Owner/ADMIN | Modifier post |
| DELETE | `/api/v1/posts/:id` | Oui | Owner/ADMIN | Supprimer post |


## Dépannage Windows

### `P1001: Can't reach database server at localhost:5432`

PostgreSQL n'est pas démarré, n'écoute pas sur le port `5432`, ou les identifiants de `.env` ne correspondent pas. Vérifie dans `services.msc` que le service `postgresql-x64-*` est en cours d'exécution, puis teste :

```powershell
psql -U postgres -h localhost -p 5432 -c "SELECT version();"
```

### `psql` n'est pas reconnu

Ajoute le dossier `bin` de PostgreSQL au `PATH`, ou utilise le chemin complet :

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432
```

### Mot de passe PostgreSQL différent

Encode les caractères spéciaux dans l'URL si besoin. Exemple avec le mot de passe `my password@123` :

```env
DATABASE_URL=postgresql://postgres:my%20password%40123@localhost:5432/express_prisma_postgres_api?schema=public
```

## Notes senior

- Express 5 permet d'écrire des controllers `async` sans wrapper maison.
- Prisma 7 nécessite `type: "module"`, un `output` explicite pour le client, et `@prisma/adapter-pg` avec `pg`.
- Les validations Zod restent dans les controllers afin de garder les routes simples et de ne pas polluer les types Express.
- Les erreurs métier utilisent `AppError`; les erreurs Zod sont formatées dans un middleware unique.
- Le client Prisma est instancié une seule fois pour cette API longue durée.
- Les routes protégées lisent `request.authUser`, alimenté uniquement par le middleware JWT.

## Préparer le push GitHub

```bash
git init
git add .
git commit -m "feat: add modern express prisma postgres api example"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/express-prisma-postgres-api.git
git push -u origin main
```

## CI GitHub Actions

Un workflow est inclus dans `.github/workflows/ci.yml` : installation, génération Prisma, migrations, typecheck, lint et tests sur PostgreSQL 17.

## Local UI / UX demo

This project is still backend-first, but it includes a small local developer UI so the API can be demonstrated without Postman.

Once the server is running:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

The UI lets you:

- check `/health`
- login with the seeded admin account
- store the JWT locally in the browser
- call `/api/v1/users/me`
- list posts
- create posts through the authenticated API
- inspect raw API responses

Seeded credentials:

```text
admin@example.com / password123
user@example.com / password123
```

The OpenAPI document is also available at:

```text
http://127.0.0.1:3000/openapi.json
```

For database inspection, you can also launch Prisma Studio:

```powershell
npm run db:studio
```

Then open the URL displayed by Prisma, usually:

```text
http://localhost:5555
```
