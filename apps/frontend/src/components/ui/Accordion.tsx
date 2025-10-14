'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@only-thing/design-tokens';

const AccordionContainer = styled.div`
  width: 100%;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid ${theme.colors.gray.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AccordionButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: ${theme.spacing[4]} 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const AccordionTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin: 0;
`;

const AccordionIcon = styled(motion.svg)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-left: ${theme.spacing[2]};
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
`;

const AccordionText = styled.div`
  padding: 0 0 ${theme.spacing[4]} 0;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  line-height: 1.6;
  color: ${theme.colors.gray.dark};
`;

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AccordionContainer>
      {items.map(item => {
        const isOpen = openItems.has(item.id);
        
        return (
          <AccordionItem key={item.id}>
            <AccordionButton
              onClick={() => toggleItem(item.id)}
              isOpen={isOpen}
              aria-expanded={isOpen}
            >
              <AccordionTitle>{item.title}</AccordionTitle>
              <AccordionIcon
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 9l-7 7-7-7" />
              </AccordionIcon>
            </AccordionButton>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <AccordionContent
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <AccordionText>{item.content}</AccordionText>
                </AccordionContent>
              )}
            </AnimatePresence>
          </AccordionItem>
        );
      })}
    </AccordionContainer>
  );
}
