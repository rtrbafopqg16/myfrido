export default {
  name: 'bankOfferDetails',
  title: 'Bank Offer Details',
  type: 'document',
  fields: [
    {
      name: 'bankId',
      title: 'Bank ID',
      type: 'string',
      description: 'Unique identifier for the bank (e.g., "snapmint", "hdfc")',
      validation: Rule => Rule.required().error('Bank ID is required')
    },
    {
      name: 'bankName',
      title: 'Bank Name',
      type: 'string',
      description: 'Display name of the bank',
      validation: Rule => Rule.required()
    },
    {
      name: 'logo',
      title: 'Bank Logo',
      type: 'string',
      description: 'URL to bank logo image',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      }).error('Please enter a valid URL')
    },
    {
      name: 'offerTitle',
      title: 'Offer Title',
      type: 'string',
      description: 'Main offer text (e.g., "Get 10% Cashback up to")',
      validation: Rule => Rule.required()
    },
    {
      name: 'cashbackAmount',
      title: 'Cashback Amount',
      type: 'string',
      description: 'Cashback amount (e.g., "₹1500")',
      validation: Rule => Rule.required()
    },
    {
      name: 'offerDescription',
      title: 'Offer Description',
      type: 'string',
      description: 'Additional offer details (e.g., "with NO COST EMI on Frido Pay Later")',
      validation: Rule => Rule.required()
    },
    {
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key features to highlight (e.g., "0% Interest Installments", "0% Extra Cost")',
      validation: Rule => Rule.max(5).error('Maximum 5 features allowed')
    },
    {
      name: 'paymentSchedule',
      title: 'Payment Schedule',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'installment',
              title: 'Installment Number',
              type: 'string',
              description: 'e.g., "1/3", "2/3", "3/3"'
            },
            {
              name: 'label',
              title: 'Payment Label',
              type: 'string',
              description: 'e.g., "Pay Now", "post 30 days"'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Additional description for the payment'
            }
          ]
        }
      ],
      validation: Rule => Rule.max(3).error('Maximum 3 payment schedules allowed')
    },
    {
      name: 'termsAndConditions',
      title: 'Terms and Conditions',
      type: 'array',
      of: [{ type: 'text' }],
      description: 'List of terms and conditions',
      validation: Rule => Rule.required().min(1).error('At least one term is required')
    },
    {
      name: 'validFrom',
      title: 'Valid From',
      type: 'date',
      description: 'Offer start date',
      validation: Rule => Rule.required()
    },
    {
      name: 'validTo',
      title: 'Valid To',
      type: 'date',
      description: 'Offer end date',
      validation: Rule => Rule.required()
    },
    {
      name: 'maxCashback',
      title: 'Maximum Cashback',
      type: 'string',
      description: 'Maximum cashback amount (e.g., "₹1500")',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'bankName',
      subtitle: 'offerTitle',
      media: 'logo'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Untitled Bank Offer',
        subtitle: subtitle || 'No offer title'
      }
    }
  }
}
