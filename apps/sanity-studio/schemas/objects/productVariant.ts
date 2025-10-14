import { defineType } from 'sanity';

export default defineType({
  name: 'productVariant',
  title: 'Product Variant',
  type: 'object',
  fields: [
    {
      name: 'name',
      title: 'Variant Name',
      type: 'string',
      description: 'e.g., "Small", "Blue", "L/Red"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Leave empty to use base product price',
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: 'image',
      title: 'Variant Image',
      type: 'imageWithAlt',
    },
    {
      name: 'options',
      title: 'Variant Options',
      type: 'object',
      fields: [
        {
          name: 'size',
          title: 'Size',
          type: 'string',
        },
        {
          name: 'color',
          title: 'Color',
          type: 'string',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'image',
    },
  },
});
