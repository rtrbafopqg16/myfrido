import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import OptimizedImage from './OptimizedImage';

interface BankOfferDetails {
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

interface BankOfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offerDetails: BankOfferDetails | null;
}

export default function BankOfferPopup({ isOpen, onClose, offerDetails }: BankOfferPopupProps) {
  if (!isOpen || !offerDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-t-[20px] w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Main Offer Card */}
          <div className="bg-white border border-gray-200 rounded-[12px] p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <OptimizedImage
                  src={offerDetails.logo}
                  alt={offerDetails.bankName}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-black text-base font-medium">
                  {offerDetails.offerTitle} <span className="text-[#4CAF50] font-semibold">{offerDetails.cashbackAmount}</span>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {offerDetails.offerDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {offerDetails.keyFeatures.map((feature, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-600 text-sm font-medium">{feature}</span>
                {index < offerDetails.keyFeatures.length - 1 && (
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Payment Schedule */}
          <div className="flex justify-center gap-6 mb-6">
            {offerDetails.paymentSchedule.map((schedule, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray={`${(index + 1) * 33.33} 100`}
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-black font-bold text-sm">{schedule.installment}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-black font-bold text-sm">{schedule.label}</p>
                  <p className="text-gray-500 text-xs">{schedule.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-black mb-4">Terms & Conditions</h3>
            {offerDetails.termsAndConditions.map((term, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-gray-600 mt-1">•</span>
                <p className="text-gray-700 text-sm leading-relaxed">{term}</p>
              </div>
            ))}
            
            {/* Additional Terms */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Valid Period:</strong> {offerDetails.validFrom} to {offerDetails.validTo}</p>
                <p><strong>Maximum Cashback:</strong> {offerDetails.maxCashback}</p>
                <p><strong>Payment Method:</strong> {offerDetails.bankName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
