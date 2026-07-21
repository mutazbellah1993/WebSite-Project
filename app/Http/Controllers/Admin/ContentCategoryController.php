<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreContentCategoryRequest;
use App\Http\Requests\Admin\UpdateContentCategoryRequest;
use App\Models\ContentCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContentCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ContentCategory::class);

        $search = trim((string) $request->query('search', ''));
        $sort = (string) $request->query('sort', 'name');
        $direction = strtolower((string) $request->query('direction', 'asc')) === 'desc' ? 'desc' : 'asc';
        $sort = in_array($sort, ['name', 'slug', 'created_at'], true) ? $sort : 'name';

        $query = ContentCategory::query()->withCount('insights');

        if ($search !== '') {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $this->applySorting($query, $sort, $direction);

        return Inertia::render('admin/content-categories/index', [
            'categories' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(fn (ContentCategory $category): array => $this->listItem($category)),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'canManageContent' => $request->user()?->can('create', ContentCategory::class) ?? false,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', ContentCategory::class);

        return Inertia::render('admin/content-categories/form', [
            'category' => null,
            'mode' => 'create',
        ]);
    }

    public function store(StoreContentCategoryRequest $request): RedirectResponse
    {
        $category = ContentCategory::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Content category created.'),
        ]);

        return redirect()->route('admin.content-categories.edit', $category);
    }

    public function edit(Request $request, ContentCategory $contentCategory): Response
    {
        Gate::authorize('view', $contentCategory);

        return Inertia::render('admin/content-categories/form', [
            'category' => $this->detailItem($contentCategory->loadCount('insights')),
            'mode' => 'edit',
            'canManageContent' => $request->user()?->can('update', $contentCategory) ?? false,
        ]);
    }

    public function update(UpdateContentCategoryRequest $request, ContentCategory $contentCategory): RedirectResponse
    {
        $contentCategory->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Content category updated.'),
        ]);

        return back();
    }

    public function destroy(ContentCategory $contentCategory): RedirectResponse
    {
        Gate::authorize('delete', $contentCategory);

        if ($contentCategory->insights()->exists()) {
            return back()->withErrors([
                'content_category' => __('Remove or reassign linked insights before deleting this category.'),
            ]);
        }

        $contentCategory->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Content category deleted.'),
        ]);

        return redirect()->route('admin.content-categories.index');
    }

    /**
     * @param  Builder<ContentCategory>  $query
     */
    private function applySorting(Builder $query, string $sort, string $direction): void
    {
        if ($sort === 'slug') {
            $query->orderBy('slug', $direction);

            return;
        }

        if ($sort === 'created_at') {
            $query->orderBy('created_at', $direction);

            return;
        }

        $query->orderBy('name_en', $direction)->orderBy('name_ar', $direction);
    }

    private function listItem(ContentCategory $category): array
    {
        return [
            'id' => $category->id,
            'name_en' => $category->name_en,
            'name_ar' => $category->name_ar,
            'slug' => $category->slug,
            'description_en' => $category->description_en,
            'description_ar' => $category->description_ar,
            'insights_count' => $category->insights_count ?? 0,
            'created_at' => $category->created_at?->toISOString(),
            'updated_at' => $category->updated_at?->toISOString(),
        ];
    }

    private function detailItem(ContentCategory $category): array
    {
        return $this->listItem($category);
    }
}
