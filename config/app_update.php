<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Mobile Application Update Configuration
    |--------------------------------------------------------------------------
    |
    | Controls the version check payload returned to mobile clients so they
    | can compare their installed versionCode against the latest release
    | and enforce or suggest updates accordingly.
    |
    */

    'latest_version_code' => (int) env('APP_LATEST_VERSION_CODE', 1),

    'latest_version_name' => (string) env('APP_LATEST_VERSION_NAME', '1.0.0'),

    'force_update' => filter_var(env('APP_FORCE_UPDATE', false), FILTER_VALIDATE_BOOLEAN),

    'title' => (string) env('APP_UPDATE_TITLE', 'Update Available'),

    'description' => (string) env(
        'APP_UPDATE_DESCRIPTION',
        'A new version of the app is available. Please update to continue using the latest features and improvements.'
    ),

    'update_url' => env('APP_UPDATE_URL'),

];
