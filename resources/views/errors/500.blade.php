<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Server Error - ELITEDATA</title>
        <meta name="robots" content="noindex,nofollow">
        <style>
            body {
                margin: 0;
                background: #061b3a;
                color: #ffffff;
                font-family: Manrope, "IBM Plex Sans Arabic", Arial, sans-serif;
            }

            main {
                display: grid;
                min-height: 100vh;
                place-items: center;
                padding: 32px;
            }

            section {
                max-width: 720px;
                text-align: center;
            }

            img {
                max-width: 240px;
                height: auto;
                padding: 10px;
                border-radius: 8px;
                background: #ffffff;
            }

            h1 {
                margin: 32px 0 12px;
                font-size: clamp(2.25rem, 7vw, 4.5rem);
                line-height: 1;
            }

            p {
                color: #d7e4f2;
                font-size: 1.125rem;
                line-height: 1.8;
            }

            a {
                display: inline-flex;
                margin-top: 24px;
                border-radius: 6px;
                background: #22c7cf;
                color: #061b3a;
                padding: 12px 18px;
                font-weight: 800;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <main>
            <section>
                <img src="/brand/elitedata-official-logo.png" alt="ELITEDATA">
                <h1>500</h1>
                <p>Something went wrong. Please try again later.</p>
                <a href="{{ route('home') }}">Return Home</a>
            </section>
        </main>
    </body>
</html>
