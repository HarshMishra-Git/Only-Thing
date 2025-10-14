'use client';

import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
`;

const UserInfo = styled.div`
  background: ${theme.colors.gray.light};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
  border-radius: 8px;
`;

const UserName = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
`;

const UserEmail = styled.p`
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.gray.dark};
  }
`;

const SecondaryButton = styled(Button)`
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  border: 1px solid ${theme.colors.black};

  &:hover {
    background: ${theme.colors.gray.light};
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[6]};
`;

const SectionCard = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  
  h3 {
    font-family: ${theme.typography.fonts.display};
    font-size: ${theme.typography.sizes.xl};
    font-weight: ${theme.typography.weights.bold};
    margin-bottom: ${theme.spacing[2]};
  }
  
  p {
    color: ${theme.colors.gray.dark};
    line-height: 1.6;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: ${theme.typography.sizes.lg};
`;

export function AccountClient() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <Loading>Loading...</Loading>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Container>
      <UserInfo>
        <UserName>
          {user.firstName || user.lastName 
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
            : 'Welcome'}
        </UserName>
        <UserEmail>{user.email}</UserEmail>
        <ButtonGroup>
          <SecondaryButton>Edit Profile</SecondaryButton>
          <Button onClick={handleLogout}>Logout</Button>
        </ButtonGroup>
      </UserInfo>

      <SectionGrid>
        <SectionCard>
          <h3>Order History</h3>
          <p>View all your past orders, track current shipments, and access invoices.</p>
        </SectionCard>

        <SectionCard>
          <h3>Saved Addresses</h3>
          <p>Manage your shipping addresses for faster checkout.</p>
        </SectionCard>

        <SectionCard>
          <h3>Payment Methods</h3>
          <p>Securely save payment information for quick purchases.</p>
        </SectionCard>

        <SectionCard>
          <h3>Wishlist</h3>
          <p>View and manage your saved products.</p>
        </SectionCard>

        <SectionCard>
          <h3>Quiz Results</h3>
          <p>Access your personalized skin assessment and recommendations.</p>
        </SectionCard>

        <SectionCard>
          <h3>Subscriptions</h3>
          <p>Manage your auto-replenishment subscriptions and save 15%.</p>
        </SectionCard>
      </SectionGrid>
    </Container>
  );
}
