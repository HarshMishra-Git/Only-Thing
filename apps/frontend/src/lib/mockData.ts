// Mock data for demo purposes
// In production, this would come from the backend API

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  category: string;
  shortDescription: string;
  description: string;
  ingredients: Array<{
    name: string;
    concentration?: string;
    benefits: string[];
  }>;
  clinicalEvidence?: Array<{
    studyTitle: string;
    summary: string;
    result?: string;
  }>;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vitamin C Serum',
    slug: 'vitamin-c-serum',
    price: 4900,
    currency: 'USD',
    category: 'serums',
    shortDescription: 'Brightening serum with 15% L-Ascorbic Acid',
    description: 'Our clinically-proven Vitamin C Serum delivers powerful antioxidant protection while visibly brightening and evening skin tone. Formulated with 15% stabilized L-Ascorbic Acid, this lightweight serum penetrates deeply to target hyperpigmentation and promote collagen synthesis.',
    ingredients: [
      {
        name: 'L-Ascorbic Acid (Vitamin C)',
        concentration: '15%',
        benefits: ['Brightening', 'Antioxidant protection', 'Collagen synthesis'],
      },
      {
        name: 'Ferulic Acid',
        concentration: '0.5%',
        benefits: ['Stabilizes Vitamin C', 'Additional antioxidant protection'],
      },
      {
        name: 'Vitamin E (Tocopherol)',
        concentration: '1%',
        benefits: ['Moisturizing', 'Anti-inflammatory'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Efficacy of Vitamin C in photoprotection',
        summary: 'Clinical study showed 23% reduction in hyperpigmentation over 12 weeks',
        result: 'Statistically significant (p<0.05)',
      },
    ],
    images: ['/images/products/vitamin-c-serum.jpg'],
    stock: 50,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    name: 'Hyaluronic Moisturizer',
    slug: 'hyaluronic-moisturizer',
    price: 5900,
    currency: 'USD',
    category: 'moisturizers',
    shortDescription: 'Lightweight hydrating gel with multi-weight HA',
    description: 'Experience deep, long-lasting hydration with our Hyaluronic Moisturizer. Featuring three molecular weights of hyaluronic acid, this gel-cream formula penetrates multiple skin layers to deliver moisture where it\'s needed most.',
    ingredients: [
      {
        name: 'Sodium Hyaluronate (Low MW)',
        concentration: '1%',
        benefits: ['Deep hydration', 'Plumping effect'],
      },
      {
        name: 'Hyaluronic Acid (High MW)',
        concentration: '0.5%',
        benefits: ['Surface hydration', 'Skin barrier support'],
      },
      {
        name: 'Niacinamide (Vitamin B3)',
        concentration: '5%',
        benefits: ['Pore minimizing', 'Brightening', 'Anti-inflammatory'],
      },
    ],
    images: ['/images/products/hyaluronic-moisturizer.jpg'],
    stock: 35,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: '3',
    name: 'Retinol Night Cream',
    slug: 'retinol-night-cream',
    price: 6900,
    currency: 'USD',
    category: 'treatments',
    shortDescription: 'Time-release retinol for anti-aging overnight repair',
    description: 'Transform your skin overnight with our advanced Retinol Night Cream. Formulated with 0.5% encapsulated retinol for time-release delivery, this rich cream minimizes irritation while maximizing anti-aging benefits.',
    ingredients: [
      {
        name: 'Retinol (encapsulated)',
        concentration: '0.5%',
        benefits: ['Reduces fine lines', 'Improves texture', 'Cell turnover'],
      },
      {
        name: 'Peptide Complex',
        concentration: '3%',
        benefits: ['Collagen production', 'Firming', 'Anti-aging'],
      },
      {
        name: 'Squalane',
        concentration: '2%',
        benefits: ['Moisturizing', 'Non-comedogenic', 'Barrier repair'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Efficacy of time-release retinol in photoaged skin',
        summary: '34% improvement in fine lines and wrinkles after 16 weeks',
        result: 'Significant improvement vs. placebo (p<0.01)',
      },
    ],
    images: ['/images/products/retinol-night-cream.jpg'],
    stock: 28,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: '4',
    name: 'Gentle Cleanser',
    slug: 'gentle-cleanser',
    price: 3900,
    currency: 'USD',
    category: 'cleansers',
    shortDescription: 'pH-balanced foaming cleanser for all skin types',
    description: 'Start your routine with our Gentle Cleanser, a pH-balanced formula that effectively removes impurities without stripping natural oils. Suitable for all skin types, including sensitive skin.',
    ingredients: [
      {
        name: 'Sodium Cocoyl Isethionate',
        benefits: ['Gentle surfactant', 'Non-drying'],
      },
      {
        name: 'Glycerin',
        concentration: '3%',
        benefits: ['Hydrating', 'Skin barrier support'],
      },
      {
        name: 'Panthenol (Pro-Vitamin B5)',
        concentration: '1%',
        benefits: ['Soothing', 'Anti-inflammatory', 'Moisturizing'],
      },
    ],
    images: ['/images/products/gentle-cleanser.jpg'],
    stock: 65,
    rating: 4.6,
    reviewCount: 156,
  },
  {
    id: '5',
    name: 'Niacinamide Serum',
    slug: 'niacinamide-serum',
    price: 4500,
    currency: 'USD',
    category: 'serums',
    shortDescription: '10% Niacinamide for pore refinement and clarity',
    description: 'Achieve clearer, more refined skin with our Niacinamide Serum. This high-strength formula combines 10% Niacinamide with Zinc PCA to minimize pores, control oil, and reduce blemishes.',
    ingredients: [
      {
        name: 'Niacinamide (Vitamin B3)',
        concentration: '10%',
        benefits: ['Pore minimizing', 'Oil control', 'Brightening'],
      },
      {
        name: 'Zinc PCA',
        concentration: '1%',
        benefits: ['Sebum regulation', 'Anti-inflammatory'],
      },
    ],
    images: ['/images/products/niacinamide-serum.jpg'],
    stock: 42,
    rating: 4.7,
    reviewCount: 178,
  },
  {
    id: '6',
    name: 'Peptide Eye Cream',
    slug: 'peptide-eye-cream',
    price: 5500,
    currency: 'USD',
    category: 'treatments',
    shortDescription: 'Targeted treatment for dark circles and fine lines',
    description: 'Revitalize the delicate eye area with our Peptide Eye Cream. This concentrated formula targets dark circles, puffiness, and fine lines with a powerful blend of peptides and caffeine.',
    ingredients: [
      {
        name: 'Matrixyl 3000',
        concentration: '5%',
        benefits: ['Collagen boosting', 'Reduces fine lines'],
      },
      {
        name: 'Caffeine',
        concentration: '2%',
        benefits: ['Reduces puffiness', 'De-puffing', 'Circulation'],
      },
      {
        name: 'Hyaluronic Acid',
        concentration: '1%',
        benefits: ['Hydration', 'Plumping'],
      },
    ],
    images: ['/images/products/peptide-eye-cream.jpg'],
    stock: 31,
    rating: 4.5,
    reviewCount: 94,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(product => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(product => product.category === category);
}

export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
