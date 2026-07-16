# EliteData Database Package

Production-ready database structure for **ELITEDATA - Research, Statistics & Data Analytics**.

## Modules

- Admin users and roles
- Bilingual CMS pages
- Services and industries
- Case studies
- Research articles, reports, insights, and categories
- Methodology steps and team members
- Testimonials
- Contact inquiries
- Detailed study requests
- Newsletter subscribers
- Media library
- Site settings
- Audit logs

## Laravel Integration

This project uses Laravel migrations only. Do not import a standalone SQL schema into the same database.

Required admin seed variables, set only in the environment where the admin should be created:

```env
ELITEDATA_ADMIN_NAME="Your Name"
ELITEDATA_ADMIN_EMAIL="your-email@example.com"
ELITEDATA_ADMIN_PASSWORD="use-a-strong-password"
ELITEDATA_ADMIN_LOCALE="en"
```

Local setup:

```bash
php artisan migrate
php artisan db:seed --class=SiteSettingSeeder
php artisan db:seed --class=InitialAdminSeeder
```

Production setup:

```bash
php artisan migrate --force
php artisan db:seed --class=SiteSettingSeeder --force
php artisan db:seed --class=InitialAdminSeeder --force
php artisan optimize
```
