# D2C E-commerce Website

A lightning-fast, modern D2C e-commerce website built with Next.js 14, Shopify Storefront API, Sanity CMS, and Cloudinary for optimal performance and user experience.

## 🚀 Features

- **Lightning Fast**: Built with Next.js 14 and optimized for performance
- **Shopify Integration**: Seamless product management and checkout
- **Sanity CMS**: Content management for pages, blogs, and marketing content
- **Cloudinary**: Optimized image and video delivery
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Shopping Cart**: Full cart functionality with local storage
- **Search**: Real-time product search
- **SEO Optimized**: Built-in SEO features and meta tags

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **E-commerce**: Shopify Storefront API
- **CMS**: Sanity
- **Media**: Cloudinary
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Context

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- A Shopify store with Storefront API access
- A Sanity project set up
- A Cloudinary account
- Git installed

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd d2c-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION=2024-01

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Shopify Setup

1. Go to your Shopify admin panel
2. Navigate to Apps > App and sales channel settings
3. Create a private app or use Shopify CLI
4. Enable Storefront API access
5. Copy the Storefront access token

### 5. Sanity Setup

1. Create a new project at [sanity.io](https://sanity.io)
2. Install Sanity CLI: `npm install -g @sanity/cli`
3. Initialize your project: `sanity init`
4. Create schemas for your content types
5. Get your project ID and dataset name

### 6. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Configure upload presets for optimal image delivery

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   └── checkout/          # Checkout page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── ProductCard.tsx    # Product display component
│   └── CartDrawer.tsx     # Shopping cart
├── contexts/              # React contexts
│   └── CartContext.tsx    # Cart state management
├── lib/                   # Utility libraries
│   ├── shopify.ts         # Shopify API client
│   ├── sanity.ts          # Sanity CMS client
│   └── cloudinary.ts      # Cloudinary utilities
└── styles/                # Global styles
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize component styles in individual component files

### Content Management
- Set up Sanity schemas for your content types
- Configure Sanity Studio for content editing
- Use Sanity's image optimization features

### E-commerce
- Configure Shopify product collections
- Set up shipping and tax settings
- Customize checkout flow

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📈 Performance Optimization

- **Image Optimization**: Cloudinary integration for automatic image optimization
- **Static Generation**: Pre-rendered pages for better performance
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Optimized caching strategies
- **CDN**: Global content delivery with Cloudinary

## 🔧 Configuration

### Shopify Configuration
- Update store domain and access token
- Configure product collections
- Set up webhooks for real-time updates

### Sanity Configuration
- Create content schemas
- Set up preview modes
- Configure image transformations

### Cloudinary Configuration
- Set up upload presets
- Configure image transformations
- Set up video optimization

## 🧪 Testing

```bash
# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔄 Updates

This project is actively maintained. Check the releases page for the latest updates and features.

---

Built with ❤️ using Next.js, Shopify, Sanity, and Cloudinary.