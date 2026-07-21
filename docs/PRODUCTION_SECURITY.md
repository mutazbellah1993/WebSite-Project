# EliteData Production Security Checklist

This project uses Laravel Fortify with the `web` guard and session-based authentication. Production should be configured with secure cookies, HTTPS, and private environment secrets.

## Required Production Settings

- Generate a new production `APP_KEY` on the production server. Do not reuse the local development key.
- Serve the application only over HTTPS.
- Keep `APP_DEBUG=false` in production.
- Never commit `.env` or any file containing real credentials.
- Use `SESSION_DRIVER=database` so sessions are stored server-side.
- Use a production-only session cookie name such as `elitedata_session`.
- Set `SESSION_SECURE_COOKIE=true` after HTTPS is configured.
- Keep `SESSION_HTTP_ONLY=true` so JavaScript cannot read the session cookie.
- Keep `SESSION_SAME_SITE=lax` unless a reviewed integration requires a stricter setting.
- Set `SESSION_ENCRYPT=true` for encrypted session payloads.

## Administrator Account Handling

- Create the first administrator on the production server, then remove or rotate any seed password immediately.
- Do not leave reusable admin seed passwords in code, deployment scripts, tickets, or shared notes.
- Enable two-factor authentication for the super administrator.
- Use distinct administrator accounts for each person.
- Disable inactive administrator accounts instead of sharing or reusing them.

## Deployment Notes

- Do not deploy with local `.env` values.
- Do not expose database, mail, or admin passwords in `.env.production.example`.
- Review file permissions so the web server can write only to required Laravel storage and cache paths.
- Run migrations during a controlled deployment window and back up the production database first.
- Rotate credentials immediately if a production `.env` or backup is exposed.
