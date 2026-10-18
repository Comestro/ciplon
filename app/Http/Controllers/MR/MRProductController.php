<?php

namespace App\Http\Controllers\MR;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MRProductController extends Controller
{
    /**
     * Render the MR Digital Detailing & Products catalog page.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('mr/Products', [
            'initialFilters' => [
                'search' => $request->query('search', ''),
                'category' => $request->query('category', 'all'),
                'dosage_form' => $request->query('dosage_form', 'all'),
            ],
        ]);
    }

    /**
     * API: List active Ciplon products for MR detailing.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::where('status', ProductStatus::ACTIVE)
            ->with([
                'category:id,name,slug',
                'compositions:id,product_id,ingredient_name,strength,unit',
                'primaryImage',
                'images',
                'slides' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
                'slides' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
            ]);

        // Filter by Category
        if ($request->filled('category') && $request->query('category') !== 'all') {
            $cat = $request->query('category');
            $query->whereHas('category', function ($q) use ($cat) {
                if (is_numeric($cat)) {
                    $q->where('id', $cat);
                } else {
                    $q->where('slug', $cat);
                }
            });
        }

        // Filter by Dosage Form
        if ($request->filled('dosage_form') && $request->query('dosage_form') !== 'all') {
            $query->where('dosage_form', $request->query('dosage_form'));
        }

        // Filter by Search Query
        if ($request->filled('search')) {
            $term = trim($request->query('search'));
            $query->where(function ($q) use ($term) {
                $q->where('brand_name', 'like', "%{$term}%")
                  ->orWhere('generic_name', 'like', "%{$term}%")
                  ->orWhere('product_code', 'like', "%{$term}%")
                  ->orWhere('indications', 'like', "%{$term}%")
                  ->orWhereHas('compositions', function ($cq) use ($term) {
                      $cq->where('ingredient_name', 'like', "%{$term}%");
                  });
            });
        }

        $sortField = $request->query('sort_by', 'brand_name');
        $sortOrder = $request->query('sort_order', 'asc');
        $allowedSorts = ['brand_name', 'generic_name', 'created_at', 'dosage_form'];

        if (in_array($sortField, $allowedSorts, true)) {
            $query->orderBy($sortField, $sortOrder === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('brand_name', 'asc');
        }

        $products = $query->get();

        // Calculate metadata for MR filter pills and metrics
        $allActive = Product::where('status', ProductStatus::ACTIVE)->get();
        $categories = Category::has('products')
            ->select('id', 'name', 'slug')
            ->withCount(['products' => function ($q) {
                $q->where('status', ProductStatus::ACTIVE);
            }])
            ->get();

        $dosageForms = $allActive->pluck('dosage_form')->filter()->unique()->values()->all();

        $meta = [
            'total' => $allActive->count(),
            'filtered_total' => $products->count(),
            'categories' => $categories,
            'dosage_forms' => $dosageForms,
            'featured_count' => $allActive->where('is_featured', true)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $products,
            'meta' => $meta,
        ]);
    }

    /**
     * API: Display single product detailing guide & visual aid slides.
     */
    public function showProduct(int $id): JsonResponse
    {
        $product = Product::where('status', ProductStatus::ACTIVE)
            ->with([
                'category',
                'compositions',
                'images',
                'slides' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
            ])
            ->findOrFail($id);

        // Pre-structure e-detailing visual presentation slides
        $slides = [
            [
                'slide_number' => 1,
                'title' => 'Molecule Introduction & Composition',
                'subtitle' => $product->generic_name,
                'headline' => "Next-generation therapeutic profile: {$product->brand_name}",
                'content' => $product->short_description ?: $product->description,
                'compositions' => $product->compositions,
                'dosage_form' => $product->dosage_form,
                'strength' => $product->strength,
                'type' => 'intro',
            ],
            [
                'slide_number' => 2,
                'title' => 'Clinical Indications & Pharmacology',
                'subtitle' => 'Target Patient Profile',
                'headline' => 'Proven symptomatic alleviation and therapeutic control',
                'content' => $product->indications,
                'directions' => $product->directions,
                'type' => 'indications',
            ],
            [
                'slide_number' => 3,
                'title' => 'Dosage Guidelines & Safety Profile',
                'subtitle' => 'Administration & Tolerability',
                'headline' => 'Optimized bio-availability with superior patient compliance',
                'content' => $product->directions ?: 'Standard clinical dosage as advised by the consulting physician.',
                'precautions' => $product->precautions,
                'storage' => $product->storage,
                'prescription_type' => $product->prescription_type,
                'type' => 'dosage_safety',
            ],
            [
                'slide_number' => 4,
                'title' => 'The Ciplon Competitive Edge',
                'subtitle' => 'Summary & Detailing Takeaways',
                'headline' => 'Why choose Ciplon healthcare formulations?',
                'bullet_points' => [
                    'Stringent GMP-certified manufacturing and quality control standards',
                    'Higher bioavailability formulation ensuring rapid onset of clinical action',
                    'Patient-friendly packaging and moisture-resistant blister/strip design',
                    'Affordable pricing model maximizing prescription adherence and therapy completion',
                ],
                'type' => 'competitive_edge',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $product,
            'visual_aid_slides' => $slides,
        ]);
    }
}