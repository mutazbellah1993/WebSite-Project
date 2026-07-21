<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreIndustryRequest;
use App\Http\Requests\Admin\UpdateIndustryRequest;
use App\Models\Industry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Industry::class);

        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', '');
        $trashed = (string) $request->query('trashed', '');
        $sort = (string) $request->query('sort', 'sort_order');
        $direction = strtolower((string) $request->query('direction', 'asc')) === 'desc' ? 'desc' : 'asc';
        $sort = in_array($sort, ['sort_order', 'title', 'created_at'], true) ? $sort : 'sort_order';

        $query = Industry::query();

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if (in_array($status, Industry::STATUSES, true)) {
            $query->where('status', $status);
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

        return Inertia::render('admin/industries/index', [
            'industries' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(fn (Industry $industry): array => $this->listItem($industry)),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'trashed' => $trashed,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'statuses' => Industry::STATUSES,
            'canManageContent' => $request->user()?->can('create', Industry::class) ?? false,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Industry::class);

        return Inertia::render('admin/industries/form', [
            'industry' => null,
            'statuses' => Industry::STATUSES,
            'mode' => 'create',
        ]);
    }

    public function store(StoreIndustryRequest $request): RedirectResponse
    {
        $industry = Industry::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Industry created.'),
        ]);

        return redirect()->route('admin.industries.edit', $industry);
    }

    public function edit(Request $request, Industry $industry): Response
    {
        Gate::authorize('view', $industry);

        return Inertia::render('admin/industries/form', [
            'industry' => $this->detailItem($industry),
            'statuses' => Industry::STATUSES,
            'mode' => 'edit',
            'canManageContent' => $request->user()?->can('update', $industry) ?? false,
        ]);
    }

    public function update(UpdateIndustryRequest $request, Industry $industry): RedirectResponse
    {
        $industry->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Industry updated.'),
        ]);

        return back();
    }

    public function destroy(Industry $industry): RedirectResponse
    {
        Gate::authorize('delete', $industry);

        $industry->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Industry deleted.'),
        ]);

        return redirect()->route('admin.industries.index');
    }

    public function restore(Industry $industry): RedirectResponse
    {
        Gate::authorize('restore', $industry);

        $industry->restore();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Industry restored.'),
        ]);

        return redirect()->route('admin.industries.edit', $industry);
    }

    /**
     * @param  Builder<Industry>  $query
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

        $query->orderBy('sort_order', $direction)->orderBy('title_en');
    }

    private function listItem(Industry $industry): array
    {
        return [
            'id' => $industry->id,
            'title_en' => $industry->title_en,
            'title_ar' => $industry->title_ar,
            'slug' => $industry->slug,
            'icon' => $industry->icon,
            'image_path' => $industry->image_path,
            'status' => $industry->status,
            'sort_order' => $industry->sort_order,
            'created_at' => $industry->created_at?->toISOString(),
            'updated_at' => $industry->updated_at?->toISOString(),
            'deleted_at' => $industry->deleted_at?->toISOString(),
        ];
    }

    private function detailItem(Industry $industry): array
    {
        return [
            ...$this->listItem($industry),
            'description_en' => $industry->description_en,
            'description_ar' => $industry->description_ar,
        ];
    }
}
