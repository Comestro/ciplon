<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /**
     * Generate an XML sitemap for search engine crawlers.
     */
    public function sitemap(): Response
    {
        $baseUrl = rtrim(config('app.url', 'https://www.ciplonpharma.in'), '/');

        $staticPages = [
            [
                'loc' => $baseUrl,
                'lastmod' => now()->startOfDay()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ],
            [
                'loc' => "{$baseUrl}/about",
                'lastmod' => now()->startOfMonth()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ],
            [
                'loc' => "{$baseUrl}/products",
                'lastmod' => now()->startOfWeek()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
            [
                'loc' => "{$baseUrl}/quality",
                'lastmod' => now()->startOfMonth()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ],
            [
                'loc' => "{$baseUrl}/contact",
                'lastmod' => now()->startOfMonth()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
        ];

        $categories = Category::query()
            ->where('status', 'active')
            ->get(['slug', 'updated_at']);

        $categoryPages = $categories->map(function ($cat) use ($baseUrl) {
            return [
                'loc' => "{$baseUrl}/products?category=".urlencode($cat->slug),
                'lastmod' => ($cat->updated_at ?? now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        });

        $products = Product::query()
            ->where('status', 'active')
            ->get(['id', 'slug', 'product_code', 'updated_at']);

        $productPages = $products->map(function ($product) use ($baseUrl) {
            $identifier = $product->slug ?: $product->product_code ?: $product->id;

            return [
                'loc' => "{$baseUrl}/products/{$identifier}",
                'lastmod' => ($product->updated_at ?? now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.9',
            ];
        });

        $urls = collect($staticPages)->concat($categoryPages)->concat($productPages);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($urls as $item) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($item['loc'], ENT_XML1, 'UTF-8').'</loc>';
            $xml .= '<lastmod>'.$item['lastmod'].'</lastmod>';
            $xml .= '<changefreq>'.$item['changefreq'].'</changefreq>';
            $xml .= '<priority>'.$item['priority'].'</priority>';
            $xml .= '</url>';
        }
        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }

    /**
     * Generate an SEO robots.txt file with crawler rules and sitemap location.
     */
    public function robots(): Response
    {
        $baseUrl = rtrim(config('app.url', 'https://www.ciplonpharma.in'), '/');

        $content = "User-agent: *\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /mr/\n";
        $content .= "Disallow: /mrconnect/\n";
        $content .= "Disallow: /api/\n";
        $content .= "Disallow: /login\n";
        $content .= "Allow: /\n\n";
        $content .= "Sitemap: {$baseUrl}/sitemap.xml\n";

        return response($content, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
        ]);
    }
}
