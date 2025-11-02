import React, { useState } from 'react';
import OptimizedImage from './OptimizedImage';
import BankOfferPopup from './BankOfferPopup';
import { getBankOfferDetails, BankOfferDetails } from '@/lib/sanity';

interface BankOffer {
  id: string;
  logo: string;
  alt: string;
  offer: string;
  cashback: string;
  bankName: string;
}

interface BankOffersProps {
  title?: string;
  showViewAll?: boolean;
  offers?: BankOffer[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  maxHeight?: string;
  maxWidth?: string;
}

const defaultOffers: BankOffer[] = [
  {
    id: 'snapmint',
    logo: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Snapmint10cahsback.png',
    alt: 'Snapmint',
    offer: 'Get 10% Cashback up to',
    cashback: '₹1500',
    bankName: 'Snapmint'
  },
  {
    id: 'upi-discount',
    logo: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/UPI_discount_primary.png',
    alt: 'UPI Discount',
    offer: 'UPI Payment Discount',
    cashback: 'Up to ₹500',
    bankName: 'UPI'
  },
  {
    id: 'no-cost-emi',
    logo: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/NoCostEMI_bankoffers_07673a05-6716-4277-9df4-c219b2ba479f.png',
    alt: 'No Cost EMI',
    offer: 'No Cost EMI Available',
    cashback: '0% Interest',
    bankName: 'No Cost EMI'
  }
];

export default function BankOffers({
  title = 'Bank Offers',
  showViewAll = true,
  offers = defaultOffers,
  className = '',
  orientation = 'horizontal',
  maxHeight = '200px',
  maxWidth = 'full'
}: BankOffersProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOfferDetails, setSelectedOfferDetails] = useState<BankOfferDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOfferClick = async (offerId: string) => {
    setIsLoading(true);
    try {
      const details = await getBankOfferDetails(offerId);
      if (details) {
        setSelectedOfferDetails(details);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error('Error fetching bank offer details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = orientation === 'horizontal' 
    ? `flex flex-row gap-[8px] max-w-${maxWidth} overflow-x-auto scrollbar-hide`
    : `flex flex-col gap-[8px] max-h-[${maxHeight}] overflow-y-auto scrollbar-hide`;

  const offerCardClasses = orientation === 'horizontal'
    ? 'min-w-[85vw] md:min-w-[380px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity'
    : 'bg-[#f5f5f5] rounded-[12px] p-[12px] flex items-center gap-[12px] cursor-pointer hover:bg-[#eeeeee] transition-colors';

  return (
    <>
      <div className={`flex flex-col gap-[12px] bg-white rounded-[14px] ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-black text-[16px]">{title}</h3>
          {showViewAll && (
            <span className="text-[#307FE2] text-[14px] font-medium">View All</span>
          )}
        </div>
        
        {/* Offers Container */}
        <div className={containerClasses}>
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className={offerCardClasses}
              onClick={() => handleOfferClick(offer.id)}
            >
              
                <div className="w-full  flex items-center">
                  <img src={offer.logo} alt="Bank Offer" className="w-[85vw] md:w-[380px] " />
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      <BankOfferPopup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedOfferDetails(null);
        }}
        offerDetails={selectedOfferDetails}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Loading offer details...</span>
          </div>
        </div>
      )}
    </>
  );
}