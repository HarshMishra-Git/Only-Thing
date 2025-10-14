'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import { theme } from '@/lib/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.body};
  text-align: center;
  padding: ${theme.spacing[4]};
`;

const Logo = styled.div`
  margin-bottom: ${theme.spacing[6]};
  
  img {
    max-width: 200px;
    height: auto;
  }
`;

const Message = styled.div`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  margin-bottom: ${theme.spacing[4]};
`;

const SubMessage = styled.div`
  font-size: ${theme.typography.sizes.base};
  opacity: 0.8;
`;

const Spinner = styled.div`
  margin-top: ${theme.spacing[4]};
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.gray.medium};
  border-top-color: ${theme.colors.white};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #f44336;
  color: white;
  padding: ${theme.spacing[4]};
  border-radius: 4px;
  margin-top: ${theme.spacing[4]};
  max-width: 500px;
`;

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Extract tokens and user from URL query parameters
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const userString = searchParams.get('user');

      if (!accessToken || !refreshToken || !userString) {
        setError('Authentication failed - missing credentials');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        return;
      }

      // Parse user data
      const user = JSON.parse(decodeURIComponent(userString));

      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✓ Google OAuth successful, tokens saved');

      // Redirect to home page after a brief moment
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err: any) {
      console.error('Callback error:', err);
      setError('Authentication processing failed');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  }, [searchParams]);

  return (
    <Container>
      <Logo>
        <img src="/images/logo/ot-logo-white.png" alt="Only Thing" />
      </Logo>
      
      {error ? (
        <>
          <Message>✗ Authentication Failed</Message>
          <ErrorMessage>{error}</ErrorMessage>
          <SubMessage>Redirecting to login...</SubMessage>
        </>
      ) : (
        <>
          <Message>✓ Authentication Successful!</Message>
          <SubMessage>Redirecting to your account...</SubMessage>
          <Spinner />
        </>
      )}
    </Container>
  );
}

