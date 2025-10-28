// Performance monitoring and optimization utilities
import React from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  imageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export class PerformanceTracker {
  private static metrics: PerformanceMetrics = {
    loadTime: 0,
    imageLoadTime: 0,
    apiResponseTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
  };

  // Track page load time
  static trackPageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.metrics.loadTime = loadTime;
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
      });
    }
  }

  // Track image load time
  static trackImageLoad(src: string): Promise<number> {
    return new Promise((resolve) => {
      const start = performance.now();
      const img = new Image();
      
      img.onload = () => {
        const loadTime = performance.now() - start;
        this.metrics.imageLoadTime = loadTime;
        resolve(loadTime);
      };
      
      img.onerror = () => {
        const loadTime = performance.now() - start;
        console.warn(`Image failed to load: ${src} (${loadTime.toFixed(2)}ms)`);
        resolve(loadTime);
      };
      
      img.src = src;
    });
  }

  // Track API response time
  static async trackApiCall<T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<{ result: T; time: number }> {
    const start = performance.now();
    try {
      const result = await apiCall();
      const time = performance.now() - start;
      this.metrics.apiResponseTime = time;
      console.log(`API call to ${endpoint} took ${time.toFixed(2)}ms`);
      return { result, time };
    } catch (error) {
      const time = performance.now() - start;
      console.error(`API call to ${endpoint} failed after ${time.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  // Get current metrics
  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Reset metrics
  static resetMetrics() {
    this.metrics = {
      loadTime: 0,
      imageLoadTime: 0,
      apiResponseTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
    };
  }
}

// Cache management
export class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  // Set cache with TTL
  static set(key: string, data: any, ttl: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Get from cache
  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Clear cache
  static clear(): void {
    this.cache.clear();
  }

  // Clear expired items
  static clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  static getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Image preloading
export class ImagePreloader {
  private static preloadedImages = new Set<string>();

  // Preload critical images
  static async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadImage(url));
    await Promise.all(promises);
  }

  // Preload single image
  static async preloadImage(url: string): Promise<void> {
    if (this.preloadedImages.has(url)) return;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedImages.add(url);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // Check if image is preloaded
  static isPreloaded(url: string): boolean {
    return this.preloadedImages.has(url);
  }
}

// Resource hints
export class ResourceHints {
  // Add DNS prefetch
  static addDnsPrefetch(domain: string): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  }

  // Add preconnect
  static addPreconnect(url: string): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  }

  // Add preload
  static addPreload(url: string, as: string = 'image'): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  }
}

// Bundle analyzer
export class BundleAnalyzer {
  // Analyze bundle size
  static analyzeBundle(): void {
    if (typeof window === 'undefined') return;

    const scripts = Array.from(document.scripts);
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.log('Bundle Analysis:');
    console.log(`Scripts: ${scripts.length}`);
    console.log(`Stylesheets: ${stylesheets.length}`);
    
    // Log large resources
    scripts.forEach(script => {
      if (script.src) {
        console.log(`Script: ${script.src}`);
      }
    });
  }
}

// Performance budget
export const PERFORMANCE_BUDGET = {
  // Core Web Vitals targets
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  
  // Image optimization targets
  IMAGE_MAX_SIZE: 500000, // 500KB
  IMAGE_MAX_DIMENSIONS: 2000, // 2000px
  
  // API response targets
  API_MAX_RESPONSE_TIME: 1000, // 1 second
  
  // Cache targets
  CACHE_HIT_RATE: 0.8, // 80%
};

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(PerformanceTracker.getMetrics());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    
    // Initial update
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// Performance optimization recommendations
export function getOptimizationRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.loadTime > PERFORMANCE_BUDGET.LCP) {
    recommendations.push('Consider optimizing images and reducing bundle size');
  }

  if (metrics.imageLoadTime > 1000) {
    recommendations.push('Implement image lazy loading and optimization');
  }

  if (metrics.apiResponseTime > PERFORMANCE_BUDGET.API_MAX_RESPONSE_TIME) {
    recommendations.push('Add API caching and optimize database queries');
  }

  if (metrics.cacheHitRate < PERFORMANCE_BUDGET.CACHE_HIT_RATE) {
    recommendations.push('Improve caching strategy and increase cache TTL');
  }

  return recommendations;
}

