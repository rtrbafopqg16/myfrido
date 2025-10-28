const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN_CLI,
});

async function deleteFridoOrthoticsDescription() {
  try {
    console.log('🔍 Looking for product description: frido-orthotics-posture-corrector');
    
    // First, find the document
    const existing = await client.fetch(`
      *[_type == "productDescription" && productHandle == $productHandle][0] {
        _id,
        productHandle
      }
    `, { productHandle: 'frido-orthotics-posture-corrector' });
    
    if (existing) {
      console.log('✅ Found document to delete:');
      console.log(`   ID: ${existing._id}`);
      console.log(`   Handle: ${existing.productHandle}`);
      
      // Delete the document
      await client.delete(existing._id);
      console.log('🗑️  Document deleted successfully!');
      
      // Verify deletion
      console.log('\n🔍 Verifying deletion...');
      const verifyDeletion = await client.fetch(`
        *[_type == "productDescription" && productHandle == $productHandle][0]
      `, { productHandle: 'frido-orthotics-posture-corrector' });
      
      if (!verifyDeletion) {
        console.log('✅ Verification successful - document has been deleted');
      } else {
        console.log('❌ Verification failed - document still exists');
      }
      
    } else {
      console.log('❌ No document found with handle: frido-orthotics-posture-corrector');
    }
    
    // Show remaining product descriptions
    console.log('\n📋 Remaining product descriptions in CMS:');
    const remainingProducts = await client.fetch(`
      *[_type == "productDescription"] {
        _id,
        productHandle,
        "descriptionLength": length(description),
        "hasProductDetails": defined(productDetails),
        "hasReturnsPolicy": defined(returnsAndRefunds),
        "hasCareInstructions": defined(careInstructions)
      }
    `);
    
    if (remainingProducts.length > 0) {
      remainingProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.productHandle}`);
        console.log(`      ID: ${product._id}`);
        console.log(`      Description: ${product.descriptionLength} blocks`);
        console.log(`      Product Details: ${product.hasProductDetails ? 'Yes' : 'No'}`);
        console.log(`      Returns Policy: ${product.hasReturnsPolicy ? 'Yes' : 'No'}`);
        console.log(`      Care Instructions: ${product.hasCareInstructions ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('   No product descriptions remaining in CMS');
    }
    
  } catch (error) {
    console.error('❌ Error deleting product description:', error);
  }
}

deleteFridoOrthoticsDescription();
