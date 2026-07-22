<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        return response((string) file_get_contents(public_path('robots.txt')), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
