'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndex.sticky};
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray.light};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
`;

const HeaderInner = styled.div`
  width: 100%;
  padding: ${theme.spacing[1]} ${theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[3]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  
  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.div`
  height: 80px;
  position: relative;
  
  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    height: 60px;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};

  @media (max-width: ${theme.breakpoints.md}) {
    position: fixed;
    top: 73px;
    left: 0;
    right: 0;
    background-color: ${theme.colors.white};
    flex-direction: column;
    padding: ${theme.spacing[2]};
    border-bottom: 1px solid ${theme.colors.gray.light};
    transform: translateY(${props => props.isOpen ? '0' : '-100%'});
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
    align-items: stretch;
    gap: 0;
  }
`;

const NavLink = styled(Link)`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  transition: opacity ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
  
  &:hover {
    opacity: 0.6;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[2]};
    border-bottom: 1px solid ${theme.colors.gray.light};
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${theme.colors.black};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
  position: relative;
  
  &:hover {
    transform: scale(${theme.interactions.scale.hover});
  }
  
  &:active {
    transform: scale(${theme.interactions.scale.press});
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
  border-radius: ${theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

const MenuLine = styled.span<{ isOpen: boolean }>`
  width: 24px;
  height: 2px;
  background-color: ${theme.colors.black};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
  
  &:nth-of-type(1) {
    transform: ${props => props.isOpen ? 'rotate(45deg) translateY(8px)' : 'none'};
  }
  
  &:nth-of-type(2) {
    opacity: ${props => props.isOpen ? '0' : '1'};
  }
  
  &:nth-of-type(3) {
    transform: ${props => props.isOpen ? 'rotate(-45deg) translateY(-8px)' : 'none'};
  }
`;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCartStore();
  const { isAuthenticated, user } = useAuth();
  const cartItemCount = totalItems();

  return (
    <HeaderContainer>
      <HeaderInner>
        <Logo href="/" aria-label="Only Thing Health & Wellness - Home">
          <LogoImage>
            <img src="/images/logo/ot-logo.jpg" alt="Only Thing" />
          </LogoImage>
        </Logo>

        <Nav isOpen={mobileMenuOpen}>
          <NavLink href="/products" onClick={() => setMobileMenuOpen(false)}>
            Shop
          </NavLink>
          <NavLink href="/quiz" onClick={() => setMobileMenuOpen(false)}>
            Quiz
          </NavLink>
          <NavLink href="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>
          <NavLink href="/science" onClick={() => setMobileMenuOpen(false)}>
            Science
          </NavLink>
          <NavLink href="/faq" onClick={() => setMobileMenuOpen(false)}>
            FAQ
          </NavLink>
          <NavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </NavLink>
        </Nav>

        <Actions>
          <IconButton aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </IconButton>
          
          <Link href={isAuthenticated ? "/account" : "/login"} aria-label={isAuthenticated ? "My Account" : "Login"}>
            <IconButton as="span">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </IconButton>
          </Link>
          
          <Link href="/cart" aria-label={`Cart with ${cartItemCount} items`}>
          <IconButton as="span">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
          </IconButton>
          </Link>

          <MobileMenuButton 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <MenuLine isOpen={mobileMenuOpen} />
            <MenuLine isOpen={mobileMenuOpen} />
            <MenuLine isOpen={mobileMenuOpen} />
          </MobileMenuButton>
        </Actions>
      </HeaderInner>
    </HeaderContainer>
  );
}
