<?php

use App\Http\Controllers\MR\MRDashboardController;
use App\Http\Controllers\MR\MRDoctorController;
use App\Http\Controllers\MR\MRProductController;
use App\Http\Controllers\MR\MRTrackingController;
use App\Http\Controllers\MR\MRVisitController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| MR API Routes
|--------------------------------------------------------------------------
| Protected via session web middleware and MR authorization.
*/
Route::middleware(['web', 'auth', 'mr'])->prefix('v1/mr')->group(function () {
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
