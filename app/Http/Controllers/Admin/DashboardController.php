<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Enquiry;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display admin dashboard with catalog statistics, recent inquiries, and products.
     */
    public function index(): Response
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $totalCategories = Category::count();

        $totalEnquiries = Enquiry::count();
        $pendingEnquiries = Enquiry::where('status', 'pending')->count();

        $recentProducts = Product::query()
            ->with(['category:id,name,slug', 'primaryImage', 'images'])
            ->latest('id')
            ->take(5)
            ->get();

        $recentEnquiries = Enquiry::query()
            ->latest('id')
            ->take(5)
            ->get();

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'activeProducts' => $activeProducts,
                'featuredProducts' => $featuredProducts,
                'totalCategories' => $totalCategories,
                'totalEnquiries' => $totalEnquiries,
                'pendingEnquiries' => $pendingEnquiries,
            ],
            'recentProducts' => $recentProducts,
            'recentEnquiries' => $recentEnquiries,
        ]);
    }
}
