# EliteData Production Deployment - Plesk

This document is for the first production launch of the current EliteData Laravel application. Do not store real credentials in this file or commit a production `.env`.

## Plesk Paths

- Project root: set this to the Laravel application directory on the server, for example `/var/www/vhosts/elitedata.pro/elitedata-app`.
- Document root: must point to the Laravel `public/` directory, for example `/var/www/vhosts/elitedata.pro/elitedata-app/public`.
- Do not point the domain document root to the project root.

## Server Requirements

- PHP 8.3 or newer.
- MySQL compatible database.
- Composer 2.
- Node.js and npm only if building frontend assets on the server.
- PHP extensions: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pdo_mysql`, `session`, `tokenizer`, `xml`, `zip`.

## Writable Directories

Ensure the web server user can write to:

```bash
storage
bootstrap/cache
```

Do not make the entire project world-writable.

## Production Environment

1. Copy `.env.production.example` to `.env` on the server.
2. Set a new production `APP_KEY` with `php artisan key:generate --force`.
3. Fill database credentials, SMTP credentials, and `ELITEDATA_LEADS_NOTIFICATION_EMAIL`.
4. Keep `APP_ENV=production` and `APP_DEBUG=false`.
5. Keep HTTPS enabled and `SESSION_SECURE_COOKIE=true`.
6. Never commit `.env`.

## Install Commands

From the project root:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Frontend Build

Preferred strategy: build locally or in CI, then upload the full project including `public/build`.

If building on the server:

```bash
npm ci
npm run build
```

After building, `node_modules` is not required for runtime.

## Seed Commands

Run only after a database backup and only when initial content is needed:

```bash
php artisan db:seed --class=SiteSettingSeeder --force
php artisan db:seed --class=InitialAdminSeeder --force
php artisan db:seed --class=ServiceIndustrySeeder --force
```

`ResearchContentSeeder` is development-only for categories and exits in production.

Remove or rotate any temporary initial admin password immediately after the first administrator is created.

## Queue Worker

The production example uses `QUEUE_CONNECTION=database`. Configure a Plesk process manager, systemd service, or supervised command if queued jobs are added or enabled:

```bash
php artisan queue:work --sleep=3 --tries=3 --timeout=90
```

Restart workers after each deployment:

```bash
php artisan queue:restart
```

The current launch notifications are sent after database writes and are guarded so email failures do not lose submissions.

## Scheduled Tasks

No project-specific scheduled tasks are required for the current launch scope. If future scheduled jobs are added, configure Plesk to run:

```bash
php artisan schedule:run
```

once per minute.

## Rollback and Backup

- Back up the database before each deployment.
- Keep a copy of the previous release directory or archive.
- If a deployment fails before migrations, switch Plesk back to the previous release.
- If a deployment fails after migrations, review the migration rollback path and database backup before running destructive commands.
- Do not run `migrate:fresh` in production.

## Post-Deployment Verification

Check:

- `/`
- `/about-us`
- `/services`
- `/industries`
- `/research-and-insights`
- `/request-a-study`
- `/contact-us`
- `/privacy-policy`
- `/terms-of-use`
- `/sitemap.xml`
- `/robots.txt`
- `/login`
- `/admin`

Then submit one test contact inquiry and one test study request, confirm records appear in `/admin`, confirm notification email delivery, and remove the test records if needed.
