export default {
  name: 'productFAQs',
  title: 'Product FAQs',
  type: 'document',
  fields: [
    {
      name: 'productHandle',
      title: 'Product Handle',
      type: 'string',
      description: 'The Shopify product handle (slug) this FAQs belong to',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main title for the FAQs section',
      initialValue: 'FAQs'
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: Rule => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer'
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              return {
                title: title,
                subtitle: subtitle ? subtitle.substring(0, 60) + '...' : 'No answer'
              };
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).max(10)
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
        subtitle: subtitle || 'Product FAQs'
      };
    }
  }
};
