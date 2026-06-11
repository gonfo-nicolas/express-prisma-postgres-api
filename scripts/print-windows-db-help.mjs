console.log(`
Windows native PostgreSQL setup

1. Install PostgreSQL for Windows.
2. Start the PostgreSQL service.
3. Create the two databases used by Prisma:

   psql -U postgres -h localhost -p 5432 -f scripts/create-databases.sql

   If psql is not in your PATH, use the full path, for example:

   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -f scripts/create-databases.sql

4. If your postgres password is not "postgres", update DATABASE_URL and SHADOW_DATABASE_URL in .env.
5. Then run:

   npm run db:migrate
   npm run db:seed
   npm run dev
`);
