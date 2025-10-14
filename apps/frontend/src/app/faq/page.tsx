'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Accordion } from '@/components/ui/Accordion';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.xl}) {
    max-width: 1200px;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 900px;
    padding: ${theme.spacing[8]} ${theme.spacing[3]};
  }
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

const CategoryTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.black};
  margin: ${theme.spacing[6]} 0 ${theme.spacing[3]} 0;
  text-transform: uppercase;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FAQItem = styled.div<{ isOpen: boolean }>`
  border: 1px solid ${theme.colors.gray.light};
  overflow: hidden;
  transition: all ${theme.transitions.duration.base};
`;

const FAQQuestion = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]};
  background-color: ${props => props.isOpen ? theme.colors.gray.light : theme.colors.white};
  border: none;
  text-align: left;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color ${theme.transitions.duration.base};

  &:hover {
    background-color: ${theme.colors.gray.light};
  }
`;

const FAQIcon = styled.span<{ isOpen: boolean }>`
  font-size: ${theme.typography.sizes.xl};
  transition: transform ${theme.transitions.duration.base};
  transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height ${theme.transitions.duration.base};
`;

const FAQContent = styled.div`
  padding: ${theme.spacing[3]};
  font-size: ${theme.typography.sizes.base};
  line-height: 1.8;
  color: ${theme.colors.gray.dark};
`;

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  questions: FAQ[];
}

export default function FAQPage() {

  const faqData: FAQCategory[] = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'We offer free standard shipping on all orders over $50, which typically takes 5-7 business days. Expedited shipping options are available at checkout for faster delivery (2-3 business days).'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes! We currently ship to most countries worldwide. International shipping times vary by location but typically take 10-15 business days. Customs fees may apply depending on your country.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.'
        },
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day money-back guarantee on all products. If you\'re not satisfied with your purchase, contact our customer service team to initiate a return. Products must be unopened for a full refund.'
        }
      ]
    },
    {
      category: 'Products & Usage',
      questions: [
        {
          question: 'Are your products FDA approved?',
          answer: 'Dietary supplements are not required to be FDA approved. However, our products are manufactured in FDA-registered facilities that follow Good Manufacturing Practices (GMP). All our formulations are third-party tested for purity and potency.'
        },
        {
          question: 'Can I take multiple supplements together?',
          answer: 'Many of our supplements can be taken together safely. However, we recommend consulting with a healthcare professional before combining multiple supplements, especially if you have existing health conditions or take prescription medications.'
        },
        {
          question: 'How long does it take to see results?',
          answer: 'Results vary by product and individual. Some supplements like energy boosters may show effects within hours, while others like hair growth or cognitive enhancement may take 4-8 weeks of consistent use to show noticeable results.'
        },
        {
          question: 'Are your products vegan/vegetarian?',
          answer: 'Many of our products are vegan or vegetarian. We clearly label this information on each product page. Check the product details or contact us if you have specific dietary requirements.'
        },
        {
          question: 'Do your products contain allergens?',
          answer: 'We list all potential allergens on our product labels. Our products are manufactured in facilities that may process common allergens like nuts, soy, and gluten. Always check the label if you have specific allergies.'
        }
      ]
    },
    {
      category: 'Ingredients & Quality',
      questions: [
        {
          question: 'Where do you source your ingredients?',
          answer: 'We source premium ingredients from trusted suppliers worldwide. All ingredients undergo rigorous testing for purity, potency, and safety before being used in our products. We prioritize sustainable and ethical sourcing practices.'
        },
        {
          question: 'Are your products tested by third parties?',
          answer: 'Yes! Every batch of our products is third-party tested for quality, purity, and potency. We provide certificates of analysis upon request to ensure complete transparency.'
        },
        {
          question: 'Do you use any artificial ingredients?',
          answer: 'No. We avoid artificial colors, flavors, and preservatives. Our commitment is to provide clean, natural formulations backed by science.'
        }
      ]
    },
    {
      category: 'Account & Subscriptions',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account during checkout or by clicking the "Sign Up" button in the header. Having an account allows you to track orders, save your favorite products, and manage subscriptions.'
        },
        {
          question: 'Do you offer subscriptions?',
          answer: 'Yes! We offer subscription plans that save you 15% on every order. You can choose delivery frequency (monthly, bi-monthly, or quarterly) and cancel or modify your subscription anytime.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can manage your subscription from your account dashboard. Simply log in, go to "Subscriptions," and click "Cancel" on the subscription you wish to end. You can also contact our support team for assistance.'
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      <PageContainer>
        <ContentContainer>
          <PageTitle>Frequently Asked Questions</PageTitle>
          <PageSubtitle>
            Find answers to common questions about our products, shipping, and more
          </PageSubtitle>

          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <CategoryTitle>{category.category}</CategoryTitle>
              <Accordion
                items={category.questions.map((faq, idx) => ({
                  id: `${categoryIndex}-${idx}`,
                  title: faq.question,
                  content: faq.answer,
                }))}
                allowMultiple={true}
              />
            </div>
          ))}
        </ContentContainer>
      </PageContainer>
      <Footer />
    </>
  );
}

