<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnquiryController extends Controller
{
    /**
     * Display a listing of commercial and product inquiries.
     */
    public function index(Request $request): Response
    {
        $query = Enquiry::query();

        if ($request->filled('search')) {
            $search = trim($request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('inquiry_type', 'like', "%{$search}%")
                    ->orWhere('product_name', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        $enquiries = $query->latest('id')->paginate(15)->withQueryString();

        $stats = [
            'total' => Enquiry::count(),
            'pending' => Enquiry::where('status', 'pending')->count(),
            'contacted' => Enquiry::where('status', 'contacted')->count(),
            'resolved' => Enquiry::where('status', 'resolved')->count(),
        ];

        return Inertia::render('admin/enquiry/EnquiryIndex', [
            'enquiries' => $enquiries,
            'stats' => $stats,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', 'all'),
            ],
        ]);
    }

    /**
     * Update the status and admin notes for an inquiry.
     */
    public function updateStatus(Request $request, Enquiry $enquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,contacted,resolved,closed'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $enquiry->update($validated);

        return back()->with('success', 'Inquiry status updated successfully.');
    }

    /**
     * Remove the specified inquiry from storage.
     */
    public function destroy(Enquiry $enquiry): RedirectResponse
    {
        $enquiry->delete();

        return back()->with('success', 'Inquiry deleted successfully.');
    }
}
