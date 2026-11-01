import { Head } from '@inertiajs/react';

/**
 * SeoHead component for dynamic page SEO, OpenGraph, Twitter Cards, and JSON-LD schema
 */
export default function SeoHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/images/ciplon_logo.png',
  ogType = 'website',
  schemaJson,
}) {
  const defaultTitle = 'Ciplon Pharma — WHO-GMP & ISO 9001:2015 Certified Finished Formulations';
  const defaultDesc =
    'Ciplon Pharma Private Limited is an ISO 9001:2015 certified pharmaceutical company providing WHO-GMP finished formulations, PCD pharma franchises, and institutional supply across India.';
  const defaultKeywords =
    'Ciplon Pharma, pharmaceutical manufacturer, WHO-GMP formulations, PCD pharma franchise India, medicine third party manufacturing, pharmaceutical distributor Delhi, Walpar Wellness';

  const metaTitle = title ? `${title} | Ciplon Pharma` : defaultTitle;
  const metaDescription = description || defaultDesc;
  const metaKeywords = keywords || defaultKeywords;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Ciplon Pharma Private Limited" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@ciplon_pharma" />

      {/* Structured Data (JSON-LD) */}
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}
    </Head>
  );
}

