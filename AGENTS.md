# AGENTS.md

## Project

ELITEDATA corporate website, built with Laravel, Inertia.js, React, TypeScript, Tailwind CSS, Vite, and MySQL.

## Working Rules

- Keep the project deployable to a private online server; do not assume Laravel Cloud, Supabase, or an external site builder.
- Do not deploy from this workspace unless the user explicitly asks for deployment.
- Build the public corporate website incrementally. Do not create every page, a CMS, or an admin dashboard in one pass.
- Preserve full Arabic RTL and English LTR support. Locale-aware UI should read direction from the Inertia `locale` shared prop.
- Prefer reusable React components under `resources/js/components` and page-level composition under `resources/js/pages`.
- Keep server-side routing and data ownership in Laravel controllers, middleware, requests, and models.
- Keep secrets out of Git. Use `.env.example` for placeholders only.

## Commands

```bash
composer install
npm install
php artisan test
npm run build
```

## Notes

- The official Laravel React starter kit is the base scaffold.
- MySQL is configured in `.env.example`; tests use in-memory SQLite through `phpunit.xml`.
- The generated starter authentication files are present, but no ELITEDATA marketing pages or admin dashboard have been built yet.
