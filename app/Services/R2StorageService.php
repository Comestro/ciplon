<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class R2StorageService
{
    public const DISK = 'r2';

    /**
     * Upload a file from an UploadedFile instance to Cloudflare R2.
     *
     * @return array{key: string, url: string, file_name: string, file_path: string, size: int, mime_type: string, disk: string}
     */
    public function upload(UploadedFile $file, string $folder = 'products', ?string $customFileName = null): array
    {
        $extension = $file->getClientOriginalExtension() ?: $file->extension() ?: 'bin';
        $baseName = $customFileName
            ? pathinfo($customFileName, PATHINFO_FILENAME)
            : (pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) ?: 'file');

        $fileName = $this->buildUniqueFileName($baseName, $extension);
        $folder = trim($folder, '/');
        $mimeType = $file->getClientMimeType() ?: ($file->getMimeType() ?: 'application/octet-stream');
        $size = $file->getSize() ?: 0;

        $path = Storage::disk(self::DISK)->putFileAs($folder, $file, $fileName, [
            'visibility' => 'public',
            'ContentType' => $mimeType,
        ]);

        if (! $path) {
            throw new \RuntimeException('Failed to upload file to Cloudflare R2.');
        }

        return [
            'key' => $path,
            'url' => $this->url($path),
            'file_name' => basename($path),
            'file_path' => $path,
            'size' => $size,
            'mime_type' => $mimeType,
            'disk' => self::DISK,
        ];
    }

    /**
     * Upload a file from a local filesystem path to Cloudflare R2.
     *
     * @return array{key: string, url: string, file_name: string, file_path: string, size: int, mime_type: string, disk: string}
     */
    public function uploadFromPath(
        string $filePath,
        string $originalFileName,
        string $folder = 'products',
        int $fileSize = 0,
        string $mimeType = 'image/jpeg'
    ): array {
        if (! is_file($filePath) || ! is_readable($filePath)) {
            throw new \RuntimeException("Source file is missing or unreadable: {$filePath}");
        }

        $extension = pathinfo($originalFileName, PATHINFO_EXTENSION) ?: 'bin';
        $baseName = pathinfo($originalFileName, PATHINFO_FILENAME) ?: 'file';
        $fileName = $this->buildUniqueFileName($baseName, $extension);
        $folder = trim($folder, '/');
        $objectKey = $folder !== '' ? "{$folder}/{$fileName}" : $fileName;
        $size = $fileSize > 0 ? $fileSize : (filesize($filePath) ?: 0);

        $stream = fopen($filePath, 'rb');
        if ($stream === false) {
            throw new \RuntimeException("Unable to open file stream for: {$filePath}");
        }

        try {
            $uploaded = Storage::disk(self::DISK)->put($objectKey, $stream, [
                'visibility' => 'public',
                'ContentType' => $mimeType,
            ]);
        } finally {
            fclose($stream);
        }

        if (! $uploaded) {
            throw new \RuntimeException('Failed to upload file stream to Cloudflare R2.');
        }

        return [
            'key' => $objectKey,
            'url' => $this->url($objectKey),
            'file_name' => $fileName,
            'file_path' => $objectKey,
            'size' => $size,
            'mime_type' => $mimeType,
            'disk' => self::DISK,
        ];
    }

    /**
     * Delete a file from Cloudflare R2 by object key or public URL.
     */
    public function delete(string $pathOrUrl): bool
    {
        $key = $this->normalizeKey($pathOrUrl);
        if ($key === '') {
            return false;
        }

        try {
            return Storage::disk(self::DISK)->delete($key);
        } catch (\Throwable $e) {
            Log::warning('Cloudflare R2 delete failed: '.$e->getMessage(), ['key' => $key]);

            return false;
        }
    }

    /**
     * Resolve the public URL for an R2 object key.
     */
    public function url(string $path): string
    {
        return Storage::disk(self::DISK)->url(ltrim($path, '/'));
    }

    /**
     * Normalize an object key or full URL into a relative R2 key.
     */
    protected function normalizeKey(string $pathOrUrl): string
    {
        $trimmed = trim($pathOrUrl);
        if ($trimmed === '') {
            return '';
        }

        $baseUrl = rtrim((string) config('filesystems.disks.'.self::DISK.'.url'), '/');
        if ($baseUrl !== '' && str_starts_with($trimmed, $baseUrl)) {
            return ltrim(substr($trimmed, strlen($baseUrl)), '/');
        }

        if (str_starts_with($trimmed, 'http://') || str_starts_with($trimmed, 'https://')) {
            $parsedPath = parse_url($trimmed, PHP_URL_PATH);

            return ltrim((string) $parsedPath, '/');
        }

        return ltrim($trimmed, '/');
    }

    protected function buildUniqueFileName(string $baseName, string $extension): string
    {
        $slug = Str::slug($baseName) ?: 'file';
        $ext = strtolower(ltrim($extension, '.'));

        return "{$slug}_".time().'_'.Str::lower(Str::random(6)).".{$ext}";
    }
}
