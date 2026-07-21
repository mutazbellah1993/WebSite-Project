<?php

namespace Tests\Feature;

use App\Models\ContentCategory;
use App\Models\Insight;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicInsightContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_listing_shows_only_published_available_insights(): void
    {
        $category = $this->createCategory();
        $published = $this->createInsight([
            'slug' => 'published-insight',
            'title_en' => 'Published Insight',
            'title_ar' => 'رؤية منشورة',
            'status' => 'published',
            'published_at' => now()->subDay(),
            'is_featured' => true,
        ]);
        $published->categories()->attach($category);
        $this->createInsight(['slug' => 'draft-insight', 'status' => 'draft']);
        $this->createInsight(['slug' => 'archived-insight', 'status' => 'archived']);
        $this->createInsight(['slug' => 'future-insight', 'status' => 'published', 'published_at' => now()->addDay()]);
        $deleted = $this->createInsight(['slug' => 'deleted-insight', 'status' => 'published']);
        $deleted->delete();

        $this->get(route('insights'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/insights')
                ->has('insights.data', 1)
                ->where('insights.data.0.slug', $published->slug)
                ->where('insights.data.0.title.en', 'Published Insight')
                ->where('insights.data.0.title.ar', 'رؤية منشورة')
                ->where('insights.data.0.categories.0.slug', $category->slug));
    }

    public function test_public_listing_filters_by_type_and_category(): void
    {
        $market = $this->createCategory(['slug' => 'market-research', 'name_en' => 'Market Research']);
        $statistics = $this->createCategory(['slug' => 'statistical-research', 'name_en' => 'Statistical Research']);
        $report = $this->createInsight(['slug' => 'market-report', 'type' => 'report', 'status' => 'published']);
        $report->categories()->attach($market);
        $article = $this->createInsight(['slug' => 'statistics-article', 'type' => 'article', 'status' => 'published']);
        $article->categories()->attach($statistics);

        $this->get(route('insights', ['type' => 'report', 'category' => 'market-research']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('insights.data', 1)
                ->where('insights.data.0.slug', 'market-report')
                ->where('filters.type', 'report')
                ->where('filters.category', 'market-research'));
    }

    public function test_public_detail_resolves_by_slug_and_renders_bilingual_content(): void
    {
        $category = $this->createCategory();
        $insight = $this->createInsight([
            'slug' => 'public-detail',
            'title_en' => 'Public Detail',
            'title_ar' => 'تفاصيل عامة',
            'excerpt_en' => 'English public excerpt.',
            'excerpt_ar' => 'موجز عربي عام.',
            'body_en' => '<p>English public body.</p>',
            'body_ar' => '<p>نص عربي عام.</p>',
            'status' => 'published',
            'published_at' => now()->subHour(),
        ]);
        $insight->categories()->attach($category);

        $this->get(route('insights.show', $insight))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/insight-show')
                ->where('insight.slug', 'public-detail')
                ->where('insight.title.en', 'Public Detail')
                ->where('insight.title.ar', 'تفاصيل عامة')
                ->where('insight.body.en', '<p>English public body.</p>')
                ->where('insight.body.ar', '<p>نص عربي عام.</p>'));
    }

    public function test_private_invalid_future_and_deleted_slugs_return_404(): void
    {
        $draft = $this->createInsight(['slug' => 'draft-detail', 'status' => 'draft']);
        $archived = $this->createInsight(['slug' => 'archived-detail', 'status' => 'archived']);
        $future = $this->createInsight(['slug' => 'future-detail', 'status' => 'published', 'published_at' => now()->addDay()]);
        $deleted = $this->createInsight(['slug' => 'deleted-detail', 'status' => 'published']);
        $deleted->delete();

        $this->get(route('insights.show', $draft))->assertNotFound();
        $this->get(route('insights.show', $archived))->assertNotFound();
        $this->get(route('insights.show', $future))->assertNotFound();
        $this->get('/research-and-insights/deleted-detail')->assertNotFound();
        $this->get('/research-and-insights/not-a-real-slug')->assertNotFound();
    }

    public function test_pdf_download_works_only_for_published_report_records(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('insights/reports/public-report.pdf', 'PDF content');
        Storage::disk('local')->put('insights/reports/draft-report.pdf', 'PDF content');

        $publishedReport = $this->createInsight([
            'type' => 'report',
            'slug' => 'public-report',
            'title_en' => 'Public Report',
            'status' => 'published',
            'published_at' => now()->subDay(),
            'attachment_path' => 'insights/reports/public-report.pdf',
        ]);
        $draftReport = $this->createInsight([
            'type' => 'report',
            'slug' => 'draft-report',
            'status' => 'draft',
            'attachment_path' => 'insights/reports/draft-report.pdf',
        ]);
        $article = $this->createInsight([
            'type' => 'article',
            'slug' => 'article-download',
            'status' => 'published',
            'attachment_path' => 'insights/reports/public-report.pdf',
        ]);

        $this->get(route('insights.download', $publishedReport))
            ->assertOk()
            ->assertDownload('public-report.pdf');

        $this->get(route('insights.download', $draftReport))->assertNotFound();
        $this->get(route('insights.download', $article))->assertNotFound();
    }

    private function createCategory(array $overrides = []): ContentCategory
    {
        return ContentCategory::create([
            'slug' => 'statistical-research',
            'name_en' => 'Statistical Research',
            'name_ar' => 'البحث الإحصائي',
            'description_en' => 'English category description.',
            'description_ar' => 'وصف عربي للتصنيف.',
            ...$overrides,
        ]);
    }

    private function createInsight(array $overrides = []): Insight
    {
        return Insight::create([
            'type' => 'article',
            'slug' => 'sampling-note',
            'title_en' => 'Sampling note',
            'title_ar' => 'ملاحظة حول العينة',
            'excerpt_en' => 'English excerpt.',
            'excerpt_ar' => 'موجز عربي.',
            'body_en' => '<p>English body.</p>',
            'body_ar' => '<p>نص عربي.</p>',
            'cover_image_path' => null,
            'attachment_path' => null,
            'is_featured' => false,
            'status' => 'published',
            'published_at' => now()->subDay(),
            ...$overrides,
        ]);
    }
}
