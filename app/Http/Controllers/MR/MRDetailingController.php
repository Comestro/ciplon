<?php

namespace App\Http\Controllers\MR;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MRDetailingController extends Controller
{
    /**
     * Render the MR E-Detailing interactive presentation studio.
     */
    public function show(Request $request): Response
    {
        $userId = $request->user()->id;

        // Fetch active products with compositions and images
        $products = Product::query()
            ->where('status', ProductStatus::ACTIVE)
            ->with([
                'category:id,name,slug',
                'compositions:id,product_id,ingredient_name,strength,unit',
                'primaryImage',
                'images',
            ])
            ->orderByDesc('is_featured')
            ->orderBy('brand_name', 'asc')
            ->get();

        // Fetch doctors strictly assigned to this MR
        $doctors = Doctor::query()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'specialization', 'clinic_hospital_name', 'city']);

        return Inertia::render('mr/Detailing', [
            'products' => $products,
            'doctors' => $doctors,
            'company' => Setting::getPublicMap(),
        ]);
    }
}
