<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Service::class);

        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', '');
        $featured = (string) $request->query('featured', '');
        $trashed = (string) $request->query('trashed', '');
        $sort = (string) $request->query('sort', 'sort_order');
        $direction = strtolower((string) $request->query('direction', 'asc')) === 'desc' ? 'desc' : 'asc';
        $sort = in_array($sort, ['sort_order', 'title', 'created_at'], true) ? $sort : 'sort_order';

        $query = Service::query();

        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        if (in_array($status, Service::STATUSES, true)) {
            $query->where('status', $status);
        }

        if ($featured === 'yes') {
            $query->where('is_featured', true);
        } elseif ($featured === 'no') {
            $query->where('is_featured', false);
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

        return Inertia::render('admin/services/index', [
            'services' => $query
                ->paginate(12)
                ->withQueryString()
                ->through(fn (Service $service): array => $this->listItem($service)),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'featured' => $featured,
                'trashed' => $trashed,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'statuses' => Service::STATUSES,
            'canManageContent' => $request->user()?->can('create', Service::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', Service::class);

        return Inertia::render('admin/services/form', [
            'service' => null,
            'statuses' => Service::STATUSES,
            'mode' => 'create',
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $service = Service::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Service created.'),
        ]);

        return redirect()->route('admin.services.edit', $service);
    }

    public function edit(Request $request, Service $service): Response
    {
        Gate::authorize('view', $service);

        return Inertia::render('admin/services/form', [
            'service' => $this->detailItem($service),
            'statuses' => Service::STATUSES,
            'mode' => 'edit',
            'canManageContent' => $request->user()?->can('update', $service) ?? false,
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Service updated.'),
        ]);

        return back();
    }

    public function destroy(Service $service): RedirectResponse
    {
        Gate::authorize('delete', $service);

        $service->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Service deleted.'),
        ]);

        return redirect()->route('admin.services.index');
    }

    public function restore(Service $service): RedirectResponse
    {
        Gate::authorize('restore', $service);

        $service->restore();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Service restored.'),
        ]);

        return redirect()->route('admin.services.edit', $service);
    }

    /**
     * @param  Builder<Service>  $query
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

    private function listItem(Service $service): array
    {
        return [
            'id' => $service->id,
            'title_en' => $service->title_en,
            'title_ar' => $service->title_ar,
            'slug' => $service->slug,
            'short_description_en' => $service->short_description_en,
            'short_description_ar' => $service->short_description_ar,
            'icon' => $service->icon,
            'image_path' => $service->image_path,
            'status' => $service->status,
            'is_featured' => $service->is_featured,
            'sort_order' => $service->sort_order,
            'created_at' => $service->created_at?->toISOString(),
            'updated_at' => $service->updated_at?->toISOString(),
            'deleted_at' => $service->deleted_at?->toISOString(),
        ];
    }

    private function detailItem(Service $service): array
    {
        return [
            ...$this->listItem($service),
            'description_en' => $service->description_en,
            'description_ar' => $service->description_ar,
            'seo_title_en' => $service->seo_title_en,
            'seo_title_ar' => $service->seo_title_ar,
            'seo_description_en' => $service->seo_description_en,
            'seo_description_ar' => $service->seo_description_ar,
        ];
    }
}
