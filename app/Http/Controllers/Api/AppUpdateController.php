<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppUpdateController extends Controller
{
    /**
     * Return mobile application update metadata configured via environment variables.
     */
    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currentVersionCode' => ['nullable', 'integer', 'min:0'],
            'current_version_code' => ['nullable', 'integer', 'min:0'],
            'version_code' => ['nullable', 'integer', 'min:0'],
        ]);

        $rawCurrentVersion = $validated['currentVersionCode']
            ?? $validated['current_version_code']
            ?? $validated['version_code']
            ?? null;

        $currentVersionCode = $rawCurrentVersion !== null ? (int) $rawCurrentVersion : null;
        $latestVersionCode = (int) config('app_update.latest_version_code', 1);
        $configuredForceUpdate = (bool) config('app_update.force_update', false);
        $updateAvailable = $currentVersionCode !== null
            ? $latestVersionCode > $currentVersionCode
            : null;

        $shouldForceUpdate = $currentVersionCode !== null
            ? ($updateAvailable && $configuredForceUpdate)
            : $configuredForceUpdate;

        $payload = [
            'success' => true,
            'latestVersionCode' => $latestVersionCode,
            'latestVersionName' => (string) config('app_update.latest_version_name', '1.0.0'),
            'messageTitle' => (string) config('app_update.title', 'Update Available'),
            'messageDescription' => (string) config('app_update.description', ''),
            'shouldForceUpdate' => $shouldForceUpdate,
            'updateUrl' => config('app_update.update_url') ?: null,
        ];

        if ($currentVersionCode !== null) {
            $payload['currentVersionCode'] = $currentVersionCode;
            $payload['updateAvailable'] = $updateAvailable;
        }

        return response()->json($payload, 200);
    }
}
