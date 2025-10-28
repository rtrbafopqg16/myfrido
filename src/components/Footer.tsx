'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
  alt?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { name: 'Shoe Inserts', href: '/collections/shoe-inserts', alt: 'showInserts' },
      { name: 'Pillows', href: '/collections/pillows', alt: 'pillows' },
      { name: 'Cushions', href: '/collections/cushions', alt: 'cushions' },
      { name: 'Best Sellers', href: '/collections/bestsellers', alt: 'bestSellers' },
      { name: 'Retail shops near you', href: '/pages/store-locator', alt: 'retailShop' },
      { name: 'Compare Insoles', href: '/pages/compare-insoles', alt: 'compareInsoles' },
      { name: 'Take a Quiz', href: '/pages/quiz', alt: 'quiz' },
    ],
  },
  {
    title: 'Partner',
    links: [
      { name: 'Become a Retailer', href: '/pages/become-a-retailer', alt: 'becomeRetailer' },
      { name: 'Corporate Gifting', href: '/pages/corporate-gifting', alt: 'corporateGifting' },
      { name: 'Affiliate Program', href: '/pages/affiliate', alt: 'affiliateProgram' },
      { name: 'Campus Ambassador', href: '/pages/campus', alt: 'campusAmbassador' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Help Centre', href: '/pages/help', alt: 'help center' },
      { name: 'Track your order', href: '/pages/track-my-order', alt: 'trackMyOrder' },
      { name: 'Contact', href: '/pages/contact', alt: 'contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/pages/about', alt: 'aboutUs' },
      { name: 'In the Press', href: '/pages/press-release', alt: 'inThePress' },
      { name: 'Privacy & Cookie policy', href: '/pages/privacy-cookie-policy', alt: 'privacy' },
      { name: 'Terms & Conditions', href: '/pages/terms-and-conditions', alt: 'termsAndConditions' },
    ],
  },
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/myfrido', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Frame_214_5.png?v=1735556882' },
  { name: 'Instagram', href: 'https://www.instagram.com/myfrido/', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Frame_214_6.png?v=1735556882' },
  { name: 'Twitter', href: 'https://x.com/myfrido?mx=2', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Frame_214_8.png?v=1735556882' },
];

const paymentMethods = [
  { name: 'Visa', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/visa.png?v=1735994797' },
  { name: 'RuPay', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/rupay.png?v=1735994797' },
  { name: 'Mastercard', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/mastercard.png?v=1735994796' },
  { name: 'Razorpay', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/razorpay.png?v=1735994796' },
];

const certifications = [
  { name: 'Amazon Sambhav', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Group_1321315019.png?v=1735551993' },
  { name: 'Maharashtra Startup', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Group_1321315020.png?v=1735551993' },
  { name: 'Surge', icon: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Group_1321315022.png?v=1735551992' },
];

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <>
      <style jsx>{`
        body {
          font-family: 'Outfit', sans-serif;
        }
        
        .frido-link {
          color: #fff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 300;
          line-height: 16px;
          cursor: pointer;
        }
        
        .frido-link:hover {
          color: #fff;
          text-decoration: underline;
        }
        
        .frido-shop-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .frido-footer {
          width: 100%;
          height: fit-content;
          background-color: #06080B;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 96px 48px 48px;
          gap: 40px;
        }
        
        .frido-footer-content {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
        
        .frido-footer-container {
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .frido-footer-heading {
          font-size: 20px;
          font-weight: 500;
        }
        
        .frido-footer-links {
          display: flex;
          flex-direction: column;
        }
        
        .frido-footer-divider {
          width: 100%;
          height: 1px;
          background-color: #808080;
        }
        
        .frido-footer-center {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        
        .frido-footer-center-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        
        .frido-footer-center-left img {
          height: 76px;
        }
        
        .frido-footer-center-center {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }
        
        .frido-footer-center-center img {
          height: 36px;
        }
        
        .frido-footer-center-center-text {
          font-size: 12px;
          font-weight: 300;
          line-height: 16px;
          margin: 0;
        }
        
        .frido-footer-center-right {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }
        
        .frido-footer-center-right img {
          height: 40px;
          width: 40px;
          border: 1px solid #808080;
          border-radius: 50%;
        }
        
        .frido-footer-bottom {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        
        .frido-footer-bottom p {
          font-size: 14px;
          font-weight: 300;
          line-height: 18px;
        }
        
        .frido-footer-bottom p a {
          font-size: 14px;
          font-weight: 300;
          line-height: 18px;
        }
        
        .frido-copyright {
          font-size: 14px;
          font-weight: 300;
          line-height: 18px;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }
        
        .frido-payment-methods {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 48px;
          background-color: #fff;
        }
        
        .frido-payment-methods p {
          font-size: 12px;
          font-weight: 300;
          line-height: 16px;
          color: #8a8a8a;
        }
        
        .frido-pay {
        display:flex;
          gap: 32px;
        }
        
        .frido-payment-methods img {
          height: 24px;
        }
        
        .frido-footer-center-center-phone {
          display: none;
          margin: 0px;
        }
        
        .frido-at {
          display: none;
        }
        
        .frido-footer-divider-phone {
          display: none;
        }
        
        .frido-p {
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .frido-link {
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
          }
          
          .frido-footer {
            width: 100%;
            padding: 40px 20px 40px;
          }
          
          .frido-footer-content {
            width: 100%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .frido-footer-center {
            width: 100%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 40px;
          }
          
          .frido-footer-center-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
          }
          
          .frido-footer-center-center div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .frido-footer-center-center p {
            text-align: center;
            font-size: 14px;
            font-weight: 300;
            line-height: 16px;
          }
          
          .frido-footer-container {
            width: 100%;
            position: relative;
            border-bottom: 1px solid #808080;
            padding-top: 20px;
          }
          
          .frido-footer-links {
            clear: both;
            width: 100%;
            height: 0;
            overflow: hidden;
            transition: height 0.3s ease-in-out;
          }
          
          .frido-footer-links.expanded {
            height: auto;
            padding-bottom: 40px;
          }
          
          .frido-footer-heading {
            position: relative;
            width: 100%;
            display: flex;
           
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
          }
          
          .frido-at {
            display: block;
            font-size: 12px;
            transition: transform 0.3s ease;
            transform: rotate(-126deg);
          }
          
          .frido-at.rotated {
            transform: rotate(55deg);
          }
          
          .frido-footer-center-divider {
            display: none;
          }
          
          .frido-payment-methods {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
          }
          
          .frido-pay {
            gap: 5px;
          }
          
          .frido-footer-center-center-text {
            display: none;
          }
          
          .frido-footer-center-center-phone {
            display: inline;
            margin: 0px;
          }
          
          .frido-footer-bottom {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .frido-footer-bottom div {
            display: none;
          }
          
          .frido-footer-divider-phone-line {
            display: none;
          }
          
          .pad {
            margin: 7px;
          }
        }
      `}</style>

      <footer className="o_ft" role="contentinfo">
        <div className="frido-footer">
          <div className="frido-footer-content">
            {footerSections.map((section) => (
              <div key={section.title} className="frido-footer-container">
                <div 
                  className="frido-footer-heading"
                  onClick={() => toggleSection(section.title)}
                >
                  <span>
                    {section.title} 
                  </span>
                  <i className={`at  frido-at ${expandedSections[section.title] ? 'rotated' : ''}`}>▼</i>

                </div>
                <div className={`frido-footer-links ${expandedSections[section.title] ? 'expanded' : ''}`}>
                  <ul className="frido-shop-links">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link className="frido-link" href={link.href}>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="frido-footer-divider frido-footer-center-divider"></div>
          
          <div className="frido-footer-center">
            <div className="frido-footer-center-left">
              {certifications.map((cert) => (
                <img key={cert.name} src={cert.icon} alt={cert.name} />
              ))}
            </div>
            
            <div className="frido-footer-center-center">
              <Link href="/">
                <img src="https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Layer_1.png?v=1735552327" alt="Company Logo" />
              </Link>
            </div>
            
            <div className="frido-footer-center-right">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                  <img src={social.icon} alt={social.name} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="frido-footer-divider frido-footer-divider-phone-line"></div>
          
          <div className="frido-footer-bottom">
            <p className="frido-copyright">© MYFRIDO 2025. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
        
        <div className="frido-payment-methods">
          <p className="frido-p">Guaranteed Safe Checkout</p>
          <div className="frido-pay">
            {paymentMethods.map((method) => (
              <img key={method.name} src={method.icon} alt={method.name} />
            ))}
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["OnlineStore"],
            "name": "MyFrido",
            "description": "Frido is an online store specializing in ergonomic products designed to enhance comfort and well-being. Their product range includes best-selling shoe inserts, insoles for foot pain, arch support insoles for heel pain, orthopedic cushions, ortho pillows, neck pillow, barefoot shoes, socks, baby shoes, and heel pads, all crafted to provide effective pain relief and support.",
            "knowsAbout": ["Shoe Inserts", "Shoe Insoles", "Arch Sports Insole", "Orthopedic Heel Pad", "Lap Desk Pillow", "Travel Neck Pillow", "Car Cushions", "Chair Cushion", "Wedge Cushions", "Pregnancy Pillow", "Cervical Pillow", "Gym Shoes", "Barefoot Shoe", "Office Chair Cushion", "Back Posture Corrector", "Cervical Neck Pillow", "Shoe Insole Inserts", "Shoe Insole Pads", "Mattress Topper", "Ergonomic Chairs", "Face Mask", "Deep Sleep Pillow", "Cushion Cover", "Barefoot Sock Shoes", "Socks for Workout", "Orthotics", "Neck Pain", "Back Pain", "Foot Pain", "Travel Accessories", "Baby Shoes", "Mobility Devices", "Electric Wheelchairs", "Travel Wheelchairs", "Walking Aids", "Commode Wheelchair"],
            "image": "https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Layer_1_1.png?v=1739439173&width=432",
            "@id": "https://myfrido.com/#OnlineStore",
            "url": "https://myfrido.com/",
            "telephone": "+91 74984 76544",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "403/B, Amar Tech Park",
              "addressLocality": "Balewadi",
              "addressRegion": "Pune, Maharashtra",
              "postalCode": "411045",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://www.facebook.com/myfrido",
              "https://www.instagram.com/myfrido/",
              "https://api.whatsapp.com/send/?phone=917498476544&text&type=phone_number&app_absent=0",
              "https://x.com/myfrido"
            ]
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MyFrido",
            "alternateName": "Frido",
            "url": "https://myfrido.com/",
            "logo": "https://myfrido.com/cdn/shop/files/Frido_logo_small_70bf7fbe-ba9d-489b-bc72-7c7ff230d476.png?v=1637684263",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91 74984 76544",
              "contactType": "customer service",
              "contactOption": "TollFree",
              "areaServed": "IN"
            },
            "sameAs": [
              "https://www.facebook.com/myfrido",
              "https://x.com/myfrido?mx=2",
              "https://www.instagram.com/myfrido/"
            ]
          })
        }}
      />
    </>
  );
}


