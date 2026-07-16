<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'email',
    'name',
    'preferred_language',
    'is_active',
    'subscribed_at',
    'unsubscribed_at',
    'verification_token',
    'verified_at',
])]
class NewsletterSubscriber extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'subscribed_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }
}
