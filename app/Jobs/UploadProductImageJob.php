<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\R2StorageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadProductImageJob implements ShouldQueue
{
    use Queueable;

    // Number of times the job may be attempted.
    public int $tries = 3;

    // Number of seconds to wait before retrying the job.
    public int $backoff = 5;

    // Create a new job instance with product ID and temp upload information.
    public function __construct(
        public int $productId,
        public string $tempRelativePath,
        public string $originalFileName,
        public ?string $mimeType = null,
        public ?int $fileSize = null,
        public int $sortOrder = 0,
    ) {}

    // Execute the job: upload temporary image to Cloudflare R2 and attach image record to product.
    public function handle(R2StorageService $r2): void
    {
        $disk = Storage::disk('local');
        $fullPath = $disk->path($this->tempRelativePath);

        // Verify the temporary file still exists
        if (! file_exists($fullPath)) {
            Log::warning("UploadProductImageJob: Temporary file not found at {$fullPath}");

            return;
        }

        // Verify the product still exists
        $product = Product::find($this->productId);
        if (! $product) {
            Log::warning("UploadProductImageJob: Product #{$this->productId} not found");
            $disk->delete($this->tempRelativePath);

            return;
        }

        try {
            // Upload to Cloudflare R2 products folder
            $uploadData = $r2->uploadFromPath(
                filePath: $fullPath,
                originalFileName: $this->originalFileName,
                folder: 'products',
                fileSize: $this->fileSize ?? (filesize($fullPath) ?: 0),
                mimeType: $this->mimeType ?? (mime_content_type($fullPath) ?: 'image/jpeg')
            );

            // Create image relationship record on the product
            $product->images()->create([
                'collection' => 'product-image',
                'file_name' => $uploadData['file_name'],
                'file_path' => $uploadData['file_path'],
                'mime_type' => $uploadData['mime_type'],
                'disk' => $uploadData['disk'],
                'size' => $uploadData['size'],
                'alt_text' => $product->brand_name.' Product Image',
                'sort_order' => $this->sortOrder,
            ]);

            // Clean up temporary local file
            $disk->delete($this->tempRelativePath);

            Log::info("UploadProductImageJob: Successfully uploaded image for Product #{$this->productId} to Cloudflare R2");
        } catch (\Throwable $e) {
            Log::error("UploadProductImageJob failed for Product #{$this->productId}: ".$e->getMessage());

            // Rethrow so the queue worker handles retries according to $tries
            throw $e;
        }
    }

    // Handle a job failure when all retries are exhausted.
    public function failed(?\Throwable $exception): void
    {
        Log::error("UploadProductImageJob permanently failed for Product #{$this->productId}: ".($exception ? $exception->getMessage() : 'Unknown error'));

        $disk = Storage::disk('local');
        if ($disk->exists($this->tempRelativePath)) {
            $disk->delete($this->tempRelativePath);
        }
    }
}
