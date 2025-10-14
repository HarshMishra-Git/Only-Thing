import { defineField, defineType } from 'sanity';
import { FiUser } from 'react-icons/fi';

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: FiUser,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., Content Writer, Editor',
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter URL',
        },
        {
          name: 'instagram',
          type: 'url',
          title: 'Instagram URL',
        },
        {
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn URL',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
});
