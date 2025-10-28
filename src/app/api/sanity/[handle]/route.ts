import { NextRequest, NextResponse } from 'next/server';
import { getProductFeatures, getProductDescription, getProductHighlights, getProductFAQs } from '@/lib/sanity';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

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

    console.log(`Fetching Sanity data for product: ${handle}, type: ${type}`);

    let result = null;

    switch (type) {
      case 'features':
        result = await getProductFeatures(handle);
        break;
      case 'description':
        result = await getProductDescription(handle);
        break;
      case 'highlights':
        result = await getProductHighlights(handle);
        break;
      case 'faqs':
        result = await getProductFAQs(handle);
        break;
      case 'all':
        const [features, description, highlights, faqs] = await Promise.all([
          getProductFeatures(handle),
          getProductDescription(handle),
          getProductHighlights(handle),
          getProductFAQs(handle)
        ]);
        result = { features, description, highlights, faqs };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: features, description, highlights, faqs, or all' },
          { status: 400 }
        );
    }

    console.log(`Successfully fetched Sanity data for ${handle}:`, result);
    return NextResponse.json(result);
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
