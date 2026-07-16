<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\CaseStudy;
use App\Models\ContentCategory;
use App\Models\Industry;
use App\Models\Inquiry;
use App\Models\Insight;
use App\Models\Media;
use App\Models\StudyRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DatabasePackageTest extends TestCase
{
    use RefreshDatabase;

    public function test_final_database_tables_exist_without_public_inquiries(): void
    {
        $tables = [
            'pages',
            'services',
            'industries',
            'case_studies',
            'content_categories',
            'insights',
            'content_category_insight',
            'methodology_steps',
            'team_members',
            'testimonials',
            'inquiries',
            'study_requests',
            'newsletter_subscribers',
            'media_library',
            'site_settings',
            'audit_logs',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing table [{$table}].");
        }

        $this->assertFalse(Schema::hasTable('public_inquiries'));
    }

    public function test_user_extension_columns_exist(): void
    {
        foreach (['phone', 'role', 'locale', 'is_active', 'last_login_at'] as $column) {
            $this->assertTrue(Schema::hasColumn('users', $column), "Missing users column [{$column}].");
        }
    }

    public function test_elitedata_relationships_are_configured(): void
    {
        $user = User::factory()->create();

        $industry = Industry::create([
            'slug' => 'development-programs',
            'title_en' => 'Development programs',
            'title_ar' => 'البرامج التنموية',
        ]);

        $caseStudy = CaseStudy::create([
            'industry_id' => $industry->id,
            'slug' => 'methodology-example',
            'title_en' => 'Methodology example',
            'title_ar' => 'مثال منهجي',
        ]);

        $category = ContentCategory::create([
            'slug' => 'methodology',
            'name_en' => 'Methodology',
            'name_ar' => 'المنهجية',
        ]);

        $insight = Insight::create([
            'author_id' => $user->id,
            'slug' => 'sampling-note',
            'title_en' => 'Sampling note',
            'title_ar' => 'ملاحظة حول العينة',
        ]);
        $insight->categories()->attach($category);

        $inquiry = Inquiry::create([
            'assigned_to' => $user->id,
            'name' => 'Contact Person',
            'email' => 'contact@example.test',
            'message' => 'A public inquiry message.',
        ]);

        $studyRequest = StudyRequest::create([
            'assigned_to' => $user->id,
            'request_number' => 'ED-TEST-001',
            'full_name' => 'Study Requester',
            'email' => 'study@example.test',
            'project_description' => 'A study request description.',
        ]);

        $media = Media::create([
            'uploaded_by' => $user->id,
            'disk' => 'public',
            'path' => 'uploads/example.pdf',
            'original_name' => 'example.pdf',
        ]);

        $auditLog = AuditLog::create([
            'user_id' => $user->id,
            'event' => 'created',
            'auditable_type' => Inquiry::class,
            'auditable_id' => $inquiry->id,
        ]);

        $this->assertTrue($caseStudy->industry->is($industry));
        $this->assertTrue($industry->caseStudies()->first()?->is($caseStudy));
        $this->assertTrue($insight->author?->is($user));
        $this->assertTrue($insight->categories()->first()?->is($category));
        $this->assertTrue($category->insights()->first()?->is($insight));
        $this->assertTrue($inquiry->assignee?->is($user));
        $this->assertTrue($studyRequest->assignee?->is($user));
        $this->assertTrue($media->uploader?->is($user));
        $this->assertTrue($auditLog->user?->is($user));
        $this->assertTrue($user->assignedInquiries()->first()?->is($inquiry));
        $this->assertTrue($user->assignedStudyRequests()->first()?->is($studyRequest));
        $this->assertTrue($user->insights()->first()?->is($insight));
        $this->assertTrue($user->uploadedMedia()->first()?->is($media));
        $this->assertTrue($user->auditLogs()->first()?->is($auditLog));
    }
}
