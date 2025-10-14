import { test, expect } from '@playwright/test';

/**
 * Checkout Flow E2E Tests
 * Tests the complete purchase journey
 */

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('complete checkout flow as guest user', async ({ page }) => {
    // 1. Browse products
    await page.click('[data-testid="products-link"]');
    await expect(page).toHaveURL(/\/products/);
    
    // 2. Add product to cart
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
    
    // 3. Go to cart
    await page.click('[data-testid="cart-button"]');
    await expect(page).toHaveURL(/\/cart/);
    
    // Verify cart item
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // 4. Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL(/\/checkout/);
    
    // 5. Fill shipping information
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'New York');
    await page.fill('[name="state"]', 'NY');
    await page.fill('[name="zip"]', '10001');
    await page.fill('[name="country"]', 'US');
    
    // 6. Continue to payment
    await page.click('[data-testid="continue-to-payment"]');
    
    // 7. Fill payment information (using test card)
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4242 4242 4242 4242');
    await stripeFrame.locator('[name="exp-date"]').fill('12/34');
    await stripeFrame.locator('[name="cvc"]').fill('123');
    
    // 8. Place order
    await page.click('[data-testid="place-order"]');
    
    // 9. Verify order confirmation
    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('checkout with existing user account', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for redirect
    await expect(page).toHaveURL('/');
    
    // 2. Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // 3. Go to checkout
    await page.click('[data-testid="cart-button"]');
    await page.click('[data-testid="checkout-button"]');
    
    // 4. Verify saved address is pre-filled
    await expect(page.locator('[name="address"]')).not.toBeEmpty();
    
    // 5. Complete checkout
    await page.click('[data-testid="continue-to-payment"]');
    
    // Use saved card
    await page.click('[data-testid="use-saved-card"]');
    
    // Place order
    await page.click('[data-testid="place-order"]');
    
    // Verify success
    await expect(page).toHaveURL(/\/order-confirmation/);
  });

  test('apply discount code during checkout', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // Go to cart
    await page.click('[data-testid="cart-button"]');
    
    // Get original price
    const originalPrice = await page.locator('[data-testid="cart-total"]').textContent();
    
    // Apply discount code
    await page.fill('[data-testid="discount-input"]', 'SAVE10');
    await page.click('[data-testid="apply-discount"]');
    
    // Verify discount applied
    await expect(page.locator('[data-testid="discount-applied"]')).toBeVisible();
    
    // Verify price reduced
    const newPrice = await page.locator('[data-testid="cart-total"]').textContent();
    expect(newPrice).not.toBe(originalPrice);
  });

  test('handle out of stock items', async ({ page }) => {
    // Go to out of stock product
    await page.goto('/products/out-of-stock-product');
    
    // Verify add to cart button is disabled
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeDisabled();
    
    // Verify out of stock message
    await expect(page.locator('[data-testid="out-of-stock"]')).toBeVisible();
    
    // Verify notify me button is visible
    await expect(page.locator('[data-testid="notify-me"]')).toBeVisible();
  });

  test('validate form errors', async ({ page }) => {
    // Add product and go to checkout
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="cart-button"]');
    await page.click('[data-testid="checkout-button"]');
    
    // Try to continue without filling form
    await page.click('[data-testid="continue-to-payment"]');
    
    // Verify error messages
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="address-error"]')).toBeVisible();
    
    // Fill invalid email
    await page.fill('[name="email"]', 'invalid-email');
    await page.click('[data-testid="continue-to-payment"]');
    
    // Verify email format error
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valid email');
  });

  test('cart persists across page refreshes', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // Verify cart badge
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
    
    // Refresh page
    await page.reload();
    
    // Verify cart still has item
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
  });

  test('update quantity in cart', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // Go to cart
    await page.click('[data-testid="cart-button"]');
    
    // Get original price
    const originalPrice = await page.locator('[data-testid="cart-subtotal"]').textContent();
    
    // Increase quantity
    await page.click('[data-testid="quantity-increase"]');
    
    // Verify quantity updated
    await expect(page.locator('[data-testid="quantity-input"]')).toHaveValue('2');
    
    // Verify price doubled
    const newPrice = await page.locator('[data-testid="cart-subtotal"]').textContent();
    expect(newPrice).not.toBe(originalPrice);
  });

  test('remove item from cart', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // Go to cart
    await page.click('[data-testid="cart-button"]');
    
    // Remove item
    await page.click('[data-testid="remove-item"]');
    
    // Verify empty cart message
    await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-badge"]')).not.toBeVisible();
  });
});
