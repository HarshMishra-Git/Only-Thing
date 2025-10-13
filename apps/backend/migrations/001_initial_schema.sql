-- Only Thing Health & Wellness - Initial Database Schema
-- Phase 1: Core e-commerce tables with ML-readiness instrumentation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  profile JSONB DEFAULT '{}'::jsonb,
  -- Profile fields: age, skin_type, concerns[], location
  marketing_consent BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_profile ON users USING GIN(profile);

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Images: [{ url, alt, width, height, is_primary }]
  ingredients JSONB DEFAULT '[]'::jsonb,
  -- Ingredients: [{ name, concentration, benefits[] }]
  clinical_evidence JSONB DEFAULT '[]'::jsonb,
  -- Clinical evidence: [{ study_title, summary, result, source_url }]
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Metadata: tags, categories, features, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_ingredients ON products USING GIN(ingredients);
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);
CREATE INDEX idx_products_title_search ON products USING gin(to_tsvector('english', title || ' ' || description));

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  -- Items: [{ product_id, sku, title, quantity, price_cents }]
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  -- Status: pending, processing, shipped, delivered, cancelled
  payment_provider VARCHAR(50) NOT NULL,
  -- Payment provider: stripe, razorpay
  payment_intent_id VARCHAR(255),
  shipping JSONB NOT NULL,
  -- Shipping: { full_name, address_line1, address_line2, city, state, postal_code, country, phone }
  tracking_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_intent ON orders(payment_intent_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  verified BOOLEAN DEFAULT false,
  -- Verified purchaser flag (set if user has purchased this product)
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(verified);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE UNIQUE INDEX idx_reviews_user_product ON reviews(user_id, product_id);

-- ============================================================================
-- QUIZ_RESPONSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anon_id VARCHAR(255),
  -- Anonymous ID for non-logged-in users
  responses JSONB NOT NULL,
  -- Responses: { question_id: answer }
  result JSONB NOT NULL,
  -- Result: { recommendations: [{ product_id, score, reason }], explainability }
  recommended_products JSONB DEFAULT '[]'::jsonb,
  -- Flattened list of product IDs for easy querying
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_anon_id ON quiz_responses(anon_id);
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);
CREATE INDEX idx_quiz_responses_data ON quiz_responses USING GIN(responses);
CREATE INDEX idx_quiz_recommended_products ON quiz_responses USING GIN(recommended_products);

-- ============================================================================
-- EVENTS TABLE (ML Instrumentation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anon_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  -- Event types: product_view, add_to_cart, purchase, quiz_submit, search, review_submit
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  cart_id UUID,
  quiz_id UUID REFERENCES quiz_responses(id) ON DELETE SET NULL,
  value NUMERIC(10, 2),
  -- Optional: monetary value for purchase events
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Full event payload with context, device info, etc.
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_anon_id ON events(anon_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_product_id ON events(product_id);
CREATE INDEX idx_events_timestamp ON events(timestamp DESC);
CREATE INDEX idx_events_payload ON events USING GIN(payload);

-- ============================================================================
-- CARTS TABLE (Server-side cart storage)
-- ============================================================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  anon_id VARCHAR(255),
  -- Anonymous ID for non-logged-in users
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Items: [{ product_id, quantity, price_cents }]
  total_cents INTEGER DEFAULT 0 CHECK (total_cents >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_anon_id ON carts(anon_id);
CREATE INDEX idx_carts_expires_at ON carts(expires_at);

-- ============================================================================
-- REFRESH_TOKENS TABLE (Secure token storage)
-- ============================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT false
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts with profile data for personalization';
COMMENT ON TABLE products IS 'Product catalog with ingredients and clinical evidence';
COMMENT ON TABLE orders IS 'Order history and payment tracking';
COMMENT ON TABLE reviews IS 'Product reviews with verified purchaser flag';
COMMENT ON TABLE quiz_responses IS 'Quiz answers and personalized recommendations';
COMMENT ON TABLE events IS 'Event stream for analytics and ML training';
COMMENT ON TABLE carts IS 'Server-side cart storage for logged-in and anonymous users';
COMMENT ON TABLE refresh_tokens IS 'Secure refresh token storage for JWT auth';
