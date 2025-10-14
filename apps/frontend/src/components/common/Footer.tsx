'use client';

import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import Link from 'next/link';
import { useState } from 'react';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  padding: ${theme.spacing[6]} ${theme.spacing[3]} ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray.dark};
`;

const FooterInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
`;

const FooterLink = styled(Link)`
  display: block;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.medium};
  margin-bottom: ${theme.spacing[0]};
  line-height: 1.8;
  transition: color ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
  
  &:hover {
    color: ${theme.colors.white};
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: ${theme.spacing[1]};
  margin-top: ${theme.spacing[1]};
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.medium};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.black};
  
  &:focus {
    outline: 2px solid ${theme.colors.white};
    outline-offset: 2px;
  }
`;

const NewsletterButton = styled.button`
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  border: none;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  cursor: pointer;
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
  
  &:hover {
    background-color: ${theme.colors.gray.light};
    transform: scale(${theme.interactions.scale.hover});
  }
  
  &:active {
    transform: scale(${theme.interactions.scale.press});
  }
`;

const FooterBottom = styled.div`
  padding-top: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray.dark};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
`;

const Copyright = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.medium};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.gray.dark};
  color: ${theme.colors.white};
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
  
  &:hover {
    border-color: ${theme.colors.white};
    transform: scale(${theme.interactions.scale.hover});
  }
`;

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic will go here
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <FooterContainer>
      <FooterInner>
        <FooterGrid>
          <FooterColumn>
            <ColumnTitle>Only Thing</ColumnTitle>
            <h3 style={{ 
              fontSize: theme.typography.sizes.lg, 
              color: theme.colors.white,
              fontFamily: theme.typography.fonts.display,
              fontWeight: theme.typography.weights.bold,
              letterSpacing: theme.typography.letterSpacing.wide,
              textTransform: 'uppercase',
              marginBottom: theme.spacing[2]
            }}>
              ONLY THING
            </h3>
            <p style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.gray.medium, marginBottom: theme.spacing[2], lineHeight: '1.5' }}>
              Only Thing Health & Wellness LLP delivers clinical-grade skincare backed by science. 
              Our formulations combine dermatological expertise with cutting-edge biochemistry for 
              measurable, intelligent results.
            </p>
            <div style={{ 
              marginTop: theme.spacing[1], 
              backgroundColor: theme.colors.white, 
              padding: theme.spacing[1], 
              display: 'inline-block',
              borderRadius: '4px'
            }}>
              <img src="/images/logo/ot-logo.jpg" alt="Only Thing" style={{ height: '50px', width: 'auto', display: 'block' }} />
            </div>
          </FooterColumn>
          <FooterColumn>
            <ColumnTitle>Shop</ColumnTitle>
            <FooterLink href="/products">All Products</FooterLink>
            <FooterLink href="/products?category=serums">Serums</FooterLink>
            <FooterLink href="/products?category=moisturizers">Moisturizers</FooterLink>
            <FooterLink href="/products?category=cleansers">Cleansers</FooterLink>
            <FooterLink href="/products?category=treatments">Treatments</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Learn</ColumnTitle>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/science">The Science</FooterLink>
            <FooterLink href="/ingredients">Ingredients</FooterLink>
            <FooterLink href="/quiz">Skin Assessment</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Support</ColumnTitle>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/shipping">Shipping</FooterLink>
            <FooterLink href="/returns">Returns</FooterLink>
            <FooterLink href="/account">My Account</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Newsletter</ColumnTitle>
            <p style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.gray.medium, marginBottom: theme.spacing[1], lineHeight: '1.5' }}>
              Get updates on new products and exclusive offers.
            </p>
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={subscribed}
              />
              <NewsletterButton type="submit" disabled={subscribed}>
                {subscribed ? '✓' : 'Join'}
              </NewsletterButton>
            </NewsletterForm>
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} Only Thing Health & Wellness LLP. All rights reserved.
          </Copyright>
          
          <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
            <FooterLink href="/privacy-policy" style={{ fontSize: theme.typography.sizes.sm }}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms-of-service" style={{ fontSize: theme.typography.sizes.sm }}>
              Terms of Service
            </FooterLink>
          </div>

          <SocialLinks>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </SocialLink>
          </SocialLinks>
        </FooterBottom>
      </FooterInner>
    </FooterContainer>
  );
}
