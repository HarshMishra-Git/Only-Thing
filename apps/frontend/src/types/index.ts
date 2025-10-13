// Product Types
export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_cents: number;
  currency: string;
  stock: number;
  images: ProductImage[];
  ingredients?: Ingredient[];
  clinical_evidence?: ClinicalEvidence[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  is_primary?: boolean;
}

export interface Ingredient {
  name: string;
  concentration?: string;
  benefits?: string[];
}

export interface ClinicalEvidence {
  study_title: string;
  summary: string;
  result?: string;
  source_url?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  profile?: UserProfile;
  marketing_consent: boolean;
  created_at: string;
}

export interface UserProfile {
  age?: number;
  skin_type?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
  concerns?: string[];
  location?: string;
}

// Cart & Order Types
export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  price_cents: number;
}

export interface Cart {
  id: string;
  user_id?: string;
  items: CartItem[];
  total_cents: number;
  currency: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_cents: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_provider: 'stripe' | 'razorpay';
  payment_intent_id: string;
  shipping: ShippingInfo;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  sku: string;
  title: string;
  quantity: number;
  price_cents: number;
}

export interface ShippingInfo {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

// Review Types
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // 1-5
  text: string;
  verified: boolean;
  created_at: string;
  user?: {
    full_name: string;
  };
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'range';
  options?: QuizOption[];
  min?: number;
  max?: number;
}

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizResponse {
  question_id: string;
  answer: string | string[] | number;
}

export interface QuizResult {
  recommendations: ProductRecommendation[];
  explainability: string;
}

export interface ProductRecommendation {
  product_id: string;
  product: Product;
  score: number;
  reason: string;
}

// Event Types (for instrumentation)
export interface AnalyticsEvent {
  anon_id?: string;
  user_id?: string;
  event_type: 
    | 'product_view'
    | 'add_to_cart'
    | 'purchase'
    | 'quiz_submit'
    | 'search'
    | 'review_submit';
  product_id?: string;
  cart_id?: string;
  quiz_id?: string;
  value?: number;
  context?: {
    page?: string;
    referrer?: string;
    campaign?: string;
  };
  device?: {
    ua?: string;
    os?: string;
    browser?: string;
  };
  timestamp: string;
  meta?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
