<?php

use Illuminate\Support\Facades\Config;

test('app update endpoint returns configured version metadata without authentication', function () {
    Config::set('app_update', [
        'latest_version_code' => 12,
        'latest_version_name' => '2.1.0',
        'force_update' => true,
        'title' => 'Critical Update Required',
        'description' => 'Please upgrade to version 2.1.0 to continue.',
        'update_url' => 'https://play.google.com/store/apps/details?id=com.ciplon.mr',
    ]);

    $response = $this->getJson('/api/v1/app/update');

    $response->assertStatus(200)
        ->assertExactJson([
            'success' => true,
            'latestVersionCode' => 12,
            'latestVersionName' => '2.1.0',
            'messageTitle' => 'Critical Update Required',
            'messageDescription' => 'Please upgrade to version 2.1.0 to continue.',
            'shouldForceUpdate' => true,
            'updateUrl' => 'https://play.google.com/store/apps/details?id=com.ciplon.mr',
        ]);
});

test('app update endpoint reports update availability and force update when currentVersionCode is outdated', function () {
    Config::set('app_update', [
        'latest_version_code' => 10,
        'latest_version_name' => '2.0.0',
        'force_update' => true,
        'title' => 'Mandatory Upgrade',
        'description' => 'Update now to continue.',
        'update_url' => null,
    ]);

    $this->getJson('/api/v1/app/update?currentVersionCode=8')
        ->assertStatus(200)
        ->assertJson([
            'success' => true,
            'latestVersionCode' => 10,
            'currentVersionCode' => 8,
            'updateAvailable' => true,
            'shouldForceUpdate' => true,
        ]);

    Config::set('app_update.force_update', false);

    $this->getJson('/api/v1/app/update?current_version_code=8')
        ->assertStatus(200)
        ->assertJson([
            'success' => true,
            'latestVersionCode' => 10,
            'currentVersionCode' => 8,
            'updateAvailable' => true,
            'shouldForceUpdate' => false,
        ]);
});

test('app update endpoint disables force update when client is already on latest version', function () {
    Config::set('app_update', [
        'latest_version_code' => 10,
        'latest_version_name' => '2.0.0',
        'force_update' => true,
        'title' => 'Mandatory Upgrade',
        'description' => 'Update now to continue.',
        'update_url' => null,
    ]);

    $this->getJson('/api/v1/app/update?currentVersionCode=10')
        ->assertStatus(200)
        ->assertJson([
            'success' => true,
            'latestVersionCode' => 10,
            'currentVersionCode' => 10,
            'updateAvailable' => false,
            'shouldForceUpdate' => false,
        ]);
});

test('app update endpoint validates currentVersionCode query parameter', function () {
    $this->getJson('/api/v1/app/update?currentVersionCode=invalid')
        ->assertStatus(422)
        ->assertJsonValidationErrors(['currentVersionCode']);
});
