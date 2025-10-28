export default {
  name: 'productHighlights',
  title: 'Product Highlights',
  type: 'document',
  fields: [
    {
      name: 'productHandle',
      title: 'Product Handle',
      type: 'string',
      description: 'The Shopify product handle (slug) this highlights belong to',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main title for the highlights section',
      initialValue: 'Product Highlights'
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Highlight Image',
              type: 'image',
              options: {
                hotspot: true
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'title',
              title: 'Highlight Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image'
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).max(6)
    }
  ],
  preview: {
    select: {
      title: 'productHandle',
      subtitle: 'title'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: `Product: ${title}`,
        subtitle: subtitle || 'Product Highlights'
      };
    }
  }
};
