'use client';

import React from 'react';
import OptimizedImage from './OptimizedImage';

interface ProductHighlight {
  _key: string;
  image: string | {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  title: string;
  description: string;
}

interface ProductHighlightsProps {
  title?: string;
  highlights: ProductHighlight[];
  className?: string;
}

export default function ProductHighlights({
  title = 'Product Highlights',
  highlights,
  className = ''
}: ProductHighlightsProps) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Section Title */}
      <h2 className="text-black hidden md:block text-[24px] font-medium mb-[40px]">
        {title}
      </h2>
      
      {/* Highlights Grid */}
      <div className="space-y-[32px]">
        {highlights.map((highlight) => (
          <div 
            key={highlight._key}
            className="flex flex-col"
          >
            {/* Image */}
            <div className="w-full mb-[20px]">
              <OptimizedImage
                src={typeof highlight.image === 'string' ? highlight.image : highlight.image.asset._ref}
                alt={typeof highlight.image === 'string' ? highlight.title : (highlight.image.alt || highlight.title)}
                width={400}
                height={200}
                className="w-full h-auto rounded-[8px] object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex flex-col">
              {/* Title */}
              <h3 className="text-black text-[20px] font-medium mb-[12px] leading-tight">
                {highlight.title}
              </h3>
              
              {/* Description */}
              <p className="text-[#7e7e7e] text-[16px] font-normal leading-[1]">
                {highlight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
