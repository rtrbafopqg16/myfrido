export default {
  name: 'productDescription',
  title: 'Product Description',
  type: 'document',
  fields: [
    {
      name: 'productHandle',
      title: 'Product Handle',
      type: 'string',
      description: 'The Shopify product handle (slug) this description belongs to',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        }
      ],
      description: 'Rich text description of the product'
    },
    {
      name: 'productDetails',
      title: 'Product Details',
      type: 'object',
      fields: [
        {
          name: 'mrp',
          title: 'MRP (Inclusive of all taxes)',
          type: 'string'
        },
        {
          name: 'manufacturerName',
          title: 'Manufacturer\'s Name',
          type: 'string'
        },
        {
          name: 'manufacturerAddress',
          title: 'Manufacturer\'s Address',
          type: 'text'
        },
        {
          name: 'countryOfOrigin',
          title: 'Country of Origin',
          type: 'string'
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string'
        },
        {
          name: 'weight',
          title: 'Weight',
          type: 'string'
        },
        {
          name: 'dimensions',
          title: 'Dimensions',
          type: 'string'
        }
      ],
      description: 'Detailed product specifications and information'
    },
    {
      name: 'returnsAndRefunds',
      title: 'Return and Refund Policy',
      type: 'text',
      description: 'Return and refund policy information'
    },
    {
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      description: 'Instructions for caring and maintaining the product'
    }
  ],
  preview: {
    select: {
      title: 'productHandle',
      subtitle: 'description'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: `Product: ${title}`,
        subtitle: subtitle ? 'Description available' : 'No description'
      };
    }
  }
};
