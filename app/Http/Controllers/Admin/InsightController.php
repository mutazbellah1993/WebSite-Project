<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInsightRequest;
use App\Http\Requests\Admin\UpdateInsightRequest;
use App\Models\ContentCategory;
use App\Models\Insight;
use App\Support\SafeHtml;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InsightController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Insight::class);

        $search = trim((string) $request->query('search', ''));
        $type = (string) $request->query('type', '');
        $status = (string) $request->query('status', '');
        $category = (string) $request->query('category', '');
        $featured = (string) $request->query('featured', '');
        $trashed = (string) $request->query('trashed', '');
        $sort = (string) $request->query('sort', 'published_at');
        $direction = strtolower((string) $request->query('direction', 'desc')) === 'asc' ? 'asc' : 'desc';
        $sort = in_array($sort, ['published_at', 'created_at', 'title'], true) ? $sort : 'published_at';

        $query = Insight::query()->with(['categories', 'author']);

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if (in_array($type, Insight::TYPES, true)) {
            $query->where('type', $type);
        }

        if (in_array($status, Insight::STATUSES, true)) {
            $query->where('status', $status);
        }

        if ($featured === 'yes') {
            $query->where('is_featured', true);
        } elseif ($featured === 'no') {
            $query->where('is_featured', false);
        }

        if (ctype_digit($category)) {
            $query->whereHas('categories', fn (Builder $query): Builder => $query->whereKey((int) $category));
        }

        if ($search !== '') {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_ar', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $this->applySorting($query, $sort, $direction);

        return Inertia::render('admin/insights/index', [
            'insights' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(fn (Insight $insight): array => $this->listItem($insight)),
            'filters' => [
                'search' => $search,
                'type' => $type,
                'status' => $status,
                'category' => $category,
                'featured' => $featured,
                'trashed' => $trashed,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'types' => Insight::TYPES,
            'statuses' => Insight::STATUSES,
            'categories' => $this->categoryOptions(),
            'canManageContent' => $request->user()?->can('create', Insight::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', Insight::class);

        return Inertia::render('admin/insights/form', [
            'insight' => null,
            'types' => Insight::TYPES,
            'statuses' => Insight::STATUSES,
            'categories' => $this->categoryOptions(),
            'mode' => 'create',
            'canManageContent' => true,
        ]);
    }

    public function store(StoreInsightRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $categoryIds = $validated['categories'] ?? [];
        $data = $this->contentData($validated);
        $data['author_id'] = $request->user()?->id;
        $storedFiles = [];

        if ($request->file('cover_image') instanceof UploadedFile) {
            $data['cover_image_path'] = $this->storeUpload($request->file('cover_image'), 'public', 'insights/covers');
            $storedFiles[] = ['public', $data['cover_image_path'], 'insights/covers'];
        }

        if ($request->file('report_attachment') instanceof UploadedFile) {
            $data['attachment_path'] = $this->storeUpload($request->file('report_attachment'), 'local', 'insights/reports', 'pdf');
            $storedFiles[] = ['local', $data['attachment_path'], 'insights/reports'];
        }

        try {
            $insight = DB::transaction(function () use ($data, $categoryIds): Insight {
                $insight = Insight::create($data);
                $insight->categories()->sync($categoryIds);

                return $insight;
            });
        } catch (Throwable $exception) {
            foreach ($storedFiles as [$disk, $path, $prefix]) {
                $this->deleteStoredPath($disk, $path, $prefix);
            }

            throw $exception;
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Insight created.'),
        ]);

        return redirect()->route('admin.insights.edit', $insight);
    }

    public function edit(Request $request, Insight $insight): Response
    {
        Gate::authorize('view', $insight);

        return Inertia::render('admin/insights/form', [
            'insight' => $this->detailItem($insight->load(['categories', 'author'])),
            'types' => Insight::TYPES,
            'statuses' => Insight::STATUSES,
            'categories' => $this->categoryOptions(),
            'mode' => 'edit',
            'canManageContent' => $request->user()?->can('update', $insight) ?? false,
        ]);
    }

    public function update(UpdateInsightRequest $request, Insight $insight): RedirectResponse
    {
        $validated = $request->validated();
        $categoryIds = $validated['categories'] ?? [];
        $data = $this->contentData($validated);
        $newFiles = [];
        $deleteAfterCommit = [];

        if ($request->boolean('remove_cover_image') && $insight->cover_image_path) {
            $deleteAfterCommit[] = ['public', $insight->cover_image_path, 'insights/covers'];
            $data['cover_image_path'] = null;
        }

        if ($request->boolean('remove_report_attachment') && $insight->attachment_path) {
            $deleteAfterCommit[] = ['local', $insight->attachment_path, 'insights/reports'];
            $data['attachment_path'] = null;
        }

        if ($request->file('cover_image') instanceof UploadedFile) {
            if ($insight->cover_image_path) {
                $deleteAfterCommit[] = ['public', $insight->cover_image_path, 'insights/covers'];
            }

            $data['cover_image_path'] = $this->storeUpload($request->file('cover_image'), 'public', 'insights/covers');
            $newFiles[] = ['public', $data['cover_image_path'], 'insights/covers'];
        }

        if ($request->file('report_attachment') instanceof UploadedFile) {
            if ($insight->attachment_path) {
                $deleteAfterCommit[] = ['local', $insight->attachment_path, 'insights/reports'];
            }

            $data['attachment_path'] = $this->storeUpload($request->file('report_attachment'), 'local', 'insights/reports', 'pdf');
            $newFiles[] = ['local', $data['attachment_path'], 'insights/reports'];
        }

        try {
            DB::transaction(function () use ($insight, $data, $categoryIds): void {
                $insight->update($data);
                $insight->categories()->sync($categoryIds);
            });
        } catch (Throwable $exception) {
            foreach ($newFiles as [$disk, $path, $prefix]) {
                $this->deleteStoredPath($disk, $path, $prefix);
            }

            throw $exception;
        }

        foreach ($deleteAfterCommit as [$disk, $path, $prefix]) {
            $this->deleteStoredPath($disk, $path, $prefix);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Insight updated.'),
        ]);

        return back();
    }

    public function destroy(Insight $insight): RedirectResponse
    {
        Gate::authorize('delete', $insight);

        $insight->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Insight deleted.'),
        ]);

        return redirect()->route('admin.insights.index');
    }

    public function restore(Insight $insight): RedirectResponse
    {
        Gate::authorize('restore', $insight);

        $insight->restore();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Insight restored.'),
        ]);

        return redirect()->route('admin.insights.edit', $insight);
    }

    public function preview(Request $request, Insight $insight): Response
    {
        Gate::authorize('view', $insight);

        return Inertia::render('public/insight-show', [
            'insight' => $this->publicDetailItem($insight->load('categories')),
            'relatedInsights' => [],
            'isPreview' => true,
            'seo' => [
                'canonicalUrl' => route('insights.show', $insight),
                'alternateUrls' => [
                    'en' => route('insights.show', ['insight' => $insight, 'locale' => 'en']),
                    'ar' => route('insights.show', ['insight' => $insight, 'locale' => 'ar']),
                ],
                'noindex' => true,
            ],
        ]);
    }

    /**
     * @param  Builder<Insight>  $query
     */
    private function applySorting(Builder $query, string $sort, string $direction): void
    {
        if ($sort === 'title') {
            $query->orderBy('title_en', $direction)->orderBy('title_ar', $direction);

            return;
        }

        if ($sort === 'created_at') {
            $query->orderBy('created_at', $direction);

            return;
        }

        $query
            ->orderByRaw('CASE WHEN published_at IS NULL THEN 1 ELSE 0 END')
            ->orderBy('published_at', $direction)
            ->orderBy('created_at', $direction);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function contentData(array $validated): array
    {
        return Arr::only($validated, [
            'type',
            'title_en',
            'title_ar',
            'slug',
            'excerpt_en',
            'excerpt_ar',
            'body_en',
            'body_ar',
            'is_featured',
            'status',
            'published_at',
            'seo_title_en',
            'seo_title_ar',
            'seo_description_en',
            'seo_description_ar',
        ]);
    }

    private function storeUpload(UploadedFile $file, string $disk, string $directory, ?string $forcedExtension = null): string
    {
        $extension = $forcedExtension ?: strtolower($file->extension() ?: $file->getClientOriginalExtension());
        $filename = Str::uuid()->toString().'.'.$extension;

        return $file->storeAs($directory, $filename, $disk);
    }

    private function deleteStoredPath(string $disk, ?string $path, string $prefix): void
    {
        if (! $path || str_contains($path, '..') || ! str_starts_with($path, $prefix.'/')) {
            return;
        }

        Storage::disk($disk)->delete($path);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function categoryOptions(): array
    {
        return ContentCategory::query()
            ->ordered()
            ->get()
            ->map(fn (ContentCategory $category): array => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name_en' => $category->name_en,
                'name_ar' => $category->name_ar,
            ])
            ->all();
    }

    private function listItem(Insight $insight): array
    {
        return [
            'id' => $insight->id,
            'type' => $insight->type,
            'title_en' => $insight->title_en,
            'title_ar' => $insight->title_ar,
            'slug' => $insight->slug,
            'status' => $insight->status,
            'is_featured' => $insight->is_featured,
            'published_at' => $insight->published_at?->toISOString(),
            'cover_image_url' => $insight->coverImageUrl(),
            'has_report_attachment' => (bool) $insight->attachment_path,
            'categories' => $insight->categories
                ->map(fn (ContentCategory $category): array => [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name_en' => $category->name_en,
                    'name_ar' => $category->name_ar,
                ])
                ->all(),
            'author' => $insight->author ? [
                'id' => $insight->author->id,
                'name' => $insight->author->name,
            ] : null,
            'created_at' => $insight->created_at?->toISOString(),
            'updated_at' => $insight->updated_at?->toISOString(),
            'deleted_at' => $insight->deleted_at?->toISOString(),
        ];
    }

    private function detailItem(Insight $insight): array
    {
        return [
            ...$this->listItem($insight),
            'excerpt_en' => $insight->excerpt_en,
            'excerpt_ar' => $insight->excerpt_ar,
            'body_en' => $insight->body_en,
            'body_ar' => $insight->body_ar,
            'category_ids' => $insight->categories->pluck('id')->values()->all(),
            'seo_title_en' => $insight->seo_title_en,
            'seo_title_ar' => $insight->seo_title_ar,
            'seo_description_en' => $insight->seo_description_en,
            'seo_description_ar' => $insight->seo_description_ar,
        ];
    }

    private function publicDetailItem(Insight $insight): array
    {
        return [
            'type' => $insight->type,
            'slug' => $insight->slug,
            'title' => [
                'en' => $insight->title_en,
                'ar' => $insight->title_ar,
            ],
            'excerpt' => [
                'en' => $insight->excerpt_en ?: '',
                'ar' => $insight->excerpt_ar ?: '',
            ],
            'body' => [
                'en' => SafeHtml::sanitize($insight->body_en) ?: '',
                'ar' => SafeHtml::sanitize($insight->body_ar) ?: '',
            ],
            'categories' => $insight->categories
                ->map(fn (ContentCategory $category): array => [
                    'slug' => $category->slug,
                    'name' => [
                        'en' => $category->name_en,
                        'ar' => $category->name_ar,
                    ],
                ])
                ->all(),
            'published_at' => $insight->published_at?->toISOString(),
            'cover_image_url' => $insight->coverImageUrl(),
            'download_url' => $insight->type === 'report' && $insight->attachment_path
                ? route('insights.download', $insight)
                : null,
        ];
    }
}
