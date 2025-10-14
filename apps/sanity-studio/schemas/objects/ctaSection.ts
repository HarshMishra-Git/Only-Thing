import { defineType } from 'sanity';

export default defineType({
  name: 'ctaSection',
  title: 'Call to Action Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Button Text',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'link',
          type: 'string',
          title: 'Button Link',
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: 'secondaryButton',
      title: 'Secondary Button (Optional)',
      type: 'object',
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Button Text',
        },
        {
          name: 'link',
          type: 'string',
          title: 'Button Link',
        },
      ],
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'imageWithAlt',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'primaryButton.text',
    },
  },
});
