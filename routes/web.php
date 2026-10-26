<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EnquiryController;
use App\Http\Controllers\Admin\MRTrackingController as AdminMRTrackingController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CompanyPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MR\MRDashboardController;
use App\Http\Controllers\MR\MRDetailingController;
use App\Http\Controllers\MR\MRDoctorController;
use App\Http\Controllers\MR\MRProductController;
use App\Http\Controllers\MR\MRScheduleController;
use App\Http\Controllers\MR\MRTrackingController;
use App\Http\Controllers\MR\MRVisitController;
use App\Http\Controllers\MRConnectController;
use App\Http\Controllers\NotificationController;
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

    // Forgot Password & OTP Reset Routes
    Route::get('/forgot-password', [ForgotPasswordController::class, 'show'])->name('password.request');
    Route::post('/forgot-password/send-otp', [ForgotPasswordController::class, 'sendOtp'])
        ->middleware('throttle:6,1')
        ->name('password.otp.send');
    Route::post('/forgot-password/verify-otp', [ForgotPasswordController::class, 'verifyOtp'])
        ->middleware('throttle:10,1')
        ->name('password.otp.verify');
    Route::post('/forgot-password/reset-password', [ForgotPasswordController::class, 'resetPassword'])
        ->middleware('throttle:6,1')
        ->name('password.reset.submit');
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

    // Commercial Inquiries Management
    Route::get('/enquiries', [EnquiryController::class, 'index'])->name('enquiries.index');
    Route::patch('/enquiries/{enquiry}/status', [EnquiryController::class, 'updateStatus'])->name('enquiries.status');
    Route::delete('/enquiries/{enquiry}', [EnquiryController::class, 'destroy'])->name('enquiries.destroy');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Field Operations & Real-Time Doctor Movement Tracking
    Route::get('/tracking', [AdminMRTrackingController::class, 'index'])->name('tracking.index');
    Route::get('/tracking/{userId}', [AdminMRTrackingController::class, 'show'])->name('tracking.show');
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

    // Calls & Visits Planner / Scheduler
    Route::get('/schedule', fn () => redirect('/mr/visits?view=planner'))->name('schedule');
    Route::get('/follow-ups', fn () => redirect('/mr/visits?view=planner'))->name('followups');
    Route::post('/schedule', [MRScheduleController::class, 'store'])->name('schedule.store');
    Route::match(['put', 'patch', 'post'], '/schedule/{schedule}/status', [MRScheduleController::class, 'updateStatus'])->name('schedule.status');
    Route::delete('/schedule/{schedule}', [MRScheduleController::class, 'destroy'])->name('schedule.destroy');
    Route::get('/detailing', [MRDetailingController::class, 'show'])->name('detailing');

    // Real-Time GPS Tracking & Route Sync
    Route::post('/location', [MRTrackingController::class, 'updateLocation'])->name('location.update');
    Route::get('/route-tracking', [MRTrackingController::class, 'getDoctorRoute'])->name('tracking');
});

// mrConnect Enterprise Field & Operations Modules
Route::middleware(['auth'])->prefix('mrconnect')->name('mrconnect.')->group(function () {
    Route::get('/field-expenses', [MRConnectController::class, 'fieldExpenses'])->name('field.expenses');
    Route::post('/field-expenses', [MRConnectController::class, 'storeExpense'])->name('field.expenses.store');
    Route::post('/field-expenses/{id}/approve', [MRConnectController::class, 'approveExpense'])->name('field.expenses.approve');
    Route::post('/field-expenses/{id}/reject', [MRConnectController::class, 'rejectExpense'])->name('field.expenses.reject');
    Route::get('/leave', [MRConnectController::class, 'leave'])->name('leave.index');
    Route::post('/leave', [MRConnectController::class, 'storeLeave'])->name('leave.store');
    Route::post('/leave/{id}/approve', [MRConnectController::class, 'approveLeave'])->name('leave.approve');
    Route::post('/leave/{id}/reject', [MRConnectController::class, 'rejectLeave'])->name('leave.reject');
    Route::get('/primary-sales', [MRConnectController::class, 'primarySales'])->name('primary.sales');
    Route::get('/pob-order', [MRConnectController::class, 'pobOrder'])->name('pob.order');
    Route::post('/pob-order', [MRConnectController::class, 'storePobOrder'])->name('pob.order.store');
    Route::post('/pob-order/{id}/status', [MRConnectController::class, 'updatePobStatus'])->name('pob.order.status');
    Route::get('/set-target', [MRConnectController::class, 'setTarget'])->name('set.target');
    Route::post('/set-target', [MRConnectController::class, 'storeTarget'])->name('set.target.store');
    Route::put('/set-target/{id}', [MRConnectController::class, 'updateTarget'])->name('set.target.update');
    Route::delete('/set-target/{id}', [MRConnectController::class, 'destroyTarget'])->name('set.target.destroy');
    Route::get('/video-library', [MRConnectController::class, 'videoLibrary'])->name('video.library');
    Route::get('/slider', [MRConnectController::class, 'slider'])->name('slider');
    Route::get('/notice', [MRConnectController::class, 'notice'])->name('notice');
    Route::post('/notice', [MRConnectController::class, 'storeNotice'])->name('notice.store');
    Route::delete('/notice/{id}', [MRConnectController::class, 'destroyNotice'])->name('notice.destroy');
    Route::get('/sponsor', [MRConnectController::class, 'sponsor'])->name('sponsor');
    Route::get('/scheme', [MRConnectController::class, 'scheme'])->name('scheme');
    Route::get('/mr-directory', [MRConnectController::class, 'mrDirectory'])->name('mr.directory');
    Route::get('/all-reports', [MRConnectController::class, 'allReports'])->name('all.reports');

});

// In-App Notifications (All Authenticated Users)
Route::middleware(['auth'])->group(function () {
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
});
