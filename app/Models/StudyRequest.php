<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'request_number',
    'full_name',
    'email',
    'phone',
    'organization',
    'job_title',
    'client_type',
    'service_type',
    'study_title',
    'project_description',
    'objectives',
    'target_population',
    'geographic_scope',
    'estimated_sample_size',
    'desired_start_date',
    'desired_end_date',
    'estimated_budget',
    'budget_currency',
    'attachment_path',
    'preferred_language',
    'status',
    'assigned_to',
    'internal_notes',
    'proposal_sent_at',
    'closed_at',
])]
class StudyRequest extends Model
{
    use SoftDeletes;

    public const STATUSES = [
        'new',
        'reviewing',
        'clarification_needed',
        'proposal_sent',
        'accepted',
        'rejected',
        'closed',
    ];

    public const CLIENT_TYPES = ['business', 'ngo', 'government', 'university', 'researcher', 'individual', 'other'];

    protected function casts(): array
    {
        return [
            'desired_start_date' => 'date',
            'desired_end_date' => 'date',
            'estimated_budget' => 'decimal:2',
            'proposal_sent_at' => 'datetime',
            'closed_at' => 'datetime',
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
