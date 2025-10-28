export default {
  name: 'productFeatures',
  title: 'Product Features',
  type: 'document',
  fields: [
    {
      name: 'productHandle',
      title: 'Product Handle',
      type: 'string',
      description: 'Enter the Shopify product handle (e.g., "frido-orthotics-posture-corrector")',
      validation: Rule => Rule.required().error('Product handle is required'),
      options: {
        placeholder: 'frido-orthotics-posture-corrector'
      }
    },
    {
      name: 'productTitle',
      title: 'Product Title',
      type: 'string',
      description: 'Product name for reference',
      validation: Rule => Rule.required()
    },
    {
      name: 'features',
      title: 'Product Features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: Rule => Rule.required().max(50).error('Title must be 50 characters or less')
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Optional detailed description'
            },
            {
              name: 'icon',
              title: 'Feature Icon',
              type: 'string',
              description: 'Icon URL (e.g., from Shopify CDN or Sanity asset)',
              validation: Rule => Rule.uri({
                scheme: ['http', 'https']
              }).error('Please enter a valid URL')
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description'
            }
          }
        }
      ],
      validation: Rule => Rule.max(6).error('Maximum 6 features allowed')
    }
  ],
  preview: {
    select: {
      title: 'productTitle',
      subtitle: 'productHandle'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Untitled Product',
        subtitle: `Handle: ${subtitle || 'No handle'}`
      }
    }
  }
}
