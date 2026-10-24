<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Jobs\UploadProductImageJob;
use App\Models\Category;
use App\Models\Product;
use App\Services\ImageKitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    // Display a paginated listing of products with filters.
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['category:id,name,slug', 'primaryImage', 'images'])
            ->withCount('compositions');

        if ($request->filled('search')) {
            $search = trim($request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('brand_name', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', (int) $request->query('category_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('is_featured') && $request->query('is_featured') !== '') {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        $perPage = (int) $request->query('per_page', 12);
        $products = $query->latest('id')->paginate($perPage)->withQueryString();

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('admin/product/ProductList', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->query('search', ''),
                'category_id' => $request->query('category_id', ''),
                'status' => $request->query('status', ''),
                'is_featured' => $request->query('is_featured', ''),
            ],
        ]);
    }

    // Show the form for creating a new product.
    public function create(): Response
    {
        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('admin/product/ProductForm', [
            'categories' => $categories,
        ]);
    }

    // Store a newly created product in database.
    public function store(Request $request, ImageKitService $imageKit): RedirectResponse
    {
        // Decode compositions if sent as a JSON string in multipart/form-data
        if ($request->has('compositions') && is_string($request->input('compositions'))) {
            $decoded = json_decode($request->input('compositions'), true);
            if (is_array($decoded)) {
                $request->merge(['compositions' => $decoded]);
            }
        }

        $validated = $request->validate([
            'brand_name' => ['required', 'string', 'max:255'],
            'generic_name' => ['nullable', 'string', 'max:255'],
            'product_code' => ['nullable', 'string', 'max:100', 'unique:products,product_code'],
            'category_id' => ['required', 'exists:categories,id'],
            'dosage_form' => ['nullable', 'string', 'max:100'],
            'strength' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'indications' => ['nullable', 'string'],
            'directions' => ['nullable', 'string'],
            'precautions' => ['nullable', 'string'],
            'storage' => ['nullable', 'string'],
            'prescription_type' => ['nullable', 'string', 'max:50'],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'is_featured' => ['nullable', 'boolean'],
            'compositions' => ['nullable', 'array'],
            'compositions.*.ingredient_name' => ['required_with:compositions', 'string', 'max:255'],
            'compositions.*.strength' => ['required_with:compositions', 'string', 'max:100'],
            'compositions.*.unit' => ['nullable', 'string', 'max:50'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $product = DB::transaction(function () use ($validated, $request) {
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'brand_name' => $validated['brand_name'],
                'generic_name' => $validated['generic_name'] ?? null,
                'product_code' => $validated['product_code'] ?? null,
                'slug' => Product::generateUniqueSlug($validated['brand_name']),
                'dosage_form' => $validated['dosage_form'] ?? null,
                'strength' => $validated['strength'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'indications' => $validated['indications'] ?? null,
                'directions' => $validated['directions'] ?? null,
                'precautions' => $validated['precautions'] ?? null,
                'storage' => $validated['storage'] ?? null,
                'prescription_type' => $validated['prescription_type'] ?? null,
                'status' => $validated['status'],
                'is_featured' => $request->boolean('is_featured', false),
                'created_by' => $request->user()?->id,
                'updated_by' => $request->user()?->id,
            ]);

            // Save compositions
            if (! empty($validated['compositions'])) {
                foreach ($validated['compositions'] as $comp) {
                    if (! empty($comp['ingredient_name']) && ! empty($comp['strength'])) {
                        $product->compositions()->create([
                            'ingredient_name' => $comp['ingredient_name'],
                            'strength' => $comp['strength'],
                            'unit' => $comp['unit'] ?? 'mg',
                        ]);
                    }
                }
            }

            // Handle image uploads via queued background job
            if ($request->hasFile('images')) {
                $sortOrder = 0;
                foreach ($request->file('images') as $file) {
                    $tempPath = $file->store('temp-uploads', 'local');
                    UploadProductImageJob::dispatch(
                        productId: $product->id,
                        tempRelativePath: $tempPath,
                        originalFileName: $file->getClientOriginalName(),
                        mimeType: $file->getClientMimeType(),
                        fileSize: $file->getSize(),
                        sortOrder: $sortOrder++
                    );
                }
            }

            return $product;
        });

        return redirect()->route('admin.products.index')->with('success', "Product \"{$product->brand_name}\" created successfully.");
    }

    // Display the specified product.
    public function show(Product $product): Response
    {
        $product->load([
            'category:id,name,slug',
            'compositions',
            'images',
            'primaryImage',
            'creator:id,name,email',
            'updater:id,name,email',
        ]);

        return Inertia::render('admin/product/ProductDetails', [
            'product' => $product,
        ]);
    }

    // Show the form for editing an existing product.
    public function edit(Product $product): Response
    {
        $product->load([
            'category:id,name,slug',
            'compositions',
            'images',
            'primaryImage',
        ]);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('admin/product/ProductForm', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    // Update the specified product in database.
    public function update(Request $request, Product $product, ImageKitService $imageKit): RedirectResponse
    {
        if ($request->has('compositions') && is_string($request->input('compositions'))) {
            $decoded = json_decode($request->input('compositions'), true);
            if (is_array($decoded)) {
                $request->merge(['compositions' => $decoded]);
            }
        }

        if ($request->has('removed_image_ids') && is_string($request->input('removed_image_ids'))) {
            $decoded = json_decode($request->input('removed_image_ids'), true);
            if (is_array($decoded)) {
                $request->merge(['removed_image_ids' => $decoded]);
            }
        }

        $validated = $request->validate([
            'brand_name' => ['required', 'string', 'max:255'],
            'generic_name' => ['nullable', 'string', 'max:255'],
            'product_code' => ['nullable', 'string', 'max:100', Rule::unique('products', 'product_code')->ignore($product->id)],
            'category_id' => ['required', 'exists:categories,id'],
            'dosage_form' => ['nullable', 'string', 'max:100'],
            'strength' => ['nullable', 'string', 'max:100'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'indications' => ['nullable', 'string'],
            'directions' => ['nullable', 'string'],
            'precautions' => ['nullable', 'string'],
            'storage' => ['nullable', 'string'],
            'prescription_type' => ['nullable', 'string', 'max:50'],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'is_featured' => ['nullable', 'boolean'],
            'compositions' => ['nullable', 'array'],
            'compositions.*.ingredient_name' => ['required_with:compositions', 'string', 'max:255'],
            'compositions.*.strength' => ['required_with:compositions', 'string', 'max:100'],
            'compositions.*.unit' => ['nullable', 'string', 'max:50'],
            'removed_image_ids' => ['nullable', 'array'],
            'removed_image_ids.*' => ['integer'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $slug = $product->brand_name !== $validated['brand_name']
            ? Product::generateUniqueSlug($validated['brand_name'], $product->id)
            : $product->slug;

        DB::transaction(function () use ($product, $validated, $request, $slug, $imageKit) {
            $product->update([
                'category_id' => $validated['category_id'],
                'brand_name' => $validated['brand_name'],
                'generic_name' => $validated['generic_name'] ?? null,
                'product_code' => $validated['product_code'] ?? null,
                'slug' => $slug,
                'dosage_form' => $validated['dosage_form'] ?? null,
                'strength' => $validated['strength'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'indications' => $validated['indications'] ?? null,
                'directions' => $validated['directions'] ?? null,
                'precautions' => $validated['precautions'] ?? null,
                'storage' => $validated['storage'] ?? null,
                'prescription_type' => $validated['prescription_type'] ?? null,
                'status' => $validated['status'],
                'is_featured' => $request->boolean('is_featured', false),
                'updated_by' => $request->user()?->id,
            ]);

            // Synchronize compositions: remove old and insert current set
            if (isset($validated['compositions'])) {
                $product->compositions()->delete();
                foreach ($validated['compositions'] as $comp) {
                    if (! empty($comp['ingredient_name']) && ! empty($comp['strength'])) {
                        $product->compositions()->create([
                            'ingredient_name' => $comp['ingredient_name'],
                            'strength' => $comp['strength'],
                            'unit' => $comp['unit'] ?? 'mg',
                        ]);
                    }
                }
            }

            // Delete requested images
            if (! empty($validated['removed_image_ids'])) {
                $imagesToDelete = $product->images()->whereIn('id', $validated['removed_image_ids'])->get();
                foreach ($imagesToDelete as $img) {
                    if ($img->disk === 'imagekit' && ! empty($img->alt_text)) {
                        $imageKit->delete($img->alt_text); // alt_text holds fileId for imagekit
                    } elseif ($img->disk === 'public') {
                        Storage::disk('public')->delete($img->file_path);
                    }
                    $img->delete();
                }
            }

            // Upload new images via queued background job
            if ($request->hasFile('images')) {
                $currentMaxSort = (int) $product->images()->max('sort_order');
                foreach ($request->file('images') as $file) {
                    $tempPath = $file->store('temp-uploads', 'local');
                    UploadProductImageJob::dispatch(
                        productId: $product->id,
                        tempRelativePath: $tempPath,
                        originalFileName: $file->getClientOriginalName(),
                        mimeType: $file->getClientMimeType(),
                        fileSize: $file->getSize(),
                        sortOrder: ++$currentMaxSort
                    );
                }
            }
        });

        return redirect()->route('admin.products.index')->with('success', "Product \"{$product->brand_name}\" updated successfully.");
    }

    // Remove the specified product and its compositions and images.
    public function destroy(Product $product, ImageKitService $imageKit): RedirectResponse
    {
        DB::transaction(function () use ($product, $imageKit) {
            // Delete compositions
            $product->compositions()->delete();

            // Delete images
            foreach ($product->images as $img) {
                if ($img->disk === 'imagekit' && ! empty($img->alt_text)) {
                    $imageKit->delete($img->alt_text);
                } elseif ($img->disk === 'public') {
                    Storage::disk('public')->delete($img->file_path);
                }
                $img->delete();
            }

            $product->delete();
        });

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    // Update product status.
    public function updateStatus(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(ProductStatus::class)],
        ]);

        $product->update([
            'status' => $validated['status'],
            'updated_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Product status updated successfully.');
    }
}
