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
    name: 'ONLY BIO-COLLAGEN',
    slug: 'only-bio-collagen',
    price: 4999,
    currency: 'USD',
    category: 'supplements',
    shortDescription: 'Premium bio-available collagen sachet for comprehensive health',
    description: 'ONLY BIO-COLLAGEN is a premium collagen supplement designed to support multiple aspects of your health. Our bio-available collagen formula provides comprehensive benefits for skin, hair, nails, muscles, gut health, and overall longevity. Each sachet delivers high-quality collagen peptides that are easily absorbed by your body.',
    ingredients: [
      {
        name: 'Hydrolyzed Collagen Peptides',
        concentration: 'Type I & III',
        benefits: ['Skin elasticity', 'Anti-aging', 'Joint support'],
      },
      {
        name: 'Vitamin C',
        benefits: ['Collagen synthesis', 'Antioxidant protection'],
      },
      {
        name: 'Biotin',
        benefits: ['Hair and nail health', 'Skin vitality'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Collagen supplementation for skin health',
        summary: 'Studies show significant improvement in skin elasticity and hydration with regular collagen supplementation',
        result: 'Clinically proven benefits for anti-aging',
      },
    ],
    images: ['/images/products/only-bio-collagen.jpg'],
    stock: 100,
    rating: 4.9,
    reviewCount: 245,
  },
  {
    id: '2',
    name: 'ONLY REVIVE',
    slug: 'only-revive',
    price: 3999,
    currency: 'USD',
    category: 'supplements',
    shortDescription: 'Female health sachet targeting PCOS and overall wellness',
    description: 'ONLY REVIVE is a specialized formulation designed for female health and wellness. This comprehensive supplement targets PCOS symptoms while supporting overall female hormonal balance, reproductive health, and vitality. Each sachet contains a carefully balanced blend of nutrients specifically chosen for women\'s health needs.',
    ingredients: [
      {
        name: 'Myo-Inositol',
        concentration: '2000mg',
        benefits: ['PCOS support', 'Hormonal balance', 'Ovarian function'],
      },
      {
        name: 'D-Chiro-Inositol',
        concentration: '50mg',
        benefits: ['Insulin sensitivity', 'Metabolic support'],
      },
      {
        name: 'Folate & B-Vitamins',
        benefits: ['Energy production', 'Reproductive health'],
      },
    ],
    images: ['/images/products/only-revive.jpg'],
    stock: 85,
    rating: 4.8,
    reviewCount: 189,
  },
  {
    id: '3',
    name: 'ONLY DAY & NIGHT',
    slug: 'only-day-night',
    price: 5499,
    currency: 'USD',
    category: 'supplements',
    shortDescription: 'India\'s first 24-hour anti-aging regimen in capsule form',
    description: 'ONLY DAY & NIGHT represents a breakthrough in anti-aging supplementation - India\'s first 24-hour magic formula. This advanced system features separate day and night capsules, each optimized for your body\'s circadian rhythm. The day capsule provides antioxidant protection and energy, while the night capsule supports cellular repair and regeneration during sleep.',
    ingredients: [
      {
        name: 'Resveratrol (Day)',
        benefits: ['Antioxidant protection', 'Cellular defense', 'Daytime vitality'],
      },
      {
        name: 'Melatonin (Night)',
        benefits: ['Sleep quality', 'Nighttime repair', 'Cellular regeneration'],
      },
      {
        name: 'NAD+ Precursors',
        benefits: ['Cellular energy', 'Longevity support', 'Anti-aging'],
      },
      {
        name: 'CoQ10',
        benefits: ['Energy production', 'Antioxidant', 'Heart health'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Circadian-optimized anti-aging supplementation',
        summary: 'Chronobiology research shows enhanced efficacy when supplements align with natural body rhythms',
        result: 'Superior results compared to single-dose formulations',
      },
    ],
    images: ['/images/products/only-day-night.jpg'],
    stock: 75,
    rating: 5.0,
    reviewCount: 312,
  },
  {
    id: '4',
    name: 'ONLY CELL REPAIR',
    slug: 'only-cell-repair',
    price: 7999,
    currency: 'USD',
    category: 'serums',
    shortDescription: 'Ultra-advanced face serum with dual peptide technology',
    description: 'ONLY CELL REPAIR is an ultra-advanced facial serum featuring cutting-edge dual peptide technology. This sophisticated formula penetrates deep into the skin to stimulate cellular repair, boost collagen production, and visibly reduce signs of aging. The dual peptide complex works synergistically to deliver transformative results.',
    ingredients: [
      {
        name: 'Matrixyl 3000',
        concentration: '8%',
        benefits: ['Collagen synthesis', 'Wrinkle reduction', 'Skin firmness'],
      },
      {
        name: 'Argireline (Acetyl Hexapeptide-8)',
        concentration: '10%',
        benefits: ['Expression line reduction', 'Muscle relaxation', 'Botox-like effect'],
      },
      {
        name: 'Hyaluronic Acid Complex',
        concentration: '2%',
        benefits: ['Deep hydration', 'Plumping', 'Moisture retention'],
      },
      {
        name: 'Niacinamide',
        concentration: '5%',
        benefits: ['Brightening', 'Pore refinement', 'Barrier support'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Clinical efficacy of peptide combinations in anti-aging',
        summary: 'Dual peptide formulations show 45% greater improvement in wrinkle depth compared to single peptide serums',
        result: 'Highly significant (p<0.001)',
      },
    ],
    images: ['/images/products/only-cell-repair.jpg'],
    stock: 60,
    rating: 4.9,
    reviewCount: 267,
  },
  {
    id: '5',
    name: 'ONLY SOLLIGENT',
    slug: 'only-solligent',
    price: 4999,
    currency: 'USD',
    category: 'sunscreen',
    shortDescription: 'Next-gen hybrid intelligent sunscreen + antioxidant shield',
    description: 'ONLY SOLLIGENT is a revolutionary next-generation sunscreen that goes beyond traditional UV protection. This intelligent hybrid formula combines broad-spectrum SPF 50+ protection with powerful antioxidants to create a comprehensive defense system against environmental damage. The lightweight, non-greasy formula provides invisible protection while nourishing your skin.',
    ingredients: [
      {
        name: 'Zinc Oxide + Chemical UV Filters',
        concentration: 'SPF 50+ PA++++',
        benefits: ['Broad-spectrum protection', 'UVA/UVB defense', 'Blue light protection'],
      },
      {
        name: 'Vitamin C (L-Ascorbic Acid)',
        concentration: '10%',
        benefits: ['Antioxidant protection', 'Brightening', 'Free radical defense'],
      },
      {
        name: 'Niacinamide',
        concentration: '4%',
        benefits: ['Anti-inflammatory', 'Skin barrier support'],
      },
      {
        name: 'Green Tea Extract',
        benefits: ['Antioxidant boost', 'Anti-aging', 'Soothing'],
      },
    ],
    images: ['/images/products/only-solligent.jpg'],
    stock: 120,
    rating: 4.8,
    reviewCount: 421,
  },
  {
    id: '6',
    name: 'ONLY EXOSKIN',
    slug: 'only-exoskin',
    price: 8999,
    currency: 'USD',
    category: 'serums',
    shortDescription: 'Highly advanced multi-action skin elixir with exosomes',
    description: 'ONLY EXOSKIN represents the pinnacle of skincare innovation. This highly advanced, multi-action elixir combines cutting-edge exosome technology with PDRN (Polydeoxyribonucleotide), peptides, vitamins, antioxidants, and ceramides. Exosomes are nature\'s cellular messengers that communicate skin regeneration signals, promoting remarkable rejuvenation and repair.',
    ingredients: [
      {
        name: 'Plant-Derived Exosomes',
        concentration: '5%',
        benefits: ['Cellular communication', 'Regeneration', 'Anti-aging signaling'],
      },
      {
        name: 'PDRN (Salmon DNA)',
        concentration: '3%',
        benefits: ['Tissue repair', 'Collagen production', 'Wound healing'],
      },
      {
        name: 'Peptide Complex (Tripeptide-1, Hexapeptide-9)',
        concentration: '6%',
        benefits: ['Collagen synthesis', 'Firming', 'Wrinkle reduction'],
      },
      {
        name: 'Ceramide Complex (NP, AP, EOP)',
        concentration: '4%',
        benefits: ['Barrier repair', 'Moisture retention', 'Skin protection'],
      },
      {
        name: 'Vitamin Complex (C, E, B3, B5)',
        benefits: ['Antioxidant protection', 'Brightening', 'Nourishment'],
      },
      {
        name: 'Resveratrol + Coenzyme Q10',
        benefits: ['Anti-aging', 'Free radical defense', 'Cellular energy'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Exosome technology in skin regeneration',
        summary: 'Clinical trials demonstrate exosomes significantly enhance skin repair mechanisms and reduce visible signs of aging',
        result: 'Revolutionary breakthrough in cellular skincare',
      },
    ],
    images: ['/images/products/only-exoskin.jpg'],
    stock: 45,
    rating: 5.0,
    reviewCount: 198,
  },
  {
    id: '7',
    name: 'ONLY BIOME - GUT REPAIR',
    slug: 'only-biome-gut-repair',
    price: 4499,
    currency: 'USD',
    category: 'supplements',
    shortDescription: 'Next-gen gut health gummy with complete microbiome support',
    description: 'ONLY BIOME - GUT REPAIR is a revolutionary next-generation gut health supplement in delicious gummy form. This comprehensive formula combines probiotics, prebiotics, postbiotics, and polyphenols with essential micronutrients to support complete microbiome balance, digestive health, and metabolic wellness. Perfect for those seeking convenient, enjoyable gut health support.',
    ingredients: [
      {
        name: 'Multi-Strain Probiotic Blend',
        concentration: '10 Billion CFU',
        benefits: ['Gut flora balance', 'Digestive health', 'Immune support'],
      },
      {
        name: 'Prebiotic Fiber (Inulin, FOS)',
        concentration: '2g',
        benefits: ['Feeds beneficial bacteria', 'Digestive regularity'],
      },
      {
        name: 'Postbiotics (Butyrate)',
        benefits: ['Gut lining repair', 'Anti-inflammatory', 'Metabolic health'],
      },
      {
        name: 'Polyphenol Complex',
        benefits: ['Antioxidant protection', 'Microbiome diversity'],
      },
      {
        name: 'Digestive Enzymes',
        benefits: ['Nutrient absorption', 'Reduced bloating'],
      },
      {
        name: 'Vitamin D3 & Zinc',
        benefits: ['Immune function', 'Gut barrier integrity'],
      },
    ],
    clinicalEvidence: [
      {
        studyTitle: 'Synbiotic supplementation for gut health',
        summary: 'Combined probiotic, prebiotic, and postbiotic formulations show superior results in microbiome balance and digestive wellness',
        result: 'Significant improvement in gut health markers',
      },
    ],
    images: ['/images/products/only-biome-gut-repair.jpg'],
    stock: 95,
    rating: 4.7,
    reviewCount: 334,
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
