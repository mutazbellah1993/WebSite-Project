<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'uploaded_by',
    'disk',
    'path',
    'original_name',
    'mime_type',
    'size_bytes',
    'alt_text_en',
    'alt_text_ar',
    'title_en',
    'title_ar',
])]
class Media extends Model
{
    protected $table = 'media_library';

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
