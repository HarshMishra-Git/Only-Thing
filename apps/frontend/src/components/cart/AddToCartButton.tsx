'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';

const Button = styled.button`
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  cursor: pointer;
  transition: all ${theme.transitions.duration.base};
  
  &:hover:not(:disabled) {
    background-color: ${theme.colors.gray.dark};
    transform: scale(${theme.interactions.scale.hover});
  }
  
  &:active:not(:disabled) {
    transform: scale(${theme.interactions.scale.press});
  }
  
  &:disabled {
    background-color: ${theme.colors.gray.medium};
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  color: #4caf50;
  font-weight: ${theme.typography.weights.semibold};
`;

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
  };
  quantity?: number;
  fullWidth?: boolean;
}

export function AddToCartButton({ product, quantity = 1, fullWidth }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem, syncWithServer } = useCartStore();
  const { accessToken } = useAuth();

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      // Add to local store
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity,
      });

      // Sync with server if logged in
      if (accessToken) {
        await syncWithServer(accessToken);
      }

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (showSuccess) {
    return (
      <Button disabled style={{ width: fullWidth ? '100%' : 'auto' }}>
        <SuccessMessage>
          ✓ Added to cart
        </SuccessMessage>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}

