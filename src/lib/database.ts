import { createClient } from '@sanity/client';
import { groq } from 'next-sanity';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

// Database schemas and interfaces
export interface DatabaseProduct {
  _id: string;
  _type: 'product';
  title: string;
  slug: { current: string };
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
    caption?: string;
  }[];
  variants: {
    _id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    available: boolean;
    options: {
      name: string;
      value: string;
    }[];
  }[];
  categories: {
    _id: string;
    title: string;
    slug: { current: string };
  }[];
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt: string;
  updatedAt: string;
}

export interface DatabaseCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug: { current: string };
  description?: string;
  image?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  parent?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  seo: {
    title?: string;
    description?: string;
  };
}

export interface DatabaseContent {
  _id: string;
  _type: 'content';
  title: string;
  slug: { current: string };
  content: any[]; // Portable Text
  featuredImage?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  publishedAt: string;
  updatedAt: string;
}

// Database queries
export const databaseQueries = {
  // Get all products with pagination
  getProducts: (limit: number = 20, offset: number = 0) => groq`
    *[_type == "product"] | order(publishedAt desc) [${offset}...${offset + limit}] {
      _id,
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      images[0...5] {
        _type,
        asset,
        alt,
        caption
      },
      variants[0...10] {
        _id,
        title,
        price,
        compareAtPrice,
        available,
        options
      },
      categories[] {
        _id,
        title,
        slug
      },
      tags,
      seo,
      publishedAt,
      updatedAt
    }
  `,

  // Get single product by slug
  getProductBySlug: (slug: string) => groq`
    *[_type == "product" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      images[] {
        _type,
        asset,
        alt,
        caption
      },
      variants[] {
        _id,
        title,
        price,
        compareAtPrice,
        available,
        options
      },
      categories[] {
        _id,
        title,
        slug
      },
      tags,
      seo,
      publishedAt,
      updatedAt
    }
  `,

  // Get products by category
  getProductsByCategory: (categorySlug: string, limit: number = 20) => groq`
    *[_type == "product" && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      images[0...3] {
        _type,
        asset,
        alt,
        caption
      },
      categories[] {
        _id,
        title,
        slug
      },
      tags,
      publishedAt
    }
  `,

  // Get all categories
  getCategories: () => groq`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      image {
        _type,
        asset,
        alt
      },
      parent {
        _id,
        title,
        slug
      }
    }
  `,

  // Search products
  searchProducts: (query: string, limit: number = 20) => groq`
    *[_type == "product" && (title match "*${query}*" || description match "*${query}*" || tags[] match "*${query}*")] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      images[0...3] {
        _type,
        asset,
        alt,
        caption
      },
      categories[] {
        _id,
        title,
        slug
      },
      tags,
      publishedAt
    }
  `,

  // Get content by slug
  getContentBySlug: (slug: string) => groq`
    *[_type == "content" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      content,
      featuredImage {
        _type,
        asset,
        alt
      },
      publishedAt,
      updatedAt
    }
  `
};

// Database functions
export class DatabaseService {
  // Get products with caching
  static async getProducts(limit: number = 20, offset: number = 0): Promise<DatabaseProduct[]> {
    try {
      const query = databaseQueries.getProducts(limit, offset);
      const products = await client.fetch(query);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get single product
  static async getProduct(slug: string): Promise<DatabaseProduct | null> {
    try {
      const query = databaseQueries.getProductBySlug(slug);
      const product = await client.fetch(query);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Get products by category
  static async getProductsByCategory(categorySlug: string, limit: number = 20): Promise<DatabaseProduct[]> {
    try {
      const query = databaseQueries.getProductsByCategory(categorySlug, limit);
      const products = await client.fetch(query);
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Get categories
  static async getCategories(): Promise<DatabaseCategory[]> {
    try {
      const query = databaseQueries.getCategories();
      const categories = await client.fetch(query);
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Search products
  static async searchProducts(query: string, limit: number = 20): Promise<DatabaseProduct[]> {
    try {
      const searchQuery = databaseQueries.searchProducts(query, limit);
      const products = await client.fetch(searchQuery);
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get content
  static async getContent(slug: string): Promise<DatabaseContent | null> {
    try {
      const query = databaseQueries.getContentBySlug(slug);
      const content = await client.fetch(query);
      return content;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  }

  // Create product (admin function)
  static async createProduct(productData: Partial<DatabaseProduct>): Promise<DatabaseProduct | null> {
    try {
      const product = await client.create({
        _type: 'product',
        ...productData,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return product as unknown as DatabaseProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  // Update product (admin function)
  static async updateProduct(id: string, updates: Partial<DatabaseProduct>): Promise<DatabaseProduct | null> {
    try {
      const product = await client
        .patch(id)
        .set({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
         .commit();
       return product as unknown as DatabaseProduct;
     } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  // Delete product (admin function)
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      await client.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
}

// Cache configuration
export const CACHE_CONFIG = {
  // ISR (Incremental Static Regeneration) settings
  ISR: {
    products: 3600, // 1 hour
    categories: 7200, // 2 hours
    content: 1800, // 30 minutes
  },
  
  // CDN cache settings
  CDN: {
    images: 31536000, // 1 year
    api: 3600, // 1 hour
    static: 31536000, // 1 year
  }
};

// Performance monitoring
export class PerformanceMonitor {
  static async measureQueryTime<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<{ result: T; time: number }> {
    const start = performance.now();
    const result = await queryFn();
    const time = performance.now() - start;
    
    console.log(`Query ${queryName} took ${time.toFixed(2)}ms`);
    
    return { result, time };
  }
}

