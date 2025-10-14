'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '@only-thing/design-tokens';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${theme.colors.gray.light} 0%,
    #f0f0f0 50%,
    ${theme.colors.gray.light} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${theme.radii.sm};
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string }>`
  height: 1em;
  width: ${props => props.width || '100%'};
  margin-bottom: ${theme.spacing[2]};
`;

export const SkeletonTitle = styled(SkeletonBase)<{ width?: string }>`
  height: 2em;
  width: ${props => props.width || '60%'};
  margin-bottom: ${theme.spacing[3]};
`;

export const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
`;

export const SkeletonCard = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[3]};
`;

export function ProductCardSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonImage />
      <SkeletonText width="40%" style={{ marginTop: theme.spacing[2] }} />
      <SkeletonTitle width="80%" />
      <SkeletonText width="100%" />
      <SkeletonText width="30%" />
    </SkeletonCard>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
