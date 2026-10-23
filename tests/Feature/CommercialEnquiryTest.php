<?php

use App\Models\Enquiry;
use App\Models\User;

test('commercial inquiry submitted by public user is stored in database', function () {
    $payload = [
        'name' => 'Dr. Rajesh Patel',
        'email' => 'rajesh.patel@gujarathealth.in',
        'phone' => '+91 98250 12345',
        'company' => 'Gujarat State Medical Supplies',
        'inquiry_type' => 'Bulk Formulation Supply',
        'product_name' => 'Fibrogen-I',
        'message' => 'Please provide commercial quotation and Schedule M documentation.',
    ];

    $response = $this->post(route('enquiry.store'), $payload);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('enquiries', [
        'email' => 'rajesh.patel@gujarathealth.in',
        'company' => 'Gujarat State Medical Supplies',
        'status' => 'pending',
    ]);
});

test('admin can view commercial inquiries and update status', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $enquiry = Enquiry::create([
        'name' => 'Sunil Verma',
        'email' => 'sunil@medpluspharmacy.com',
        'phone' => '+91 99999 88888',
        'company' => 'MedPlus Pharmacy',
        'inquiry_type' => 'PCD Pharma Franchise',
        'message' => 'Seeking PCD distributorship for Delhi NCR region.',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.enquiries.index'));
    $response->assertOk();

    $patchResponse = $this->actingAs($admin)->patch(route('admin.enquiries.status', $enquiry), [
        'status' => 'contacted',
    ]);

    $patchResponse->assertSessionHas('success');

    $this->assertDatabaseHas('enquiries', [
        'id' => $enquiry->id,
        'status' => 'contacted',
    ]);
});

test('commercial inquiry validates fields with regex patterns', function () {
    // Invalid name with illegal symbols and invalid email structure
    $response = $this->post(route('enquiry.store'), [
        'name' => 'John123#$$',
        'email' => 'invalid-email-format',
        'phone' => 'abc-phone-invalid',
        'country' => 'Country123$',
        'message' => 'Valid message text',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'phone', 'country']);
});

test('commercial inquiry accepts valid formatted names and contact info', function () {
    $response = $this->post(route('enquiry.store'), [
        'name' => 'Dr. Marie Curie-Sklodowska',
        'email' => 'marie.curie@radium-institute.org',
        'phone' => '+33 (0)1 42 34 56 78',
        'organization' => 'Curie Research & Healthcare, Inc.',
        'country' => 'France',
        'message' => 'Requesting technical dossiers and formulation sample batches.',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('enquiries', [
        'name' => 'Dr. Marie Curie-Sklodowska',
        'email' => 'marie.curie@radium-institute.org',
    ]);
});
