<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CompanyPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MR\MRDashboardController;
use App\Http\Controllers\MR\MRDoctorController;
use App\Http\Controllers\MR\MRProductController;
use App\Http\Controllers\MR\MRVisitController;
use App\Http\Controllers\ProductCatalogController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [CompanyPageController::class, 'about'])->name('about');
Route::get('/contact', [CompanyPageController::class, 'contact'])->name('contact');
Route::get('/quality', [CompanyPageController::class, 'quality'])->name('quality');
Route::get('/products', [ProductCatalogController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductCatalogController::class, 'show'])->name('products.show');
Route::post('/products/{product}/enquiry', [ProductCatalogController::class, 'storeEnquiry'])->name('products.enquiry');
Route::post('/enquiry', [ProductCatalogController::class, 'storeEnquiry'])->name('enquiry.store');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::get('/admin/login', fn () => redirect()->route('login'));
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/category', fn () => redirect()->route('admin.categories.index'));
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::get('/category/add', [CategoryController::class, 'create']);
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::get('/category/{category}/edit', [CategoryController::class, 'edit']);
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::patch('/categories/{category}/status', [CategoryController::class, 'updateStatus'])->name('categories.status');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products/add', [ProductController::class, 'create']);
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::post('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::patch('/products/{product}/status', [ProductController::class, 'updateStatus'])->name('products.status');

    // Staff & Team Management
    Route::resource('staff', StaffController::class);

    // Roles & Permissions Management
    Route::resource('roles', RoleController::class);

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
});

// Storage Asset Fallback
Route::get('/storage/{path}', function (string $path) {
    if (! Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return response()->file(Storage::disk('public')->path($path));
})->where('path', '.*');

// Medical Representative (MR) Portal
Route::middleware(['auth', 'mr'])->prefix('mr')->name('mr.')->group(function () {
    Route::get('/dashboard', [MRDashboardController::class, 'show'])->name('dashboard');
    Route::get('/doctors', [MRDoctorController::class, 'show'])->name('doctors');
    Route::get('/doctors/create', [MRDoctorController::class, 'create'])->name('doctors.create');
    Route::get('/doctors/{id}/edit', [MRDoctorController::class, 'edit'])->name('doctors.edit');
    Route::get('/visits', [MRVisitController::class, 'show'])->name('visits');
    Route::get('/products', [MRProductController::class, 'show'])->name('products');
});
