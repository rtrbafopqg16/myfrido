<!-- 029596f4-112b-4a47-a3b1-0f53e3916f77 9cdb2846-05ef-4c60-88aa-3e3c74940e58 -->
# Fast D2C Website with Shopify Integration

## Architecture Overview

**Tech Stack:**

- **Frontend:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS + Custom UI components (provided by user)
- **Backend Integration:** Shopify Storefront API (GraphQL)
- **CMS:** Sanity.io for content management
- **Media:** Cloudinary for optimized images/videos
- **A/B Testing:** Vercel Edge Config + Analytics
- **Hosting:** Vercel (Edge Functions + ISR)
- **Performance:** React Server Components, Streaming SSR, Edge Caching

## Phase 1: Foundation & Single Page Demo (Week 1-2)

### Core Setup

1. Initialize Next.js 14 project with TypeScript and App Router
2. Configure Tailwind CSS + Shadcn UI components
3. Set up Shopify Storefront API connection
4. Integrate Sanity CMS with real-time preview
5. Configure Cloudinary for image optimization

### Single Test Page

Create a high-performance product listing page with:

- Server-side rendered product data from Shopify
- CMS-driven hero section, banners, and content blocks
- Cloudinary-optimized images with automatic format selection (WebP/AVIF)
- Lazy loading and skeleton loaders
- Performance score target: 95+ on Lighthouse

### Performance Optimizations

- Image optimization with next/image + Cloudinary
- Font optimization (next/font)
- Code splitting and dynamic imports
- Edge caching strategy
- Prefetching critical resources

## Phase 2: Core E-commerce Features (Week 3-4)

### Product Pages

- Dynamic product detail pages (SSG with ISR)
- Product variants and options
- Image galleries with zoom
- Related products

### Shopping Cart

- Client-side cart management (Zustand/Context)
- Persistent cart (localStorage + Shopify Cart API)
- Real-time inventory checks
- Cart abandonment tracking

### Search & Filtering

- Product search with Algolia/Typesense
- Faceted filtering (category, price, attributes)
- Sort options
- Instant search results

## Phase 3: Checkout & Payments (Week 5)

### Checkout Flow

- Multi-step checkout process
- Shopify Checkout API integration
- Guest checkout option
- Address validation
- Shipping method selection

### Payment Integration

- Leverage Shopify's payment gateway
- Multiple payment options
- Secure redirect to Shopify checkout
- Post-purchase redirect back to custom site

## Phase 4: A/B Testing Infrastructure (Week 6-7)

### Testing Framework

- Vercel Edge Middleware for A/B test routing
- Edge Config for experiment configuration
- Analytics integration (Vercel Analytics + Google Analytics 4)
- Custom event tracking

### Testable Elements

- Hero images and banners (CMS-driven)
- Product page layouts
- CTA buttons and copy
- Full page variants
- Product card designs
- Checkout flows

### A/B Testing Setup

```typescript
// middleware.ts - Edge-based A/B testing
export async function middleware(request: NextRequest) {
  const variant = getABTestVariant(request);
  const response = NextResponse.next();
  response.cookies.set('ab-test-variant', variant);
  return response;
}
```

## Phase 5: Advanced Features (Week 8-10)

### Content Management

- Sanity Studio for non-technical users
- Page builder with reusable components
- Dynamic landing pages
- Blog/Content sections
- SEO metadata management

### Performance Monitoring

- Real User Monitoring (Vercel Speed Insights)
- Core Web Vitals tracking
- Error tracking (Sentry)
- Conversion funnel analytics

### Additional Features

- User authentication (Shopify Customer API)
- Order history
- Wishlist functionality
- Product reviews
- Email capture (Klaviyo/Mailchimp)
- Push notifications

## Phase 6: Optimization & Launch (Week 11-12)

### Pre-launch Checklist

- Load testing (handle 10k+ concurrent users)
- Mobile optimization (95+ mobile Lighthouse score)
- Accessibility audit (WCAG 2.1 AA)
- SEO optimization
- Analytics verification
- A/B testing validation

### Launch Strategy

- Gradual traffic migration (10% → 50% → 100%)
- Monitor key metrics (bounce rate, conversion rate, page load times)
- Rollback plan if issues detected
- CDN warming
- Database query optimization

## Performance Guarantees

### Target Metrics

- **Lighthouse Score:** 95+ (Performance)
- **Time to First Byte (TTFB):** < 200ms (Edge)
- **First Contentful Paint (FCP):** < 1.0s
- **Largest Contentful Paint (LCP):** < 2.0s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 2.5s

### Anti-Dropoff Strategies

1. **Instant page transitions** with prefetching
2. **Optimistic UI updates** for cart actions
3. **Progressive image loading** with blur placeholders
4. **Skeleton screens** during data fetching
5. **Error boundaries** with fallback UI
6. **Offline support** with service workers
7. **Auto-save** cart and form data
8. **Loading states** for all async operations

## File Structure

```
/src
  /app
    /page.tsx                    # Homepage (test page for Phase 1)
    /products/[handle]/page.tsx  # Product detail pages
    /cart/page.tsx               # Cart page
    /collections/[handle]/page.tsx
  /components
    /ui                          # Shadcn components
    /product                     # Product card, gallery, etc.
    /cart                        # Cart components
    /checkout                    # Checkout components
  /lib
    /shopify.ts                  # Shopify API client
    /sanity.ts                   # Sanity client
    /cloudinary.ts               # Cloudinary helpers
    /ab-testing.ts               # A/B testing utilities
  /sanity
    /schemas                     # Content schemas
    /studio                      # Sanity Studio config
  /middleware.ts                 # Edge middleware for A/B tests
  /types                         # TypeScript definitions
```

## Environment Variables

```env
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
SHOPIFY_ADMIN_ACCESS_TOKEN=xxx

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Vercel (auto-configured)
VERCEL_URL=auto
EDGE_CONFIG=auto
```

## Immediate Next Steps (Phase 1 - Single Test Page)

1. Create Next.js project with TypeScript and App Router
2. Install dependencies (Tailwind, Shadcn, Shopify SDK, Sanity client)
3. Set up Shopify Storefront API connection
4. Create Sanity project and schemas
5. Build single homepage with product grid
6. Implement image optimization with Cloudinary
7. Deploy to Vercel
8. Measure and optimize performance metrics

### To-dos

- [ ] Initialize Next.js 14 project with TypeScript, App Router, Tailwind CSS, and ESLint
- [ ] Install Shadcn UI, Shopify Storefront API SDK, Sanity client, and Cloudinary SDK
- [ ] Configure Shopify Storefront API client with GraphQL queries for products
- [ ] Set up Sanity CMS project with schemas for hero sections, banners, and page content
- [ ] Configure Cloudinary integration with Next.js Image component for optimal delivery
- [ ] Create high-performance homepage with hero section (Sanity), product grid (Shopify), and optimized images (Cloudinary)
- [ ] Implement lazy loading, prefetching, font optimization, and edge caching strategies
- [ ] Deploy to Vercel, configure environment variables, and run Lighthouse audit