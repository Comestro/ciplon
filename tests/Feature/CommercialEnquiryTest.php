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
