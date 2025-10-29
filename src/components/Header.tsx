'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CartDrawer from './CartDrawer';
import OptimizedImage from './OptimizedImage';
import SearchModal from './SearchModal';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemCount } = useCart();

  const cartItemCount = getCartItemCount();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="mx-auto max-w-7xl px-[20px] sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between py-[20px]">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center h-[24px]">
                <img src="/logo.png" alt="Logo" className='h-full'/>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className=" text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clip-path="url(#clip0_2_1392)">
                    <path d="M3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C8.1705 16.8189 9.08075 17 10 17C10.9193 17 11.8295 16.8189 12.6788 16.4672C13.5281 16.1154 14.2997 15.5998 14.9497 14.9497C15.5998 14.2997 16.1154 13.5281 16.4672 12.6788C16.8189 11.8295 17 10.9193 17 10C17 9.08075 16.8189 8.1705 16.4672 7.32122C16.1154 6.47194 15.5998 5.70026 14.9497 5.05025C14.2997 4.40024 13.5281 3.88463 12.6788 3.53284C11.8295 3.18106 10.9193 3 10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 21L15 15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2_1392">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative  text-gray-700 hover:text-gray-900 transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clip-path="url(#clip0_2_1397)">
                    <path d="M6.32836 8H17.6674C17.9557 7.99997 18.2407 8.06229 18.5027 8.1827C18.7647 8.30311 18.9976 8.47876 19.1854 8.6976C19.3732 8.91645 19.5114 9.17331 19.5907 9.45059C19.6699 9.72786 19.6882 10.019 19.6444 10.304L18.3894 18.456C18.2804 19.1644 17.9214 19.8105 17.3774 20.2771C16.8333 20.7438 16.1401 21.0002 15.4234 21H8.57136C7.85476 21 7.16184 20.7434 6.61799 20.2768C6.07414 19.8102 5.71529 19.1643 5.60636 18.456L4.35136 10.304C4.30753 10.019 4.32585 9.72786 4.40507 9.45059C4.48429 9.17331 4.62253 8.91645 4.81031 8.6976C4.99809 8.47876 5.23098 8.30311 5.49301 8.1827C5.75503 8.06229 6.04 7.99997 6.32836 8Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11V6C9 5.20435 9.31607 4.44129 9.87868 3.87868C10.4413 3.31607 11.2044 3 12 3C12.7956 3 13.5587 3.31607 14.1213 3.87868C14.6839 4.44129 15 5.20435 15 6V11" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2_1397">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-[6px] bg-black text-white text-[10px] font-medium rounded-full h-[18px] w-[18px] flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              
            </div>
          </div>

        </nav>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

