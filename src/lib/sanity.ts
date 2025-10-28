import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create Sanity client with proper configuration for both client and server
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  // Only include token on server-side
  ...(typeof window === 'undefined' && process.env.SANITY_API_TOKEN && {
    token: process.env.SANITY_API_TOKEN,
  }),
});

const builder = imageUrlBuilder(client);

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface HeroSection {
  _id: string;
  _type: 'hero';
  title: string;
  subtitle?: string;
  backgroundImage: SanityImage;
  ctaText?: string;
  ctaLink?: string;
}

export interface FeatureSection {
  _id: string;
  _type: 'features';
  title: string;
  features: Array<{
    _key: string;
    title: string;
    description: string;
    icon?: SanityImage;
  }>;
}

export interface TestimonialSection {
  _id: string;
  _type: 'testimonials';
  title: string;
  testimonials: Array<{
    _key: string;
    name: string;
    role: string;
    content: string;
    avatar?: SanityImage;
    rating: number;
  }>;
}

export interface BlogPost {
  _id: string;
  _type: 'post';
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  content: any[];
  featuredImage: SanityImage;
  author: {
    name: string;
    avatar?: SanityImage;
  };
  publishedAt: string;
  categories: Array<{
    _id: string;
    title: string;
  }>;
  tags: string[];
}

export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  slug: {
    current: string;
  };
  content: any[];
  seo: {
    title?: string;
    description?: string;
    image?: SanityImage;
  };
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  title: string;
  description: string;
  logo: SanityImage;
  favicon: SanityImage;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  footerText: string;
}

export interface ProductFeatures {
  _id: string;
  _type: 'productFeatures';
  productHandle: string;
  features: Array<{
    _key: string;
    title: string;
    description: string;
    icon?: SanityImage;
  }>;
}

export interface BankOfferDetails {
  _id: string;
  _type: 'bankOfferDetails';
  bankId: string;
  bankName: string;
  logo: string;
  offerTitle: string;
  cashbackAmount: string;
  offerDescription: string;
  keyFeatures: string[];
  paymentSchedule: Array<{
    installment: string;
    label: string;
    description: string;
  }>;
  termsAndConditions: string[];
  validFrom: string;
  validTo: string;
  maxCashback: string;
}

export interface ProductDescription {
  _id: string;
  _type: 'productDescription';
  productHandle: string;
  description?: string;
  productDetails?: any;
  returnsAndRefunds?: string;
  careInstructions?: string;
}

export interface ProductHighlights {
  _id: string;
  _type: 'productHighlights';
  productHandle: string;
  title?: string;
  highlights: Array<{
    _key: string;
    image: SanityImage;
    title: string;
    description: string;
  }>;
}

export interface ProductFAQs {
  _id: string;
  _type: 'productFAQs';
  productHandle: string;
  title?: string;
  faqs: Array<{
    _key: string;
    question: string;
    answer: string;
  }>;
}

// Helper function to get image URL
export function urlFor(source: SanityImage) {
  return builder.image(source);
}

// Queries
const HERO_SECTIONS_QUERY = `
  *[_type == "hero"] {
    _id,
    _type,
    title,
    subtitle,
    backgroundImage,
    ctaText,
    ctaLink
  }
`;

const FEATURE_SECTIONS_QUERY = `
  *[_type == "features"] {
    _id,
    _type,
    title,
    features[] {
      _key,
      title,
      description,
      icon
    }
  }
`;

const TESTIMONIAL_SECTIONS_QUERY = `
  *[_type == "testimonials"] {
    _id,
    _type,
    title,
    testimonials[] {
      _key,
      name,
      role,
      content,
      avatar,
      rating
    }
  }
`;

const BLOG_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author {
      name,
      avatar
    },
    publishedAt,
    categories[]-> {
      _id,
      title
    },
    tags
  }
`;

const BLOG_POST_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author {
      name,
      avatar
    },
    publishedAt,
    categories[]-> {
      _id,
      title
    },
    tags
  }
`;

const PAGE_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    content,
    seo {
      title,
      description,
      image
    }
  }
`;

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    _id,
    _type,
    title,
    description,
    logo,
    favicon,
    socialLinks {
      facebook,
      twitter,
      instagram,
      linkedin
    },
    contactInfo {
      email,
      phone,
      address
    },
    footerText
  }
`;

const PRODUCT_FEATURES_QUERY = `
  *[_type == "productFeatures" && productHandle == $productHandle][0] {
    _id,
    _type,
    productHandle,
    features[] {
      _key,
      title,
      description,
      icon
    }
  }
`;

const PRODUCT_DESCRIPTION_QUERY = `
  *[_type == "productDescription" && productHandle == $productHandle][0] {
    _id,
    _type,
    productHandle,
    description,
    productDetails,
    returnsAndRefunds,
    careInstructions
  }
`;

const PRODUCT_HIGHLIGHTS_QUERY = `
  *[_type == "productHighlights" && productHandle == $productHandle][0] {
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
  }
`;

const PRODUCT_FAQS_QUERY = `
  *[_type == "productFAQs" && productHandle == $productHandle][0] {
    _id,
    _type,
    productHandle,
    title,
    faqs[] {
      _key,
      question,
      answer
    }
  }
`;

const BANK_OFFER_DETAILS_QUERY = `
  *[_type == "bankOfferDetails" && bankId == $bankId][0] {
    _id,
    _type,
    bankId,
    bankName,
    logo,
    offerTitle,
    cashbackAmount,
    offerDescription,
    keyFeatures,
    paymentSchedule[] {
      installment,
      label,
      description
    },
    termsAndConditions,
    validFrom,
    validTo,
    maxCashback
  }
`;

// API functions
export async function getHeroSections(): Promise<HeroSection[]> {
  return await client.fetch(HERO_SECTIONS_QUERY);
}

export async function getFeatureSections(): Promise<FeatureSection[]> {
  return await client.fetch(FEATURE_SECTIONS_QUERY);
}

export async function getTestimonialSections(): Promise<TestimonialSection[]> {
  return await client.fetch(TESTIMONIAL_SECTIONS_QUERY);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(BLOG_POSTS_QUERY);
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  return await client.fetch(BLOG_POST_QUERY, { slug });
}

export async function getPage(slug: string): Promise<Page> {
  return await client.fetch(PAGE_QUERY, { slug });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return await client.fetch(SITE_SETTINGS_QUERY);
}

export async function getProductFeatures(productHandle: string): Promise<ProductFeatures | null> {
  return await client.fetch(PRODUCT_FEATURES_QUERY, { productHandle });
}

export async function getBankOfferDetails(bankId: string): Promise<BankOfferDetails | null> {
  return await client.fetch(BANK_OFFER_DETAILS_QUERY, { bankId });
}

export async function getProductDescription(productHandle: string): Promise<ProductDescription | null> {
  return await client.fetch(PRODUCT_DESCRIPTION_QUERY, { productHandle });
}

export async function getProductHighlights(productHandle: string): Promise<ProductHighlights | null> {
  return await client.fetch(PRODUCT_HIGHLIGHTS_QUERY, { productHandle });
}

export async function getProductFAQs(productHandle: string): Promise<ProductFAQs | null> {
  return await client.fetch(PRODUCT_FAQS_QUERY, { productHandle });
}

export { client };


