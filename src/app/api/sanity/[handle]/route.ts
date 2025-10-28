import { NextRequest, NextResponse } from 'next/server';
import { client, getProductGallery } from '@/lib/sanity';

// Single optimized query to fetch all product data at once
const PRODUCT_DATA_QUERY = `
  {
    "features": *[_type == "productFeatures" && productHandle == $productHandle][0] {
      _id,
      _type,
      productHandle,
      features[] {
        _key,
        title,
        description,
        icon
      }
    },
    "description": *[_type == "productDescription" && productHandle == $productHandle][0] {
      _id,
      _type,
      productHandle,
      description,
      productDetails,
      returnsAndRefunds,
      careInstructions
    },
    "highlights": *[_type == "productHighlights" && productHandle == $productHandle][0] {
      _id,
      _type,
      productHandle,
      title,
      highlights[] {
        _key,
        image,
        title,
        description
      }
    },
    "faqs": *[_type == "productFAQs" && productHandle == $productHandle][0] {
      _id,
      _type,
      productHandle,
      title,
      faqs[] {
        _key,
        question,
        answer
      }
    },
    "gallery": *[_type == "productGallery" && productHandle == $productHandle][0] {
      _id,
      _type,
      productHandle,
      title,
      mediaItems[] {
        _key,
        type,
        image {
          asset,
          alt,
          caption
        },
        videoUrl,
        videoSources[] {
          url,
          format,
          mimeType
        },
        previewImage {
          asset,
          alt
        },
        order
      },
      settings {
        autoplay,
        showThumbnails,
        enableSwipe
      }
    }
  }
`;

// Cache for storing results (in-memory cache)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'all';

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
      return NextResponse.json(
        { error: 'Sanity configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.SANITY_API_TOKEN) {
      console.error('Missing SANITY_API_TOKEN environment variable');
      return NextResponse.json(
        { error: 'Sanity authentication error' },
        { status: 500 }
      );
    }

    // Check cache first
    const cacheKey = `${handle}-${type}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Returning cached data for ${handle}`);
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes
          'X-Cache': 'HIT'
        }
      });
    }

    console.log(`Fetching Sanity data for product: ${handle}, type: ${type}`);

    let result = null;

    if (type === 'all') {
      // Single optimized query for all data
      const startTime = Date.now();
      result = await client.fetch(PRODUCT_DATA_QUERY, { productHandle: handle });
      const fetchTime = Date.now() - startTime;
      console.log(`Single query completed in ${fetchTime}ms`);
    } else {
      // Individual queries for specific types
      const queries = {
        features: `*[_type == "productFeatures" && productHandle == $productHandle][0] { _id, _type, productHandle, features[] { _key, title, description, icon } }`,
        description: `*[_type == "productDescription" && productHandle == $productHandle][0] { _id, _type, productHandle, description, productDetails, returnsAndRefunds, careInstructions }`,
        highlights: `*[_type == "productHighlights" && productHandle == $productHandle][0] { _id, _type, productHandle, title, highlights[] { _key, image, title, description } }`,
        faqs: `*[_type == "productFAQs" && productHandle == $productHandle][0] { _id, _type, productHandle, title, faqs[] { _key, question, answer } }`,
        gallery: `*[_type == "productGallery" && productHandle == $productHandle][0] { _id, _type, productHandle, title, mediaItems[] { _key, type, image { asset, alt, caption }, videoUrl, videoSources[] { url, format, mimeType }, previewImage { asset, alt }, order }, settings { autoplay, showThumbnails, enableSwipe } }`
      };

      if (!queries[type as keyof typeof queries]) {
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: features, description, highlights, faqs, gallery, or all' },
          { status: 400 }
        );
      }

      const startTime = Date.now();
      result = await client.fetch(queries[type as keyof typeof queries], { productHandle: handle });
      const fetchTime = Date.now() - startTime;
      console.log(`Single ${type} query completed in ${fetchTime}ms`);
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    console.log(`Successfully fetched Sanity data for ${handle}`);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching Sanity data:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        return NextResponse.json(
          { error: 'Network error - unable to connect to Sanity' },
          { status: 503 }
        );
      }
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Sanity authentication error' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch Sanity data' },
      { status: 500 }
    );
  }
}
