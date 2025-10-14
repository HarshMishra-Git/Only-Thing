export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'skin_type',
    question: 'What is your skin type?',
    type: 'single',
    options: [
      { value: 'oily', label: 'Oily' },
      { value: 'dry', label: 'Dry' },
      { value: 'combination', label: 'Combination' },
      { value: 'sensitive', label: 'Sensitive' },
      { value: 'normal', label: 'Normal' },
    ],
  },
  {
    id: 'primary_concern',
    question: 'What is your primary skin concern?',
    type: 'single',
    options: [
      { value: 'hyperpigmentation', label: 'Hyperpigmentation / Dark Spots' },
      { value: 'acne', label: 'Acne / Blemishes' },
      { value: 'aging', label: 'Fine Lines / Aging' },
      { value: 'dryness', label: 'Dryness / Dehydration' },
      { value: 'redness', label: 'Redness / Sensitivity' },
    ],
  },
  {
    id: 'age_range',
    question: 'What is your age range?',
    type: 'single',
    options: [
      { value: '18-25', label: '18-25' },
      { value: '26-35', label: '26-35' },
      { value: '36-45', label: '36-45' },
      { value: '46+', label: '46+' },
    ],
  },
  {
    id: 'sensitivity',
    question: 'Does your skin react to products easily?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, my skin is very sensitive' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'no', label: 'No, my skin is resilient' },
    ],
  },
  {
    id: 'current_routine',
    question: 'What does your current skincare routine look like?',
    type: 'single',
    options: [
      { value: 'minimal', label: 'Minimal (cleanser + moisturizer)' },
      { value: 'moderate', label: 'Moderate (3-5 products)' },
      { value: 'extensive', label: 'Extensive (6+ products)' },
      { value: 'none', label: 'I don\'t have a routine yet' },
    ],
  },
  {
    id: 'goals',
    question: 'What are your skincare goals? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'brighten', label: 'Brighten skin tone' },
      { value: 'hydrate', label: 'Improve hydration' },
      { value: 'antiaging', label: 'Reduce signs of aging' },
      { value: 'clear', label: 'Clear blemishes' },
      { value: 'protect', label: 'Protect from damage' },
    ],
  },
];

export function calculateRecommendations(answers: Record<string, string | string[]>) {
  const recommendations: Array<{ productId: string; reason: string; score: number }> = [];
  
  // Rule 1: Hyperpigmentation → Vitamin C Serum
  if (answers.primary_concern === 'hyperpigmentation' || (Array.isArray(answers.goals) && answers.goals.includes('brighten'))) {
    recommendations.push({
      productId: '1',
      reason: 'Contains 15% Vitamin C clinically proven to reduce hyperpigmentation by 23% in 12 weeks',
      score: 0.95,
    });
  }
  
  // Rule 2: Dryness/Hydration → Hyaluronic Moisturizer
  if (answers.skin_type === 'dry' || answers.primary_concern === 'dryness' || (Array.isArray(answers.goals) && answers.goals.includes('hydrate'))) {
    recommendations.push({
      productId: '2',
      reason: 'Multi-weight hyaluronic acid provides deep, long-lasting hydration for all skin layers',
      score: 0.92,
    });
  }
  
  // Rule 3: Aging → Retinol Night Cream
  if (answers.primary_concern === 'aging' || answers.age_range === '36-45' || answers.age_range === '46+' || (Array.isArray(answers.goals) && answers.goals.includes('antiaging'))) {
    recommendations.push({
      productId: '3',
      reason: 'Time-release retinol reduces fine lines by 34% with minimal irritation',
      score: 0.90,
    });
  }
  
  // Rule 4: Acne → Niacinamide Serum
  if (answers.primary_concern === 'acne' || (Array.isArray(answers.goals) && answers.goals.includes('clear'))) {
    recommendations.push({
      productId: '5',
      reason: '10% Niacinamide with Zinc PCA controls oil and minimizes pores',
      score: 0.88,
    });
  }
  
  // Rule 5: Sensitive skin → Gentle Cleanser
  if (answers.sensitivity === 'yes' || answers.skin_type === 'sensitive') {
    recommendations.push({
      productId: '4',
      reason: 'pH-balanced formula cleanses without stripping, perfect for sensitive skin',
      score: 0.85,
    });
  }
  
  // Rule 6: Minimal routine → Gentle Cleanser (starter)
  if (answers.current_routine === 'none' || answers.current_routine === 'minimal') {
    if (!recommendations.some(r => r.productId === '4')) {
      recommendations.push({
        productId: '4',
        reason: 'Perfect foundation for building a skincare routine',
        score: 0.80,
      });
    }
  }
  
  // Sort by score and return top 3
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
