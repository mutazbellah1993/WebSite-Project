# EliteData Content Management

Services, industries, content categories, and insights are managed from the authenticated admin area:

- `/admin/services`
- `/admin/industries`
- `/admin/content-categories`
- `/admin/insights`

Only active users with admin access can view these screens. Write operations are authorized server-side through policies:

- `super_admin`, `admin`, and `editor` can create, update, publish, archive, soft delete, and restore supported records.
- `viewer` can read admin content screens but cannot modify records.
- inactive users remain blocked by `admin.access`.

## Public Content Source

The public home, services, industries, and research pages load published records from the database.

- Services page: `services.status = published`
- Industries page: `industries.status = published`
- Homepage featured services: `services.status = published` and `services.is_featured = true`
- Research listing: `insights.status = published` and `published_at` is empty or in the past
- Research detail: resolves by `insights.slug` and returns 404 for draft, archived, deleted, or future-scheduled records
- Report PDFs: served only through the controlled Laravel download route for published `report` records

Records with `draft`, `archived`, or `deleted_at` values are not exposed publicly.

For local development, the services and industries React pages keep the original static TypeScript content as a fallback only when there are no published database records for that content type. The controller exposes `hasPublishedServices` and `hasPublishedIndustries` so the frontend can decide whether to use database records or the static fallback.

Research and Insights does not use fake static publications as a fallback. It shows approved database records only.

## Insight Uploads

- Cover images are validated as JPG, PNG, or WebP, limited to 5 MB, and stored on the Laravel `public` disk under `insights/covers`.
- Report attachments are validated as PDF only, limited to 20 MB, and stored on the Laravel `local` disk under `insights/reports`.
- Original filenames are not trusted. Laravel stores generated UUID filenames.
- PDF paths are not exposed publicly. Downloads go through `/research-and-insights/{slug}/download`.
- Body HTML is sanitized server-side to a small safe tag set before storage and again before public rendering.

## Seeder Usage

`Database\Seeders\ServiceIndustrySeeder` creates the real EliteData service and industry structure with Arabic and English content. It uses `updateOrCreate` for repeatable local seeding.

In production, existing service and industry records are preserved so manually edited content is not overwritten by a later seed run. Missing records can still be created.

`Database\Seeders\ResearchContentSeeder` is an optional development seeder for content categories only. It does not create fake articles, reports, research results, clients, achievements, or statistics. It exits without changes in production.

Local commands:

```bash
php artisan db:seed --class=ServiceIndustrySeeder
php artisan db:seed --class=ResearchContentSeeder
```

Run production seed commands only during a controlled deployment window after a database backup.
