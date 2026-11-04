<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\MR\MRDashboardController;
use App\Http\Controllers\MR\MRDoctorController;
use App\Http\Controllers\MR\MRProductController;
use App\Http\Controllers\MR\MRTrackingController;
use App\Http\Controllers\MR\MRVisitController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mobile & Client API Authentication Routes (Public)
|--------------------------------------------------------------------------
| No CSRF required. Accepts email & password, returns Sanctum Bearer token.
*/
Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.v1.auth.login');
    Route::post('/mr/login', [AuthController::class, 'login'])->name('api.v1.mr.login');
    Route::post('/login', [AuthController::class, 'login'])->name('api.v1.login');

    /*
    |--------------------------------------------------------------------------
    | Authenticated Mobile / Client Identity Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me'])->name('api.v1.auth.me');
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.v1.auth.logout');
        Route::get('/mr/me', [AuthController::class, 'me'])->name('api.v1.mr.me');
        Route::post('/mr/logout', [AuthController::class, 'logout'])->name('api.v1.mr.logout');
    });
});

/*
|--------------------------------------------------------------------------
| MR API Routes
|--------------------------------------------------------------------------
| Supports both Sanctum Bearer Tokens (Mobile App) and Web Sessions.
*/
Route::middleware(['web', 'auth:sanctum', 'mr'])->prefix('v1/mr')->group(function () {
    Route::get('/dashboard', [MRDashboardController::class, 'index']);
    Route::get('/doctors', [MRDoctorController::class, 'index']);
    Route::post('/doctors', [MRDoctorController::class, 'store']);
    Route::get('/doctors/{id}', [MRDoctorController::class, 'showDoctor']);
    Route::put('/doctors/{id}', [MRDoctorController::class, 'update']);
    Route::delete('/doctors/{id}', [MRDoctorController::class, 'destroy']);
    Route::get('/visits', [MRVisitController::class, 'index']);
    Route::post('/visits', [MRVisitController::class, 'store']);
    Route::get('/visits/{id}', [MRVisitController::class, 'showVisit']);
    Route::put('/visits/{id}', [MRVisitController::class, 'update']);
    Route::delete('/visits/{id}', [MRVisitController::class, 'destroy']);
    Route::get('/products', [MRProductController::class, 'index']);
    Route::get('/products/{id}', [MRProductController::class, 'showProduct']);
    Route::post('/location', [MRTrackingController::class, 'updateLocation']);
    Route::get('/route-tracking', [MRTrackingController::class, 'getDoctorRoute']);
});
