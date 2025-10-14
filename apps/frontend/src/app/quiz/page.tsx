'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { quizQuestions, calculateRecommendations } from '@/lib/quizData';
import { mockProducts, formatPrice } from '@/lib/mockData';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
  background-color: ${theme.colors.gray.light};
`;

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[3]};
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[6]};
  border-radius: ${theme.radii.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: ${theme.colors.black};
  width: ${props => props.progress}%;
  transition: width ${theme.transitions.duration.base} ${theme.transitions.easing.out};
`;

const QuestionCard = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.lg};
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const QuestionNumber = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  margin-bottom: ${theme.spacing[2]};
`;

const QuestionText = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[4]};
  flex: 0;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  flex: 1;
`;

const OptionButton = styled.button<{ selected: boolean }>`
  padding: ${theme.spacing[3]};
  background-color: ${props => props.selected ? theme.colors.black : theme.colors.white};
  color: ${props => props.selected ? theme.colors.white : theme.colors.black};
  border: 2px solid ${props => props.selected ? theme.colors.black : theme.colors.gray.light};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  text-align: left;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
  
  &:hover {
    border-color: ${theme.colors.black};
    transform: translateX(4px);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing[4]};
`;

const NavButton = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  border: 2px solid ${theme.colors.black};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  cursor: pointer;
  transition: all ${theme.transitions.duration.base};
  
  &:hover:not(:disabled) {
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.lg};
`;

const ResultsTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.black};
  text-align: center;
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
`;

const ResultsSubtitle = styled.p`
  text-align: center;
  color: ${theme.colors.gray.dark};
  font-size: ${theme.typography.sizes.lg};
  margin-bottom: ${theme.spacing[6]};
`;

const RecommendationsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const RecommendationCard = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: ${theme.spacing[3]};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.div`
  width: 120px;
  height: 120px;
  background-color: ${theme.colors.gray.light};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.sizes['3xl']};
`;

const ProductInfo = styled.div``;

const ProductName = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[1]};
`;

const ProductPrice = styled.p`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  margin-bottom: ${theme.spacing[2]};
`;

const RecommendationReason = styled.p`
  color: ${theme.colors.gray.dark};
  font-size: ${theme.typography.sizes.base};
  margin-bottom: ${theme.spacing[2]};
  padding: ${theme.spacing[2]};
  background-color: ${theme.colors.gray.light};
  border-left: 3px solid ${theme.colors.black};
`;

const ViewProductButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    background-color: ${theme.colors.gray.dark};
    transform: scale(${theme.interactions.scale.hover});
  }
`;

const RestartButton = styled.button`
  width: 100%;
  padding: ${theme.spacing[3]};
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  border: 2px solid ${theme.colors.black};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  cursor: pointer;
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
  }
`;

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentStep === quizQuestions.length - 1;

  const handleAnswer = (questionId: string, value: string) => {
    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [questionId]: value });
    } else {
      const currentAnswers = (answers[questionId] as string[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [questionId]: newAnswers });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion?.id];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  if (showResults) {
    const recommendations = calculateRecommendations(answers);
    const recommendedProducts = recommendations
      .map(rec => {
        const product = mockProducts.find(p => p.id === rec.productId);
        return product ? { product, reason: rec.reason } : null;
      })
      .filter(Boolean);

    return (
      <>
        <Header />
        <PageContainer>
          <QuizContainer>
            <ResultsContainer>
              <ResultsTitle>Your Personalized Routine</ResultsTitle>
              <ResultsSubtitle>
                Based on your answers, we recommend these products for your skin
              </ResultsSubtitle>

              <RecommendationsGrid>
                {recommendedProducts.map((rec, index) => rec && (
                  <RecommendationCard key={index}>
                    <ProductImage>📦</ProductImage>
                    <ProductInfo>
                      <ProductName>{rec.product.name}</ProductName>
                      <ProductPrice>{formatPrice(rec.product.price, rec.product.currency)}</ProductPrice>
                      <RecommendationReason>
                        <strong>Why we recommend this:</strong><br />
                        {rec.reason}
                      </RecommendationReason>
                      <ViewProductButton href={`/products/${rec.product.slug}`}>
                        View Product →
                      </ViewProductButton>
                    </ProductInfo>
                  </RecommendationCard>
                ))}
              </RecommendationsGrid>

              <RestartButton onClick={handleRestart}>
                Take Quiz Again
              </RestartButton>
            </ResultsContainer>
          </QuizContainer>
        </PageContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <QuizContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>

          <QuestionCard>
            <QuestionNumber>
              Question {currentStep + 1} of {quizQuestions.length}
            </QuestionNumber>
            
            <QuestionText>{currentQuestion.question}</QuestionText>

            <OptionsContainer>
              {currentQuestion.options.map(option => {
                const answer = answers[currentQuestion.id];
                const isSelected = Array.isArray(answer)
                  ? answer.includes(option.value)
                  : answer === option.value;

                return (
                  <OptionButton
                    key={option.value}
                    selected={isSelected}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  >
                    {option.label}
                  </OptionButton>
                );
              })}
            </OptionsContainer>

            <NavigationButtons>
              <NavButton onClick={handleBack} disabled={currentStep === 0}>
                ← Back
              </NavButton>
              <NavButton onClick={handleNext} disabled={!isAnswered()}>
                {isLastQuestion ? 'See Results' : 'Next →'}
              </NavButton>
            </NavigationButtons>
          </QuestionCard>
        </QuizContainer>
      </PageContainer>
      <Footer />
    </>
  );
}
