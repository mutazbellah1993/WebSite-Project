<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'email',
    'phone',
    'organization',
    'subject',
    'message',
    'preferred_language',
    'status',
    'assigned_to',
    'internal_notes',
    'source',
    'ip_address',
    'user_agent',
    'responded_at',
])]
class Inquiry extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
