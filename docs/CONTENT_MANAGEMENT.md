# EliteData Services and Industries Content

Services and industries are managed from the authenticated admin area:

- `/admin/services`
- `/admin/industries`

Only active users with admin access can view these screens. Write operations are authorized server-side through policies:

- `super_admin`, `admin`, and `editor` can create, update, publish, archive, soft delete, and restore records.
- `viewer` can read admin content screens but cannot modify records.
- inactive users remain blocked by `admin.access`.

## Public Content Source

The public home, services, and industries pages load published records from the database.

- Services page: `services.status = published`
- Industries page: `industries.status = published`
- Homepage featured services: `services.status = published` and `services.is_featured = true`
- Records with `draft`, `archived`, or `deleted_at` values are not exposed publicly.

For local development, the React pages keep the original static TypeScript content as a fallback only when there are no published database records for that content type. The controller exposes `hasPublishedServices` and `hasPublishedIndustries` so the frontend can decide whether to use database records or the static fallback.

## Seeder Usage

`Database\Seeders\ServiceIndustrySeeder` creates the real EliteData service and industry structure with Arabic and English content. It uses `updateOrCreate` for repeatable local seeding.

In production, existing service and industry records are preserved so manually edited content is not overwritten by a later seed run. Missing records can still be created.

Local command:

```bash
php artisan db:seed --class=ServiceIndustrySeeder
```

Run production seed commands only during a controlled deployment window after a database backup.
