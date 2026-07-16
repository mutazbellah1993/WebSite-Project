<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $type
 * @property string $status
 * @property string $locale
 * @property string|null $organization
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $sector
 * @property string|null $service_interest
 * @property string|null $subject
 * @property string|null $timeline
 * @property string $message
 * @property Carbon|null $reviewed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'type',
    'status',
    'locale',
    'organization',
    'name',
    'email',
    'phone',
    'sector',
    'service_interest',
    'subject',
    'timeline',
    'message',
    'reviewed_at',
])]
class PublicInquiry extends Model
{
    public const TYPE_STUDY_REQUEST = 'study_request';

    public const TYPE_CONTACT_MESSAGE = 'contact_message';

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }
}
