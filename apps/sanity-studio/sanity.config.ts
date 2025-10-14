import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'E-commerce CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    deskTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (prev, context) => {
      const { document } = context;
      const baseUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000';
      
      if (document._type === 'product') {
        return `${baseUrl}/products/${document.slug?.current}`;
      }
      if (document._type === 'post') {
        return `${baseUrl}/blog/${document.slug?.current}`;
      }
      if (document._type === 'page') {
        return `${baseUrl}/${document.slug?.current}`;
      }
      
      return prev;
    },
  },
});
