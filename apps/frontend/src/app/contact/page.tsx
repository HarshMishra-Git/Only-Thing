'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[3]};
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[2]};
  text-align: center;
  text-transform: uppercase;
`;

const PageSubtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div``;

const InfoSection = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const InfoTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: ${theme.spacing[3]};
`;

const InfoIcon = styled.div`
  font-size: ${theme.typography.sizes['2xl']};
  margin-right: ${theme.spacing[2]};
`;

const InfoContent = styled.div``;

const InfoLabel = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  margin-bottom: ${theme.spacing[1]};
`;

const InfoText = styled.div`
  color: ${theme.colors.gray.dark};
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: ${theme.typography.weights.semibold};
  margin-bottom: ${theme.spacing[1]};
`;

const Input = styled.input`
  padding: ${theme.spacing[2]};
  border: 1px solid ${theme.colors.gray.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.black};
  }
`;

const TextArea = styled.textarea`
  padding: ${theme.spacing[2]};
  border: 1px solid ${theme.colors.gray.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.black};
  }
`;

const SubmitButton = styled.button`
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
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    background-color: ${theme.colors.gray.dark};
  }

  &:disabled {
    background-color: ${theme.colors.gray.light};
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  padding: ${theme.spacing[3]};
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing[3]};
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  return (
    <>
      <Header />
      <PageContainer>
        <ContentContainer>
          <PageTitle>Contact Us</PageTitle>
          <PageSubtitle>
            We're here to help! Reach out with any questions or concerns
          </PageSubtitle>

          <ContentGrid>
            <ContactInfo>
              <InfoSection>
                <InfoTitle>Get In Touch</InfoTitle>
                
                <InfoItem>
                  <InfoIcon>📧</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Email</InfoLabel>
                    <InfoText>support@onlything.com</InfoText>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>📞</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoText>1-800-ONLY-THING</InfoText>
                    <InfoText style={{ fontSize: theme.typography.sizes.sm }}>
                      Monday - Friday, 9am - 6pm EST
                    </InfoText>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>📍</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Address</InfoLabel>
                    <InfoText>123 Wellness Avenue</InfoText>
                    <InfoText>Suite 400</InfoText>
                    <InfoText>New York, NY 10001</InfoText>
                  </InfoContent>
                </InfoItem>
              </InfoSection>

              <InfoSection>
                <InfoTitle>Business Hours</InfoTitle>
                <InfoItem>
                  <InfoIcon>🕐</InfoIcon>
                  <InfoContent>
                    <InfoText>Monday - Friday: 9:00 AM - 6:00 PM EST</InfoText>
                    <InfoText>Saturday: 10:00 AM - 4:00 PM EST</InfoText>
                    <InfoText>Sunday: Closed</InfoText>
                  </InfoContent>
                </InfoItem>
              </InfoSection>

              <InfoSection>
                <InfoTitle>Follow Us</InfoTitle>
                <InfoItem>
                  <InfoIcon>📱</InfoIcon>
                  <InfoContent>
                    <InfoText>@onlythingwellness on all platforms</InfoText>
                  </InfoContent>
                </InfoItem>
              </InfoSection>
            </ContactInfo>

            <div>
              <InfoTitle>Send Us A Message</InfoTitle>
              
              {submitStatus === 'success' && (
                <SuccessMessage>
                  Thank you for your message! We'll get back to you within 24 hours.
                </SuccessMessage>
              )}
              
              {submitStatus === 'error' && (
                <ErrorMessage>
                  Oops! Something went wrong. Please try again or email us directly.
                </ErrorMessage>
              )}

              <ContactForm onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Message *</Label>
                  <TextArea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </SubmitButton>
              </ContactForm>
            </div>
          </ContentGrid>
        </ContentContainer>
      </PageContainer>
      <Footer />
    </>
  );
}

