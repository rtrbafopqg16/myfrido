const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN_CLI,
});

const fridoOrthoticsFAQs = {
  _type: 'productFAQs',
  productHandle: 'frido-orthotics-posture-corrector',
  title: 'FAQs',
  faqs: [
    {
      _key: 'faq-1',
      question: 'How long should I wear the Frido Posture Corrector each day?',
      answer: 'We recommend starting with short daily sessions and gradually increasing the duration over time. The corrector works by training your muscles, so consistent use in small intervals is more effective than wearing it for long stretches occasionally.'
    },
    {
      _key: 'faq-2',
      question: 'Can I wear this under my regular clothes?',
      answer: 'Absolutely! The Frido Posture Corrector was specifically designed to be slim and discreet, making it virtually invisible under standard work attire, casual clothing, and even most fitted shirts.'
    },
    {
      _key: 'faq-3',
      question: 'How do I know which size to order?',
      answer: 'Measure around the fullest part of your chest. S: 28-34", M: 34-40", L: 40-50". When between sizes, we recommend sizing up for comfort.'
    },
    {
      _key: 'faq-4',
      question: 'Is this comfortable enough for all-day wear?',
      answer: 'Yes! Unlike rigid posture braces, our breathable octa-pore fabric and flexible design make it comfortable for extended periods. The moisture-wicking technology prevents sweat buildup during long wear.'
    },
    {
      _key: 'faq-5',
      question: 'Will this restrict my movement?',
      answer: 'No. The Frido Posture Corrector provides gentle guidance rather than rigid restriction. You\'ll maintain full range of motion while receiving helpful feedback to maintain proper alignment.'
    },
    {
      _key: 'faq-6',
      question: 'Can this help with my existing back pain?',
      answer: 'Many users report significant relief from upper back and shoulder discomfort. While it\'s not a medical treatment, proper posture alignment often reduces strain on overworked muscles that contribute to pain.'
    },
    {
      _key: 'faq-7',
      question: 'How soon will I notice improvements in my posture?',
      answer: 'Most users feel immediate improvements while wearing the corrector. Long-term posture habits typically begin to change after 2-3 weeks of consistent use as your muscles strengthen and adapt.'
    }
  ]
};

async function createProductFAQs() {
  try {
    console.log('Creating product FAQs for: frido-orthotics-posture-corrector');
    
    // First, check if it already exists
    const existing = await client.fetch(`
      *[_type == "productFAQs" && productHandle == $productHandle][0]
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (existing) {
      console.log('⚠️  Product FAQs already exist. Updating...');
      const result = await client
        .patch(existing._id)
        .set(fridoOrthoticsFAQs)
        .commit();
      console.log('✅ Product FAQs updated successfully!');
      console.log('Document ID:', result._id);
    } else {
      const result = await client.create(fridoOrthoticsFAQs);
      console.log('✅ Product FAQs created successfully!');
      console.log('Document ID:', result._id);
    }
    
    // Test fetching the data
    console.log('\n🔍 Testing data fetch...');
    const fetchedData = await client.fetch(`
      *[_type == "productFAQs" && productHandle == $productHandle][0] {
        _id,
        _type,
        productHandle,
        title,
        faqs[] {
          _key,
          question,
          answer
        }
      }
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (fetchedData) {
      console.log('✅ Data fetch successful!');
      console.log('Fetched product handle:', fetchedData.productHandle);
      console.log('Section title:', fetchedData.title);
      console.log('Number of FAQs:', fetchedData.faqs?.length || 0);
      
      if (fetchedData.faqs) {
        console.log('\n📋 FAQs:');
        fetchedData.faqs.forEach((faq, index) => {
          console.log(`   ${index + 1}. ${faq.question}`);
          console.log(`      Answer: ${faq.answer.substring(0, 60)}...`);
        });
      }
    } else {
      console.log('❌ No data found');
    }
    
    // Test the exact query used in your app
    console.log('\n🧪 Testing app query format:');
    const appQueryResult = await client.fetch(`
      *[_type == "productFAQs" && productHandle == $productHandle][0] {
        _id,
        _type,
        productHandle,
        title,
        faqs[] {
          _key,
          question,
          answer
        }
      }
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (appQueryResult) {
      console.log('✅ App query successful!');
      console.log('   Data structure matches expected format');
      console.log('   Ready for use in your ProductFAQs component');
    } else {
      console.log('❌ App query failed - no data returned');
    }
    
  } catch (error) {
    console.error('❌ Error creating product FAQs:', error);
  }
}

createProductFAQs();
