export default {
  name: 'productGuides',
  title: 'Product Guides',
  type: 'document',
  fields: [
    {
      name: 'productHandle',
      title: 'Product Handle',
      type: 'string',
      description: 'The product handle (slug) this guide belongs to',
      validation: Rule => Rule.required()
    },
    {
      name: 'howToUse',
      title: 'How to Use Guide',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'How to Use'
        },
        {
          name: 'videoUrl',
          title: 'Video URL',
          type: 'url',
          description: 'Full URL to the video'
        },
        {
          name: 'thumbnail',
          title: 'Video Thumbnail',
          type: 'image',
          options: {
            hotspot: true
          }
        },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'stepNumber',
                  title: 'Step Number',
                  type: 'number'
                },
                {
                  name: 'title',
                  title: 'Step Title',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Step Description',
                  type: 'text'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'sizeChart',
      title: 'Size Chart / Measurement Guide',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Measure your perfect fit'
        },
        {
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'tabName',
                  title: 'Tab Name',
                  type: 'string',
                  description: 'e.g., "Product Dimensions" or "How to Measure"'
                },
                {
                  name: 'image',
                  title: 'Tab Image',
                  type: 'image',
                  options: {
                    hotspot: true
                  }
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

