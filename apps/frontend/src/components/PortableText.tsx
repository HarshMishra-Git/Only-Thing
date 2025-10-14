import React from 'react';
import { PortableText as BasePortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanity';
import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';

const ContentContainer = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${theme.colors.gray.dark};

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin: 2rem 0 1rem;
    line-height: 1.3;
    color: ${theme.colors.black};
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }

  p {
    margin: 1.5rem 0;
  }

  a {
    color: ${theme.colors.black};
    text-decoration: underline;
    transition: color 0.2s;

    &:hover {
      color: ${theme.colors.gray.dark};
    }
  }

  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  li {
    margin: 0.5rem 0;
  }

  blockquote {
    margin: 2rem 0;
    padding: 1.5rem 2rem;
    border-left: 4px solid ${theme.colors.black};
    background: ${theme.colors.gray.light};
    font-style: italic;
    font-size: 1.25rem;
  }

  code {
    background: ${theme.colors.gray.light};
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${theme.colors.gray.dark};
    color: ${theme.colors.white};
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;

    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 2px solid ${theme.colors.gray.light};
    margin: 3rem 0;
  }
`;

const ImageWrapper = styled.figure`
  margin: 2rem 0;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  figcaption {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: ${theme.colors.gray.medium};
    text-align: center;
    font-style: italic;
  }
`;

const YouTubeWrapper = styled.div`
  margin: 2rem 0;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
  }
`;

interface PortableTextProps {
  value: any;
}

const components = {
  types: {
    imageWithAlt: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }

      const imageUrl = urlFor(value).width(1200).quality(90).url();

      return (
        <ImageWrapper>
          <img
            src={imageUrl}
            alt={value.alt || ''}
            loading="lazy"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </ImageWrapper>
      );
    },
    youtube: ({ value }: any) => {
      if (!value?.url) {
        return null;
      }

      // Extract YouTube ID from URL
      const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      };

      const videoId = getYouTubeId(value.url);

      if (!videoId) {
        return null;
      }

      return (
        <YouTubeWrapper>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </YouTubeWrapper>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = value?.blank ? '_blank' : '_self';
      const rel = value?.blank ? 'noopener noreferrer' : undefined;
      return (
        <a href={value?.href} target={target} rel={rel}>
          {children}
        </a>
      );
    },
    code: ({ children }: any) => <code>{children}</code>,
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    underline: ({ children }: any) => <u>{children}</u>,
    'strike-through': ({ children }: any) => <s>{children}</s>,
  },
  block: {
    h1: ({ children }: any) => <h1>{children}</h1>,
    h2: ({ children }: any) => <h2>{children}</h2>,
    h3: ({ children }: any) => <h3>{children}</h3>,
    h4: ({ children }: any) => <h4>{children}</h4>,
    blockquote: ({ children }: any) => <blockquote>{children}</blockquote>,
    normal: ({ children }: any) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul>{children}</ul>,
    number: ({ children }: any) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

export const PortableTextContent: React.FC<PortableTextProps> = ({ value }) => {
  if (!value) {
    return null;
  }

  return (
    <ContentContainer>
      <BasePortableText value={value} components={components} />
    </ContentContainer>
  );
};

export default PortableTextContent;
