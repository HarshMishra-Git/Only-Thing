'use client';

import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import { ReactNode } from 'react';

const PageContainer = styled.main`
  min-height: 80vh;
  padding: ${theme.spacing[16]} ${theme.spacing[3]} ${theme.spacing[8]};
  background: ${theme.colors.white};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[3]} ${theme.spacing[6]};
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.xl}) {
    max-width: 1200px;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 900px;
  }
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 4vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.black};
  text-align: center;
`;

const Content = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.8;
  color: ${theme.colors.gray.dark};
  
  h2 {
    font-family: ${theme.typography.fonts.display};
    font-size: ${theme.typography.sizes['2xl']};
    font-weight: ${theme.typography.weights.bold};
    margin-top: ${theme.spacing[8]};
    margin-bottom: ${theme.spacing[4]};
    color: ${theme.colors.black};
    text-transform: uppercase;
  }
  
  h3 {
    font-family: ${theme.typography.fonts.display};
    font-size: ${theme.typography.sizes.xl};
    font-weight: ${theme.typography.weights.bold};
    margin-top: ${theme.spacing[6]};
    margin-bottom: ${theme.spacing[3]};
    color: ${theme.colors.black};
  }
  
  p {
    margin-bottom: ${theme.spacing[4]};
  }
  
  ul, ol {
    margin-bottom: ${theme.spacing[4]};
    padding-left: ${theme.spacing[6]};
    
    li {
      margin-bottom: ${theme.spacing[2]};
    }
  }
  
  strong {
    font-weight: ${theme.typography.weights.bold};
    color: ${theme.colors.black};
  }
  
  a {
    color: ${theme.colors.black};
    text-decoration: underline;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

interface ContentPageProps {
  title: string;
  children: ReactNode;
}

export function ContentPage({ title, children }: ContentPageProps) {
  return (
    <PageContainer>
      <Container>
        <PageTitle>{title}</PageTitle>
        <Content>{children}</Content>
      </Container>
    </PageContainer>
  );
}
