'use client';

import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import Link from 'next/link';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const HeroSection = styled.div`
  background-color: ${theme.colors.black};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.white};
  position: relative;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: ${theme.spacing[8]};
  
  img {
    max-width: 300px;
    width: 100%;
    height: auto;
  }
`;

const HeroTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: 3rem;
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing[4]};
  letter-spacing: 2px;
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: 2.5rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 500px;
  line-height: 1.8;
  opacity: 0.9;
`;

const FormSection = styled.div`
  background: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  overflow-y: auto;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 550px;
  padding: ${theme.spacing[8]} ${theme.spacing[10]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]} ${theme.spacing[4]};
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing[1]};
  text-align: center;
  color: ${theme.colors.black};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
  font-size: ${theme.typography.sizes.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const Label = styled.label`
  font-weight: ${theme.typography.weights.semibold};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.black};
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid ${theme.colors.gray.light};
  font-size: ${theme.typography.sizes.sm};
  transition: all ${theme.transitions.duration.fast};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.black};
  }
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing[2]};
  background-color: #fee;
  color: #c00;
  font-size: ${theme.typography.sizes.xs};
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  cursor: pointer;
  transition: all ${theme.transitions.duration.base};
  margin-top: ${theme.spacing[1]};
  
  &:hover {
    background-color: ${theme.colors.gray.dark};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: ${theme.colors.gray.medium};
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${theme.spacing[3]} 0;
  color: ${theme.colors.gray.dark};
  font-size: ${theme.typography.sizes.xs};
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${theme.colors.gray.light};
  }
  
  &::before {
    margin-right: ${theme.spacing[2]};
  }
  
  &::after {
    margin-left: ${theme.spacing[2]};
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  border: 1px solid ${theme.colors.gray.light};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  
  &:hover {
    background-color: ${theme.colors.gray.light};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: ${theme.spacing[3]};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.dark};
  
  a {
    color: ${theme.colors.black};
    text-decoration: underline;
    font-weight: ${theme.typography.weights.semibold};
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Simply trigger the redirect - no async needed
    loginWithGoogle();
  };

  return (
    <>
      <Header />
      <PageContainer>
        <HeroSection>
          <LogoContainer>
            <img src="/images/logo/ot-logo-white.png" alt="Only Thing" />
          </LogoContainer>
          <HeroTitle>Join Only Thing</HeroTitle>
          <HeroText>
            Create your account and unlock personalized skincare recommendations, 
            exclusive offers, and track your journey to healthier skin.
          </HeroText>
        </HeroSection>
        
        <FormSection>
          <FormCard>
          <Title>Sign Up</Title>
          <Subtitle>Create your account to get started.</Subtitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </SubmitButton>
          </Form>

          <Divider>OR</Divider>
          
          <GoogleButton type="button" onClick={handleGoogleSignup} disabled={isLoading}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.96H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.04l3.007-2.333z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.462.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </GoogleButton>

          <LoginLink>
            Already have an account? <Link href="/login">Sign in</Link>
          </LoginLink>
        </FormCard>
        </FormSection>
      </PageContainer>
      <Footer />
    </>
  );
}
