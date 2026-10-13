<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class CompanyPageController extends Controller
{
    /**
     * Display the dedicated About Us corporate overview page.
     */
    public function about(): Response
    {
        $categories = Category::query()
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $sampleProducts = Product::query()
            ->where('status', 'active')
            ->with(['category:id,name,slug', 'primaryImage'])
            ->take(4)
            ->get();

        return Inertia::render('public/AboutPage', [
            'company' => Setting::getPublicMap(),
            'categories' => $categories,
            'featuredProducts' => $sampleProducts,
        ]);
    }

    /**
     * Display the dedicated Contact Us & Commercial Inquiries page.
     */
    public function contact(): Response
    {
        return Inertia::render('public/ContactPage', [
            'company' => Setting::getPublicMap(),
        ]);
    }

    /**
     * Display the dedicated Quality, WHO-GMP & Compliance page.
     */
    public function quality(): Response
    {
        return Inertia::render('public/QualityPage', [
            'company' => Setting::getPublicMap(),
        ]);
    }
}
