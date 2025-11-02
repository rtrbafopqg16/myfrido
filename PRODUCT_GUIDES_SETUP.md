# Product Guides Setup (How to Use & Size Chart Popups)

## ✅ Implementation Complete!

I've successfully implemented two popup modals for your product pages:

1. **How to Use Popup** - Shows a video tutorial
2. **Size Chart Popup** - Shows product dimensions and measurement guide with tabs

## 📁 Files Created/Modified

### New Files:
- `src/schemas/productGuides.js` - Sanity schema for product guides
- `src/components/HowToUsePopup.tsx` - Video popup component
- `src/components/SizeChartPopup.tsx` - Size chart popup component
- `PRODUCT_GUIDES_SETUP.md` - This documentation file

### Modified Files:
- `src/schemas/index.js` - Added productGuides schema
- `src/lib/sanity.ts` - Added ProductGuides interface and query
- `src/app/api/sanity/[handle]/route.ts` - Added guides data to API response
- `src/app/products/[handle]/page.tsx` - Added popup components and handlers
- `src/app/globals.css` - Added slide-up animation

## 🎯 Features

### How to Use Popup:
- ✅ Full-screen video player
- ✅ Mute/unmute button
- ✅ Share button (native sharing on mobile)
- ✅ Product thumbnail and title
- ✅ Smooth slide-up animation on mobile
- ✅ Overlay with backdrop
- ✅ Close button

### Size Chart Popup:
- ✅ Tabbed interface (Product Dimensions / How to Measure)
- ✅ High-quality images
- ✅ Description text support
- ✅ "Back to shopping" button
- ✅ Smooth slide-up animation on mobile
- ✅ Overlay with backdrop
- ✅ Close button

## 🗄️ How to Add Data in Sanity CMS

### Step 1: Deploy Sanity Schema

1. Navigate to your Sanity project directory
2. The new schema is already added to `src/schemas/index.js`
3. Deploy the schema to Sanity Studio

### Step 2: Create Product Guides Document

1. Go to your Sanity Studio
2. Create a new **Product Guides** document
3. Fill in the following fields:

#### Product Handle
- Enter: `frido-orthotics-posture-corrector` (or your product handle)

#### How to Use Section:
- **Title**: "How to Use"
- **Video URL**: `https://cdn.shopify.com/videos/c/o/v/77427aa5e95b487c85a330da1e3a81fe.mp4`
- **Thumbnail** (optional): Upload a thumbnail image for the video
- **Steps** (optional): Add step-by-step instructions

#### Size Chart Section:
- **Title**: "Measure your perfect fit"
- **Tabs**: Add two tabs:

  **Tab 1: Product Dimensions**
  - Tab Name: "Product Dimensions"
  - Image: Upload or use URL: `https://cdn.shopify.com/s/files/1/0553/0419/2034/files/SizeGuide_PC_1.png`
  - Description: (leave empty or add custom text)

  **Tab 2: How to Measure**
  - Tab Name: "How to Measure"
  - Image: Upload or use URL: `https://cdn.shopify.com/s/files/1/0553/0419/2034/files/PostureCorrector_HowtoMeasure.jpg`
  - Description: "Measure around the widest part of your chest with a tape measure for the perfect fit posture support."

### Step 3: Save and Publish

1. Click "Publish" to make the content live
2. The popups will now display your custom content

## 🎨 Default Fallback Data

If no Sanity data is found, the popups will use these default values:

**How to Use:**
- Video URL: `https://cdn.shopify.com/videos/c/o/v/77427aa5e95b487c85a330da1e3a81fe.mp4`

**Size Chart:**
- Tab 1: Product Dimensions (`https://cdn.shopify.com/s/files/1/0553/0419/2034/files/SizeGuide_PC_1.png`)
- Tab 2: How to Measure (`https://cdn.shopify.com/s/files/1/0553/0419/2034/files/PostureCorrector_HowtoMeasure.jpg`)

## 🚀 How It Works

1. **User clicks "How to Use?" card** → Opens video popup
2. **User clicks "Measure your perfect fit" card** → Opens size chart popup with tabs
3. **Popups display:**
   - Content from Sanity CMS if available
   - Default content (Shopify URLs) if Sanity data not found
4. **Mobile-optimized:** Slide-up animation from bottom
5. **Desktop-optimized:** Center modal with backdrop

## 🎬 Video Format Support

The video player supports:
- MP4 format
- Autoplay control
- Mute/unmute toggle
- Loop playback
- Hardware-accelerated playback

## 📱 Mobile Experience

- Smooth slide-up animation
- Full-screen takeover
- Touch-optimized controls
- Native share menu integration
- Swipe-to-close support (via close button)

## 🖼️ Image Optimization

All images are:
- ✅ Automatically optimized via OptimizedImage component
- ✅ Cached for better performance
- ✅ Responsive (adapts to screen size)
- ✅ Lazy-loaded where appropriate

## 🔄 API Integration

Data is fetched from:
```
/api/sanity/{productHandle}?type=all
```

Includes:
- Product Features
- Description
- Highlights
- FAQs
- Gallery
- **Guides** (new!)

## 📊 Performance

- ✅ Data cached for 5 minutes
- ✅ Parallel API calls (Shopify + Sanity)
- ✅ Progressive loading
- ✅ Hardware-accelerated animations
- ✅ Optimized images

## 🎯 Next Steps

1. Deploy the changes to your environment
2. Add product guides data in Sanity Studio
3. Test the popups on mobile and desktop
4. Customize styling if needed

## 💡 Customization

You can customize:
- **Colors**: Edit the Tailwind classes in the popup components
- **Animations**: Modify the timing in `globals.css`
- **Layout**: Adjust the popup structure in the component files
- **Content**: Add more tabs or sections in Sanity schema

---

**Need help?** Check the component files for inline comments and documentation!


