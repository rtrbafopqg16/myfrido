'use client';

import React, { useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQ {
  _key: string;
  question: string;
  answer: string;
}

interface ProductFAQsProps {
  title?: string;
  faqs: FAQ[];
  className?: string;
}

export default function ProductFAQs({
  title = 'FAQs',
  faqs,
  className = ''
}: ProductFAQsProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Section Title */}
      <h2 className="text-black text-[24px] font-medium my-[20px]">
        {title}
      </h2>
      
      {/* FAQs List */}
      <div className="space-y-0">
        {faqs.map((faq, index) => {
          const isExpanded = expandedItems[faq._key];
          
          return (
            <div key={faq._key}>
              {/* FAQ Item */}
              <div className="py-[20px]">
                {/* Question */}
                <button
                  onClick={() => toggleItem(faq._key)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <h3 className="text-black text-[16px] leading-[1.3] font-medium pr-[12px] flex-1">
                    {faq.question}
                  </h3>
                  <ChevronUpIcon 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-0' : 'rotate-180'
                    }`}
                  />
                </button>
                
                {/* Answer */}
                {isExpanded && (
                  <div className="mt-[12px]">
                    <p className="text-[#7e7e7e] text-[14px] font-normal leading-[1.2]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Separator Line */}
              {index < faqs.length - 1 && (
                <div className="border-t border-[#f0f0f0]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
