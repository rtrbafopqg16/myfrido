'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ProductDescriptionAccordionProps {
  description?: string | any[];
  productDetails?: any;
  returnsAndRefunds?: string;
  careInstructions?: string;
  className?: string;
}

interface AccordionSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  isExpanded?: boolean;
}

// Helper function to render rich text content
const renderRichText = (content: any): React.ReactNode => {
  if (typeof content === 'string') {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block._type === 'block') {
        return (
          <div key={index} className="mb-3">
            {block.children?.map((child: any, childIndex: number) => {
              if (child._type === 'span') {
                let element = child.text;
                
                // Apply marks
                if (child.marks?.includes('strong')) {
                  element = <strong key={childIndex}>{element}</strong>;
                }
                if (child.marks?.includes('em')) {
                  element = <em key={childIndex}>{element}</em>;
                }
                
                return element;
              }
              return null;
            })}
          </div>
        );
      }
      return null;
    });
  }
  
  return 'No content available.';
};

// Helper function to format product details
const formatProductDetails = (details: any): React.ReactNode => {
  if (!details) return 'No product details available.';
  
  const detailLabels: Record<string, string> = {
    mrp: 'MRP(Inclusive of all taxes)',
    manufacturerName: 'Manufacturer\'s Name',
    manufacturerAddress: 'Manufacturer\'s Address',
    countryOfOrigin: 'Country of Origin',
    phone: 'Phone',
    email: 'Email',
    cin: 'CIN',
    weight: 'Weight',
    dimensions: 'Dimensions',
    material: 'Material',
    color: 'Color',
    warranty: 'Warranty'
  };

  return (
    <div className="space-y-3">
      {Object.entries(details).map(([key, value]) => {
        if (!value) return null;
        
        const label = detailLabels[key] || key;
        return (
          <div key={key} className="flex justify-between items-start">
            <span className="text-[#808080] text-[14px] font-normal">{label}:</span>
            <span className="text-[#808080] text-[14px] font-normal text-right max-w-[60%]">
              {typeof value === 'string' ? value : JSON.stringify(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function ProductDescriptionAccordion({
  description,
  productDetails,
  returnsAndRefunds,
  careInstructions,
  className = ''
}: ProductDescriptionAccordionProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true, // Start with description expanded
    productDetails: false,
    careInstructions: false,
    returnsAndRefunds: false
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections: AccordionSection[] = [
    {
      id: 'description',
      title: 'Description',
      content: renderRichText(description) || 'No description available.',
      isExpanded: expandedSections.description
    },
    {
      id: 'productDetails',
      title: 'Product Details',
      content: formatProductDetails(productDetails),
      isExpanded: expandedSections.productDetails
    },
    {
      id: 'careInstructions',
      title: 'Care Instructions',
      content: careInstructions || 'No care instructions available.',
      isExpanded: expandedSections.careInstructions
    },
    {
      id: 'returnsAndRefunds',
      title: 'Return and Refund',
      content: returnsAndRefunds || 'No return and refund policy available.',
      isExpanded: expandedSections.returnsAndRefunds
    }
  ];

  return (
    <div className={`bg-white rounded-[14px] border border-[#f0f0f0] overflow-hidden ${className}`}>
      {sections.map((section, index) => (
        <div key={section.id}>
          {/* Section Header */}
          <div 
            className="flex justify-between items-center p-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection(section.id)}
          >
            <h3 className="text-black text-[16px] font-medium">
              {section.title}
            </h3>
            <div className="flex items-center">
              {expandedSections[section.id] ? (
                <ChevronUpIcon className="w-4 h-4 text-black" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-black" />
              )}
            </div>
          </div>

          {/* Section Content */}
          {expandedSections[section.id] && (
            <div className="px-[20px] pb-[20px]">
              <div className="text-[#808080] text-[14px] leading-[1.1]">
                {section.content}
              </div>
            </div>
          )}

          {/* Divider */}
          {index < sections.length - 1 && (
            <div className="border-t border-gray-200"></div>
          )}
        </div>
      ))}
    </div>
  );
}
