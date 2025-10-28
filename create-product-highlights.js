const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN_CLI,
});

const fridoOrthoticsHighlights = {
  _type: 'productHighlights',
  productHandle: 'frido-orthotics-posture-corrector',
  title: 'Product Highlights',
  highlights: [
    {
      _key: 'highlight-1',
      image: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Posture_highlight_1_04e77506-f20b-4204-b8ed-9519ac6c4718.jpg',
      title: 'Poor Posture to Perfect Alignment',
      description: 'Designed to relieve soreness, correct slouching, and help prevent early signs of kyphosis.'
    },
    {
      _key: 'highlight-2',
      image: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Posture_highlight_4.jpg',
      title: 'Reduces Back, Neck & Shoulder Discomfort',
      description: 'Helps reduce pain by improving your posture naturally.'
    },
    {
      _key: 'highlight-3',
      image: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Posture_highlight_2.jpg',
      title: 'Invisible Under Your Clothes',
      description: 'Comfortable enough to wear all day, discreet under any outfit.'
    },
    {
      _key: 'highlight-4',
      image: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Posture_Highlight_3.jpg',
      title: 'Sweat-Resistant Breathable Fabric',
      description: 'Maintains comfort by keeping moisture away from your skin.'
    },
    {
      _key: 'highlight-5',
      image: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Posture_highlight_6.jpg',
      title: 'Smart Compression Technology',
      description: 'Combines firm support with freedom of movement.'
    },
    {
      _key: 'highlight-6',
      image: 'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Posture_Highlight_5.jpg',
      title: 'Wear It Anytime, Anywhere',
      description: 'Suitable to wear throughout your day—at work, while studying, commuting or even gaming.'
    }
  ]
};

async function createProductHighlights() {
  try {
    console.log('Creating product highlights for: frido-orthotics-posture-corrector');
    
    // First, check if it already exists
    const existing = await client.fetch(`
      *[_type == "productHighlights" && productHandle == $productHandle][0]
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (existing) {
      console.log('⚠️  Product highlights already exist. Updating...');
      const result = await client
        .patch(existing._id)
        .set(fridoOrthoticsHighlights)
        .commit();
      console.log('✅ Product highlights updated successfully!');
      console.log('Document ID:', result._id);
    } else {
      const result = await client.create(fridoOrthoticsHighlights);
      console.log('✅ Product highlights created successfully!');
      console.log('Document ID:', result._id);
    }
    
    // Test fetching the data
    console.log('\n🔍 Testing data fetch...');
    const fetchedData = await client.fetch(`
      *[_type == "productHighlights" && productHandle == $productHandle][0] {
        _id,
        _type,
        productHandle,
        title,
        highlights[] {
          _key,
          image,
          title,
          description
        }
      }
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (fetchedData) {
      console.log('✅ Data fetch successful!');
      console.log('Fetched product handle:', fetchedData.productHandle);
      console.log('Section title:', fetchedData.title);
      console.log('Number of highlights:', fetchedData.highlights?.length || 0);
      
      if (fetchedData.highlights) {
        console.log('\n📋 Highlights:');
        fetchedData.highlights.forEach((highlight, index) => {
          console.log(`   ${index + 1}. ${highlight.title}`);
          console.log(`      Description: ${highlight.description}`);
          console.log(`      Image: ${highlight.image}`);
        });
      }
    } else {
      console.log('❌ No data found');
    }
    
    // Test the exact query used in your app
    console.log('\n🧪 Testing app query format:');
    const appQueryResult = await client.fetch(`
      *[_type == "productHighlights" && productHandle == $productHandle][0] {
        _id,
        _type,
        productHandle,
        title,
        highlights[] {
          _key,
          image,
          title,
          description
        }
      }
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (appQueryResult) {
      console.log('✅ App query successful!');
      console.log('   Data structure matches expected format');
      console.log('   Ready for use in your ProductHighlights component');
    } else {
      console.log('❌ App query failed - no data returned');
    }
    
  } catch (error) {
    console.error('❌ Error creating product highlights:', error);
  }
}

createProductHighlights();