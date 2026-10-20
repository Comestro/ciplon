<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductSlideController extends Controller
{
    /**
     * Display the visual aid slides carousel manager for a product.
     */
    public function index(Product $product): Response
    {
        $product->load([
            'category:id,name,slug',
            'primaryImage',
            'slides' => fn ($q) => $q->orderBy('sort_order')->orderBy('id'),
        ]);

        return Inertia::render('admin/product/ProductSlides', [
            'product' => $product,
            'slides' => $product->slides,
        ]);
    }

    /**
     * Store new slide image(s) for the product carousel.
     * Supports single or batch image uploads.
     */
    public function store(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'images' => ['nullable', 'array'],
            'images.*' => ['required', 'file', 'mimes:jpeg,png,jpg,webp,svg', 'max:10240'],
            'image' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp,svg', 'max:10240'],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $files = [];
        if ($request->hasFile('images')) {
            $files = $request->file('images');
        } elseif ($request->hasFile('image')) {
            $files = [$request->file('image')];
        }

        if (empty($files)) {
            return redirect()->back()->withErrors(['image' => 'Please select at least one slide image to upload.']);
        }

        $currentMax = (int) $product->slides()->max('sort_order');

        foreach ($files as $idx => $file) {
            $stored = $file->store('product-slides', 'public');
            $imagePath = '/storage/'.$stored;
            $order = $currentMax + $idx + 1;
            $title = $request->input('title') ?: ('Slide '.$order);

            $product->slides()->create([
                'title' => $title,
                'image_path' => $imagePath,
                'sort_order' => $order,
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', count($files).' slide image(s) added to carousel.');
    }

    /**
     * Update an individual slide (title or replace image).
     */
    public function update(Request $request, Product $product, ProductSlide $slide): RedirectResponse
    {
        if ($slide->product_id !== $product->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp,svg', 'max:10240'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $imagePath = $slide->image_path;

        if ($request->hasFile('image')) {
            if ($slide->image_path) {
                $relative = str_replace('/storage/', '', $slide->image_path);
                Storage::disk('public')->delete($relative);
            }
            $stored = $request->file('image')->store('product-slides', 'public');
            $imagePath = '/storage/'.$stored;
        }

        $slide->update([
            'title' => $validated['title'] ?: $slide->title,
            'image_path' => $imagePath,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $slide->is_active,
        ]);

        return redirect()->back()->with('success', 'Slide updated successfully.');
    }

    /**
     * Delete a slide image from the carousel.
     */
    public function destroy(Product $product, ProductSlide $slide): RedirectResponse
    {
        if ($slide->product_id !== $product->id) {
            abort(404);
        }

        if ($slide->image_path) {
            $relative = str_replace('/storage/', '', $slide->image_path);
            Storage::disk('public')->delete($relative);
        }

        $slide->delete();

        // Re-sequence remaining slides in order
        $remaining = $product->slides()->orderBy('sort_order')->get();
        foreach ($remaining as $idx => $s) {
            $s->update(['sort_order' => $idx + 1]);
        }

        return redirect()->back()->with('success', 'Slide removed from carousel.');
    }

    /**
     * Reorder carousel slides.
     */
    public function reorder(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'slide_ids' => ['required', 'array'],
            'slide_ids.*' => ['integer'],
        ]);

        foreach ($validated['slide_ids'] as $order => $slideId) {
            $product->slides()->where('id', $slideId)->update(['sort_order' => $order + 1]);
        }

        return redirect()->back()->with('success', 'Carousel order updated.');
    }

    /**
     * Toggle visibility of a slide.
     */
    public function toggleStatus(Product $product, ProductSlide $slide): RedirectResponse
    {
        if ($slide->product_id !== $product->id) {
            abort(404);
        }

        $slide->update(['is_active' => ! $slide->is_active]);

        return redirect()->back()->with('success', 'Slide visibility toggled.');
    }
}
