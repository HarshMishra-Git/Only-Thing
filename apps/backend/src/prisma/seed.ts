import prisma from './client';

const products = [
  {
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-serum',
    description: 'A powerful antioxidant serum formulated with 20% pure L-Ascorbic Acid (Vitamin C) to brighten skin, reduce hyperpigmentation, and boost collagen production. This clinically-proven formula delivers visible results in as little as 2 weeks.',
    shortDescription: 'Brightens skin and reduces dark spots with 20% pure Vitamin C',
    price: 49.00,
    compareAtPrice: 65.00,
    category: 'Serums',
    tags: ['Brightening', 'Anti-Aging', 'Antioxidant', 'Vitamin C'],
    servingSize: '2-3 drops',
    servingsPerContainer: 60,
    features: ['Clinically Tested', 'Vegan', 'Cruelty-Free', 'Paraben-Free'],
    dietaryInfo: ['Vegan', 'Gluten-Free'],
    sku: 'VCS-001',
    inStock: true,
    stockQuantity: 150,
    rating: 4.8,
    reviewCount: 342,
    isActive: true,
    isFeatured: true,
    ingredients: [
      { name: 'L-Ascorbic Acid (Vitamin C)', amount: '20%', benefit: 'Powerful antioxidant that brightens skin and stimulates collagen production', order: 1 },
      { name: 'Ferulic Acid', amount: '0.5%', benefit: 'Enhances Vitamin C stability and provides additional antioxidant protection', order: 2 },
      { name: 'Vitamin E', amount: '1%', benefit: 'Moisturizes and protects skin from free radical damage', order: 3 },
      { name: 'Hyaluronic Acid', amount: '2%', benefit: 'Deeply hydrates and plumps skin', order: 4 },
    ],
    supplementFacts: [
      { nutrient: 'Vitamin C (L-Ascorbic Acid)', amount: '20mg per application', dailyValue: '22%', order: 1 },
      { nutrient: 'Vitamin E', amount: '1mg per application', dailyValue: '7%', order: 2 },
    ],
  },
  {
    name: 'Hyaluronic Acid Moisturizer',
    slug: 'hyaluronic-moisturizer',
    description: 'An ultra-hydrating moisturizer featuring five molecular weights of Hyaluronic Acid to penetrate multiple skin layers. Combined with ceramides and peptides to strengthen the skin barrier and lock in moisture for 24-hour hydration.',
    shortDescription: 'Multi-weight hyaluronic acid for deep, lasting hydration',
    price: 59.00,
    compareAtPrice: null,
    category: 'Moisturizers',
    tags: ['Hydration', 'Plumping', 'Anti-Aging', 'Barrier Repair'],
    servingSize: '1 pump',
    servingsPerContainer: 50,
    features: ['Clinically Tested', 'Oil-Free', 'Non-Comedogenic', 'Fragrance-Free'],
    dietaryInfo: ['Vegan', 'Gluten-Free'],
    sku: 'HAM-002',
    inStock: true,
    stockQuantity: 200,
    rating: 4.9,
    reviewCount: 567,
    isActive: true,
    isFeatured: true,
    ingredients: [
      { name: 'Multi-Weight Hyaluronic Acid', amount: '5%', benefit: 'Provides multi-level hydration from surface to deep skin layers', order: 1 },
      { name: 'Ceramide Complex', amount: '3%', benefit: 'Strengthens skin barrier and prevents moisture loss', order: 2 },
      { name: 'Matrixyl 3000', amount: '2%', benefit: 'Peptide complex that stimulates collagen and elastin production', order: 3 },
      { name: 'Niacinamide', amount: '5%', benefit: 'Improves skin texture and minimizes pores', order: 4 },
    ],
    supplementFacts: [],
  },
  {
    name: 'Retinol Night Renewal Cream',
    slug: 'retinol-night-cream',
    description: 'A potent yet gentle retinol treatment that works overnight to reduce fine lines, wrinkles, and improve skin texture. Formulated with time-release technology to minimize irritation while maximizing results.',
    shortDescription: 'Time-release retinol for smoother, younger-looking skin',
    price: 69.00,
    compareAtPrice: 89.00,
    category: 'Night Creams',
    tags: ['Anti-Aging', 'Retinol', 'Wrinkle Reduction', 'Texture'],
    servingSize: '1 pump',
    servingsPerContainer: 45,
    features: ['Clinically Tested', 'Time-Release Formula', 'Dermatologist Recommended'],
    dietaryInfo: ['Vegetarian'],
    sku: 'RNC-003',
    inStock: true,
    stockQuantity: 120,
    rating: 4.7,
    reviewCount: 289,
    isActive: true,
    isFeatured: true,
    ingredients: [
      { name: 'Retinol', amount: '0.5%', benefit: 'Reduces fine lines and wrinkles, improves skin texture', order: 1 },
      { name: 'Bakuchiol', amount: '1%', benefit: 'Plant-based retinol alternative that enhances results', order: 2 },
      { name: 'Squalane', amount: '5%', benefit: 'Deeply moisturizes without clogging pores', order: 3 },
      { name: 'Peptide Blend', amount: '3%', benefit: 'Supports collagen production and skin firmness', order: 4 },
    ],
    supplementFacts: [],
  },
  {
    name: 'Gentle Cleansing Gel',
    slug: 'gentle-cleanser',
    description: 'A soap-free, pH-balanced cleanser that effectively removes makeup, dirt, and impurities without stripping the skin. Perfect for all skin types, especially sensitive skin.',
    shortDescription: 'pH-balanced cleanser for all skin types',
    price: 39.00,
    compareAtPrice: null,
    category: 'Cleansers',
    tags: ['Gentle', 'pH-Balanced', 'Sensitive Skin', 'Daily Use'],
    servingSize: '1-2 pumps',
    servingsPerContainer: 60,
    features: ['Soap-Free', 'pH-Balanced', 'Fragrance-Free', 'Non-Irritating'],
    dietaryInfo: ['Vegan', 'Gluten-Free'],
    sku: 'GCG-004',
    inStock: true,
    stockQuantity: 250,
    rating: 4.6,
    reviewCount: 423,
    isActive: true,
    isFeatured: true,
    ingredients: [
      { name: 'Mild Surfactant Blend', amount: '15%', benefit: 'Gently cleanses without stripping natural oils', order: 1 },
      { name: 'Glycerin', amount: '5%', benefit: 'Maintains skin hydration during cleansing', order: 2 },
      { name: 'Chamomile Extract', amount: '2%', benefit: 'Soothes and calms sensitive skin', order: 3 },
      { name: 'Allantoin', amount: '0.5%', benefit: 'Promotes skin healing and comfort', order: 4 },
    ],
    supplementFacts: [],
  },
  {
    name: 'Niacinamide Pore Refining Serum',
    slug: 'niacinamide-serum',
    description: 'A concentrated serum with 10% Niacinamide to minimize pores, control oil production, and improve overall skin texture. Enhanced with zinc to reduce blemishes and calm inflammation.',
    shortDescription: 'Minimizes pores and controls oil with 10% Niacinamide',
    price: 45.00,
    compareAtPrice: null,
    category: 'Serums',
    tags: ['Pore Minimizing', 'Oil Control', 'Brightening', 'Niacinamide'],
    servingSize: '2-3 drops',
    servingsPerContainer: 60,
    features: ['Clinically Tested', 'Oil-Free', 'Non-Comedogenic'],
    dietaryInfo: ['Vegan'],
    sku: 'NPS-005',
    inStock: true,
    stockQuantity: 180,
    rating: 4.7,
    reviewCount: 412,
    isActive: true,
    isFeatured: false,
    ingredients: [
      { name: 'Niacinamide (Vitamin B3)', amount: '10%', benefit: 'Minimizes pores, regulates oil, and brightens skin', order: 1 },
      { name: 'Zinc PCA', amount: '1%', benefit: 'Controls sebum production and reduces inflammation', order: 2 },
      { name: 'N-Acetyl Glucosamine', amount: '2%', benefit: 'Improves skin texture and reduces hyperpigmentation', order: 3 },
    ],
    supplementFacts: [],
  },
  {
    name: 'Alpha Arbutin Brightening Treatment',
    slug: 'alpha-arbutin-treatment',
    description: 'A targeted brightening treatment with 2% Alpha Arbutin to fade dark spots and even skin tone. Works synergistically with Vitamin C for enhanced brightening effects.',
    shortDescription: 'Fades dark spots and evens skin tone',
    price: 52.00,
    compareAtPrice: null,
    category: 'Treatments',
    tags: ['Brightening', 'Dark Spots', 'Hyperpigmentation', 'Even Tone'],
    servingSize: '2-3 drops',
    servingsPerContainer: 60,
    features: ['Clinically Tested', 'Vegan', 'Cruelty-Free'],
    dietaryInfo: ['Vegan'],
    sku: 'AAB-006',
    inStock: true,
    stockQuantity: 95,
    rating: 4.5,
    reviewCount: 178,
    isActive: true,
    isFeatured: false,
    ingredients: [
      { name: 'Alpha Arbutin', amount: '2%', benefit: 'Inhibits melanin production to fade dark spots', order: 1 },
      { name: 'Kojic Acid', amount: '1%', benefit: 'Additional brightening and dark spot reduction', order: 2 },
      { name: 'Licorice Extract', amount: '2%', benefit: 'Natural brightener and anti-inflammatory', order: 3 },
    ],
    supplementFacts: [],
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (be careful in production!)
  await prisma.review.deleteMany();
  await prisma.supplementFact.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.product.deleteMany();

  console.log('🗑️  Cleared existing products');

  // Seed products
  for (const productData of products) {
    const { ingredients, supplementFacts, ...product } = productData;

    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        ingredients: {
          create: ingredients,
        },
        supplementFacts: {
          create: supplementFacts,
        },
      },
    });

    console.log(`✅ Created product: ${createdProduct.name}`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
