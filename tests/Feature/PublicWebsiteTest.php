<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\StudyRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicWebsiteTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_are_available(): void
    {
        $routes = [
            route('home'),
            route('about'),
            route('services'),
            route('industries'),
            route('insights'),
            route('request-study'),
            route('contact'),
        ];

        foreach ($routes as $route) {
            $this->get($route)->assertOk();
        }
    }

    public function test_arabic_locale_can_be_requested(): void
    {
        $this->get(route('home', ['locale' => 'ar']))
            ->assertOk()
            ->assertPlainCookie('locale', 'ar');
    }

    public function test_study_request_can_be_submitted(): void
    {
        $this->withCookie('locale', 'en')->post(route('request-study.submit'), [
            'organization' => 'Research Organization',
            'full_name' => 'Analyst Name',
            'email' => 'analyst@example.test',
            'phone' => '+963000000000',
            'job_title' => 'Monitoring Officer',
            'client_type' => 'ngo',
            'service_type' => 'monitoring-evaluation',
            'study_title' => 'Program evaluation',
            'project_description' => 'We need support designing a monitoring and evaluation study for a program.',
            'objectives' => 'Clarify program outcomes and learning needs.',
            'target_population' => 'Program participants',
            'geographic_scope' => 'Syria',
            'desired_start_date' => '2026-08-01',
            'desired_end_date' => '2026-09-15',
            'consent' => '1',
        ])->assertRedirect();

        $this->assertDatabaseHas('study_requests', [
            'organization' => 'Research Organization',
            'email' => 'analyst@example.test',
            'full_name' => 'Analyst Name',
            'client_type' => 'ngo',
            'service_type' => 'monitoring-evaluation',
            'preferred_language' => 'en',
        ]);

        $this->assertNotNull(StudyRequest::query()->first()?->request_number);
    }

    public function test_contact_message_can_be_submitted(): void
    {
        $this->withCookie('locale', 'en')->post(route('contact.submit'), [
            'name' => 'Contact Person',
            'email' => 'contact@example.test',
            'phone' => '+963000000001',
            'organization' => 'Institution',
            'subject' => 'general-inquiry',
            'message' => 'We would like to discuss research and analytics support.',
            'consent' => '1',
        ])->assertRedirect();

        $this->assertDatabaseHas('inquiries', [
            'email' => 'contact@example.test',
            'subject' => 'general-inquiry',
            'preferred_language' => 'en',
            'source' => 'website',
        ]);

        $this->assertSame('Contact Person', Inquiry::query()->first()?->name);
    }
}
