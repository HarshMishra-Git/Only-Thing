// Document types
import product from './documents/product';
import category from './documents/category';
import post from './documents/post';
import author from './documents/author';
import page from './documents/page';

// Object types
import productVariant from './objects/productVariant';
import seo from './objects/seo';
import blockContent from './objects/blockContent';
import imageWithAlt from './objects/imageWithAlt';
import heroSection from './objects/heroSection';
import featuresSection from './objects/featuresSection';
import ctaSection from './objects/ctaSection';
import faqItem from './objects/faqItem';

export const schemaTypes = [
  // Documents
  product,
  category,
  post,
  author,
  page,
  
  // Objects
  productVariant,
  seo,
  blockContent,
  imageWithAlt,
  heroSection,
  featuresSection,
  ctaSection,
  faqItem,
];
