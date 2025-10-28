'use client';

import React from 'react';
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Free Shipping',
    description: 'Free shipping on all orders over $50. Fast and reliable delivery to your doorstep.',
    icon: TruckIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Secure Payment',
    description: 'Your payment information is encrypted and secure. Shop with confidence.',
    icon: ShieldCheckIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: '24/7 Support',
    description: 'Our customer support team is available around the clock to help you.',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Fast Delivery',
    description: 'Lightning-fast delivery with real-time tracking. Get your orders in record time.',
    icon: ClockIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    name: 'Easy Returns',
    description: 'Hassle-free returns within 30 days. We make it easy to return items you don\'t love.',
    icon: ArrowPathIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    name: 'Multiple Payment',
    description: 'Accept all major credit cards, PayPal, and other secure payment methods.',
    icon: CreditCardIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with modern technology and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Impact</h3>
              <p className="text-gray-600">Numbers that speak for themselves</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">&lt;1s</div>
                <div className="text-sm text-gray-600">Load Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


