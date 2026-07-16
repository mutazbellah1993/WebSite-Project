<?php

namespace Tests\Feature;

use App\Models\PublicInquiry;
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
        $this->post(route('request-study.submit'), [
            'organization' => 'Research Organization',
            'name' => 'Analyst Name',
            'email' => 'analyst@example.test',
            'phone' => '+963000000000',
            'sector' => 'ngos-and-development-programs',
            'service_interest' => 'monitoring-evaluation',
            'timeline' => 'Within two months',
            'message' => 'We need support designing a monitoring and evaluation study for a program.',
            'consent' => '1',
        ])->assertRedirect();

        $this->assertDatabaseHas('public_inquiries', [
            'type' => PublicInquiry::TYPE_STUDY_REQUEST,
            'organization' => 'Research Organization',
            'email' => 'analyst@example.test',
            'service_interest' => 'monitoring-evaluation',
        ]);
    }

    public function test_contact_message_can_be_submitted(): void
    {
        $this->post(route('contact.submit'), [
            'name' => 'Contact Person',
            'email' => 'contact@example.test',
            'phone' => '+963000000001',
            'organization' => 'Institution',
            'subject' => 'general-inquiry',
            'message' => 'We would like to discuss research and analytics support.',
            'consent' => '1',
        ])->assertRedirect();

        $this->assertDatabaseHas('public_inquiries', [
            'type' => PublicInquiry::TYPE_CONTACT_MESSAGE,
            'email' => 'contact@example.test',
            'subject' => 'general-inquiry',
        ]);
    }
}
