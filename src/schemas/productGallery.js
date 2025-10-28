export default {
  name: 'productGallery',
  title: 'Product Gallery',
  type: 'document',
  fields: [
    {
      name: 'productHandle',
      title: 'Product Handle',
      type: 'string',
      description: 'The Shopify product handle this gallery belongs to',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      description: 'Optional title for the gallery'
    },
    {
      name: 'mediaItems',
      title: 'Media Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mediaItem',
          title: 'Media Item',
          fields: [
            {
              name: 'type',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Alternative text for accessibility'
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string'
                }
              ],
              hidden: ({ parent }) => parent?.type !== 'image'
            },
            {
              name: 'videoUrl',
              title: 'Video URL',
              type: 'url',
              description: 'Direct URL to video file (MP4, WebM, etc.)',
              hidden: ({ parent }) => parent?.type !== 'video'
            },
            {
              name: 'videoSources',
              title: 'Video Sources',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'url',
                      title: 'Video URL',
                      type: 'url'
                    },
                    {
                      name: 'format',
                      title: 'Format',
                      type: 'string',
                      options: {
                        list: ['mp4', 'webm', 'ogg']
                      }
                    },
                    {
                      name: 'mimeType',
                      title: 'MIME Type',
                      type: 'string',
                      options: {
                        list: [
                          'video/mp4',
                          'video/webm',
                          'video/ogg'
                        ]
                      }
                    }
                  ]
                }
              ],
              hidden: ({ parent }) => parent?.type !== 'video'
            },
            {
              name: 'previewImage',
              title: 'Preview Image',
              type: 'image',
              description: 'Preview image for video (optional)',
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string'
                }
              ],
              hidden: ({ parent }) => parent?.type !== 'video'
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which this media appears in the gallery',
              validation: Rule => Rule.min(0)
            }
          ],
          preview: {
            select: {
              title: 'type',
              media: 'image',
              videoUrl: 'videoUrl'
            },
            prepare(selection) {
              const { title, media, videoUrl } = selection;
              return {
                title: title === 'image' ? 'Image' : 'Video',
                media: title === 'image' ? media : null,
                subtitle: title === 'video' ? videoUrl : media?.asset?.originalFilename
              };
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).error('At least one media item is required')
    },
    {
      name: 'settings',
      title: 'Gallery Settings',
      type: 'object',
      fields: [
        {
          name: 'autoplay',
          title: 'Autoplay Videos',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'showThumbnails',
          title: 'Show Thumbnails',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'enableSwipe',
          title: 'Enable Swipe Navigation',
          type: 'boolean',
          initialValue: true
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      productHandle: 'productHandle',
      mediaCount: 'mediaItems.length'
    },
    prepare(selection) {
      const { title, productHandle, mediaCount } = selection;
      return {
        title: title || `Gallery for ${productHandle}`,
        subtitle: `${mediaCount} media item${mediaCount !== 1 ? 's' : ''}`
      };
    }
  }
};
