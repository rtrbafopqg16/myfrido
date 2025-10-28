'use client';

import { useEffect, useState } from 'react';

interface PerformanceMonitorProps {
  onPerformanceData?: (data: {
    connectionType: string;
    preloadStrategy: string;
    estimatedDataUsage: number;
    performanceImpact: 'low' | 'medium' | 'high';
  }) => void;
}

export function PerformanceMonitor({ onPerformanceData }: PerformanceMonitorProps) {
  const [performanceData, setPerformanceData] = useState<{
    connectionType: string;
    preloadStrategy: string;
    estimatedDataUsage: number;
    performanceImpact: 'low' | 'medium' | 'high';
  } | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const userAgent = navigator.userAgent;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const effectiveType = connection?.effectiveType || '4g';
    const saveData = connection?.saveData || false;
    
    let preloadStrategy: string;
    let estimatedDataUsage: number;
    let performanceImpact: 'low' | 'medium' | 'high';

    if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
      preloadStrategy = 'Minimal (current + next only)';
      estimatedDataUsage = 200; // KB
      performanceImpact = 'low';
    } else if (isMobile) {
      preloadStrategy = 'Mobile Optimized (3 images)';
      estimatedDataUsage = 600; // KB
      performanceImpact = 'low';
    } else {
      preloadStrategy = 'Full Preload (all images)';
      estimatedDataUsage = 2000; // KB
      performanceImpact = 'medium';
    }

    const data = {
      connectionType: effectiveType,
      preloadStrategy,
      estimatedDataUsage,
      performanceImpact
    };

    setPerformanceData(data);
    onPerformanceData?.(data);

    // Log performance info
    console.log('🚀 Performance Strategy:', {
      connection: effectiveType,
      mobile: isMobile,
      saveData: saveData,
      strategy: preloadStrategy,
      estimatedDataUsage: `${estimatedDataUsage}KB`,
      impact: performanceImpact
    });

  }, [onPerformanceData]);

  if (!performanceData) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-semibold mb-2">📊 Performance Monitor</div>
      <div className="space-y-1">
        <div><span className="text-gray-300">Connection:</span> {performanceData.connectionType}</div>
        <div><span className="text-gray-300">Strategy:</span> {performanceData.preloadStrategy}</div>
        <div><span className="text-gray-300">Data Usage:</span> ~{performanceData.estimatedDataUsage}KB</div>
        <div><span className="text-gray-300">Impact:</span> 
          <span className={`ml-1 px-1 rounded text-xs ${
            performanceData.performanceImpact === 'low' ? 'bg-green-600' :
            performanceData.performanceImpact === 'medium' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {performanceData.performanceImpact}
          </span>
        </div>
      </div>
    </div>
  );
}

// Hook to get performance recommendations
export function usePerformanceRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const userAgent = navigator.userAgent;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const effectiveType = connection?.effectiveType || '4g';
    const saveData = connection?.saveData || false;

    const recs: string[] = [];

    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      recs.push('🚀 Using minimal preloading for 2G connection');
      recs.push('💡 Consider enabling data saver mode');
    } else if (saveData) {
      recs.push('💾 Data saver mode detected - minimal preloading');
    } else if (isMobile) {
      recs.push('📱 Mobile optimized preloading (3 images)');
      recs.push('⚡ Fast gallery navigation with minimal data usage');
    } else {
      recs.push('🚀 Full preloading enabled for fast connection');
      recs.push('⚡ Instant gallery navigation');
    }

    setRecommendations(recs);
  }, []);

  return recommendations;
}
