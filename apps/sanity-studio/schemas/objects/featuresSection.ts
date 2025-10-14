import { defineType } from 'sanity';

export default defineType({
  name: 'featuresSection',
  title: 'Features Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Feature Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Feature Description',
              rows: 3,
            },
            {
              name: 'icon',
              type: 'string',
              title: 'Icon Name',
              description: 'e.g., "star", "heart", "shield"',
            },
            {
              name: 'image',
              type: 'imageWithAlt',
              title: 'Feature Image',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'features.length',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title,
        subtitle: `${subtitle} features`,
      };
    },
  },
});
