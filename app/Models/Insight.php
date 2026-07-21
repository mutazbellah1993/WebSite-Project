<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

#[Fillable([
    'author_id',
    'type',
    'slug',
    'title_en',
    'title_ar',
    'excerpt_en',
    'excerpt_ar',
    'body_en',
    'body_ar',
    'cover_image_path',
    'attachment_path',
    'is_featured',
    'status',
    'published_at',
    'seo_title_en',
    'seo_title_ar',
    'seo_description_en',
    'seo_description_ar',
])]
class Insight extends Model
{
    use SoftDeletes;

    public const TYPES = ['article', 'report', 'insight', 'news'];

    public const STATUSES = ['draft', 'published', 'archived'];

    protected static function booted(): void
    {
        static::forceDeleted(function (Insight $insight): void {
            $insight->deleteStoredFiles();
        });
    }

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return BelongsToMany<ContentCategory, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ContentCategory::class);
    }

    /**
     * @param  Builder<Insight>  $query
     * @return Builder<Insight>
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

    public function coverImageUrl(): ?string
    {
        if (! $this->cover_image_path) {
            return null;
        }

        return Storage::disk('public')->url($this->cover_image_path);
    }

    public function publicDownloadName(): string
    {
        $filename = Str::slug($this->title_en ?: $this->slug) ?: $this->slug;

        return "{$filename}.pdf";
    }

    public function deleteStoredFiles(): void
    {
        if ($this->cover_image_path) {
            Storage::disk('public')->delete($this->cover_image_path);
        }

        if ($this->attachment_path) {
            Storage::disk('local')->delete($this->attachment_path);
        }
    }
}
