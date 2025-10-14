'use client';

import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { formatPrice } from '@/lib/mockData';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[3]};
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]} ${theme.spacing[3]};
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  margin-bottom: ${theme.spacing[3]};
`;

const EmptyText = styled.p`
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
`;

const ShopButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    background-color: ${theme.colors.gray.dark};
    transform: scale(${theme.interactions.scale.hover});
  }
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[3]};
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  background-color: ${theme.colors.gray.light};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.sizes['3xl']};
`;

const ItemInfo = styled.div``;

const ItemName = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[1]};
`;

const ItemPrice = styled.p`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[2]};
`;

const QuantityControl = styled.div`
  display: flex;
  border: 1px solid ${theme.colors.gray.light};
  width: fit-content;
`;

const QtyButton = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: ${theme.colors.gray.light};
  }
`;

const QtyDisplay = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid ${theme.colors.gray.light};
  border-right: 1px solid ${theme.colors.gray.light};
  font-weight: ${theme.typography.weights.semibold};
`;

const RemoveButton = styled.button`
  align-self: start;
  padding: ${theme.spacing[1]};
  background: none;
  border: none;
  color: ${theme.colors.gray.dark};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  
  &:hover {
    color: ${theme.colors.black};
  }
`;

const OrderSummary = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing[2]} 0;
  border-bottom: 1px solid ${theme.colors.gray.light};
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.gray.dark};
`;

const SummaryValue = styled.span`
  font-weight: ${theme.typography.weights.semibold};
`;

const TotalRow = styled(SummaryRow)`
  border-top: 2px solid ${theme.colors.black};
  border-bottom: none;
  margin-top: ${theme.spacing[2]};
  padding-top: ${theme.spacing[3]};
`;

const TotalLabel = styled.span`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
`;

const TotalValue = styled.span`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.black};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: ${theme.spacing[3]};
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  cursor: pointer;
  margin-top: ${theme.spacing[3]};
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    background-color: ${theme.colors.gray.dark};
  }
`;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, loadFromServer } = useCartStore();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) {
      loadFromServer(accessToken);
    }
  }, [accessToken, loadFromServer]);
  
  if (items.length === 0) {
    return (
      <>
        <Header />
        <PageContainer>
          <ContentContainer>
            <PageTitle>Shopping Cart</PageTitle>
            <EmptyCart>
              <EmptyIcon>🛒</EmptyIcon>
              <EmptyText>Your cart is empty</EmptyText>
              <ShopButton href="/products">Continue Shopping</ShopButton>
            </EmptyCart>
          </ContentContainer>
        </PageContainer>
        <Footer />
      </>
    );
  }

  const shipping = subtotal() >= 50 ? 0 : 9.99;
  const total = subtotal() + shipping;

  return (
    <>
      <Header />
      <PageContainer>
        <ContentContainer>
          <PageTitle>Shopping Cart ({totalItems()})</PageTitle>
          
          <CartGrid>
            <CartItems>
              {items.map((item) => (
                <CartItem key={item.productId}>
                  <ItemImage>📦</ItemImage>
                  <ItemInfo>
                    <ItemName>
                      <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    </ItemName>
                    <ItemPrice>{formatPrice(item.price)}</ItemPrice>
                    <QuantityControl>
                      <QtyButton onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</QtyButton>
                      <QtyDisplay>{item.quantity}</QtyDisplay>
                      <QtyButton onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</QtyButton>
                    </QuantityControl>
                  </ItemInfo>
                  <RemoveButton onClick={() => removeItem(item.productId)}>Remove</RemoveButton>
                </CartItem>
              ))}
            </CartItems>

            <OrderSummary>
              <SummaryTitle>Order Summary</SummaryTitle>
              
              <SummaryRow>
                <SummaryLabel>Subtotal</SummaryLabel>
                <SummaryValue>{formatPrice(subtotal())}</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Shipping</SummaryLabel>
                <SummaryValue>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</SummaryValue>
              </SummaryRow>
              
              {subtotal() < 50 && (
                <SummaryRow>
                  <SummaryLabel style={{ fontSize: '12px', color: theme.colors.gray.medium }}>Free shipping on orders over $50</SummaryLabel>
                  <SummaryValue></SummaryValue>
                </SummaryRow>
              )}
              
              <TotalRow>
                <TotalLabel>Total</TotalLabel>
                <TotalValue>{formatPrice(total)}</TotalValue>
              </TotalRow>

              <CheckoutButton>
                Proceed to Checkout
              </CheckoutButton>
            </OrderSummary>
          </CartGrid>
        </ContentContainer>
      </PageContainer>
      <Footer />
    </>
  );
}
