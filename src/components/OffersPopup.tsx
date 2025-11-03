'use client';

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import OptimizedImage from './OptimizedImage';

interface OffersPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OffersPopup({ isOpen, onClose }: OffersPopupProps) {
  const offers = [
    {
      id: 1,
      url: "https://cdn.shopify.com/s/files/1/0553/0419/2034/files/offer2.png",
    },
    {
      id: 2,
      url: "https://cdn.shopify.com/s/files/1/0553/0419/2034/files/offer3.png",
    }
  ];

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center  text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden bg-white p-[20px] text-left transition-all sm:my-8 sm:w-full sm:max-w-md">
                {/* Header */}
                <div className="flex items-center gap-[8px] mb-[24px]">
                  <button
                    type="button"
                    onClick={onClose}
                    className=" text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_3586_104562)">
                          <path d="M5 12H19" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5 12L11 18" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5 12L11 6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_3586_104562">
                            <rect width="24" height="24" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                  </button>
                  <Dialog.Title className="text-[20px] leading-none font-semibold text-black">
                    All Offers
                  </Dialog.Title>
                  
                </div>

                {/* Subtitle */}
                <p className="text-[14px] font-medium text-black text-left mb-[14px]">(Apply on Payments Page)</p>

                {/* Offers List */}
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white w-full h-full flex justify-between items-center relative cursor-pointer hover:bg-gray-200 transition-colors"
                      style={{
                        background: '#ffffff',
                        position: 'relative'
                      }}
                    >
                       <OptimizedImage
                         src={offer.url}
                         alt="Offer"
                         width={600}
                         height={300}
                         quality={85}
                         optimization="gallery"
                         loading="lazy"
                         priority={false}
                         className="w-full h-auto object-contain"
                         sizes="(max-width: 768px) 100vw, 600px"
                       />
                    </div>
                    
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
