<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'industry_id',
    'slug',
    'client_name',
    'is_client_public',
    'title_en',
    'title_ar',
    'summary_en',
    'summary_ar',
    'challenge_en',
    'challenge_ar',
    'methodology_en',
    'methodology_ar',
    'solution_en',
    'solution_ar',
    'results_en',
    'results_ar',
    'featured_image_path',
    'live_url',
    'completion_date',
    'is_featured',
    'status',
    'published_at',
    'seo_title_en',
    'seo_title_ar',
    'seo_description_en',
    'seo_description_ar',
])]
class CaseStudy extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'is_client_public' => 'boolean',
            'is_featured' => 'boolean',
            'completion_date' => 'date',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @param  Builder<CaseStudy>  $query
     * @return Builder<CaseStudy>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', 'published')
            ->where(function (Builder $query): void {
                $query
                    ->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

    public function isPubliclyAvailable(): bool
    {
        return $this->status === 'published'
            && $this->deleted_at === null
            && ($this->published_at === null || $this->published_at->isPast());
    }

    /**
     * Paths starting with "/" are files shipped in /public (for example /images/projects/...); anything else is on the public disk.
     */
    public function coverImageUrl(): ?string
    {
        if (! $this->featured_image_path) {
            return null;
        }

        if (str_starts_with($this->featured_image_path, '/')) {
            return $this->featured_image_path;
        }

        return Storage::disk('public')->url($this->featured_image_path);
    }

    /**
     * Only http(s) links are exposed as the live deliverable.
     */
    public function liveUrl(): ?string
    {
        return filled($this->live_url) && preg_match('#^https?://#i', (string) $this->live_url) === 1 ? $this->live_url : null;
    }

    /**
     * @return BelongsTo<Industry, $this>
     */
    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
