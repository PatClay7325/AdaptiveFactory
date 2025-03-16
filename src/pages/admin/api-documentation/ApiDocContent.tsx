// src/pages/admin/api-documentation/ApiDocContent.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Grid, Paper, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { apiDocumentation } from './apiDocumentation';
import TableOfContents from './TableOfContents';
import './apiDocumentation.css';

// Define proper types for ReactMarkdown components
type ComponentProps = {
  children?: React.ReactNode;
  className?: string;
  node?: any;
  [key: string]: any;
};

type CodeProps = ComponentProps & {
  inline?: boolean;
};

interface HeadingInfo {
  id: string;
  element: HTMLElement | null;
  level: number;
  text: string;
}

function ApiDocContent() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);
  
  // Parse headings directly from the markdown content
  useEffect(() => {
    // Regular expression to match markdown headings
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings: HeadingInfo[] = [];
    let match;
    
    // Reset regex lastIndex
    headingRegex.lastIndex = 0;
    
    while ((match = headingRegex.exec(apiDocumentation)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
      
      extractedHeadings.push({
        id,
        element: null, // Will be populated after rendering
        level,
        text
      });
    }
    
    setHeadings(extractedHeadings);
    console.log('Extracted headings from markdown:', extractedHeadings);
  }, []);
  
  // After rendering, find the actual heading elements in the DOM
  useEffect(() => {
    if (contentRef.current && headings.length > 0) {
      const updatedHeadings = [...headings];
      
      // Find each heading in the DOM
      updatedHeadings.forEach((heading, index) => {
        const elements = contentRef.current?.querySelectorAll(`h${heading.level}`);
        if (elements) {
          // Find the element with matching text
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.textContent?.trim() === heading.text) {
              // Set an ID on the element for scrolling
              element.id = heading.id;
              // Update the heading with the element reference
              updatedHeadings[index] = {
                ...heading,
                element: element as HTMLElement
              };
              break;
            }
          }
        }
      });
      
      setHeadings(updatedHeadings);
      console.log('Found DOM elements for headings:', updatedHeadings.filter(h => h.element !== null).length);
    }
  }, [contentRef.current, headings.length]);
  
  // Handle TOC item clicks
  const scrollToHeading = (id: string) => {
    console.log('Trying to scroll to heading with ID:', id);
    const heading = headings.find(h => h.id === id);
    
    if (heading && heading.element) {
      console.log('Found heading, scrolling to:', heading.text);
      heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log('Heading not found with ID:', id);
    }
  };
  
  // Handle clicks on in-document links
  useEffect(() => {
    const handleAnchorClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if it's an anchor tag or a child of an anchor tag
      const anchor = target.tagName === 'A' 
        ? target 
        : target.closest('a');
        
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        console.log('Anchor clicked:', anchor.getAttribute('href'));
        event.preventDefault();
        
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetText = decodeURIComponent(href.substring(1))
            .replace(/-/g, ' ')
            .toLowerCase();
          
          console.log('Looking for heading with text similar to:', targetText);
          
          // Search for an exact ID match first
          let heading = headings.find(h => h.id === `heading-${targetText}`);
          
          // If no exact match, try to find a heading with similar text
          if (!heading) {
            heading = headings.find(h => 
              h.text.toLowerCase().includes(targetText) ||
              targetText.includes(h.text.toLowerCase())
            );
          }
          
          if (heading && heading.element) {
            console.log('Found match:', heading.text);
            heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.log('No matching heading found for link:', targetText);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [headings]);
  
  return (
    <Grid container spacing={3}>
      {/* Left sidebar for table of contents */}
      <Grid item xs={12} md={3}>
        <Paper className="sticky top-16" sx={{ p: 2, maxHeight: 'calc(100vh - 160px)', overflow: 'auto' }}>
          <TableOfContents 
            headings={headings}
            onItemClick={scrollToHeading} 
          />
        </Paper>
      </Grid>
      
      {/* Main content area */}
      <Grid item xs={12} md={9}>
        <Paper sx={{ p: 3 }} ref={contentRef}>
          <div className="markdown-container">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1: (props: ComponentProps) => <h1 {...props} />,
                h2: (props: ComponentProps) => <h2 {...props} />,
                h3: (props: ComponentProps) => <h3 {...props} />,
                h4: (props: ComponentProps) => <h4 {...props} />,
                h5: (props: ComponentProps) => <h5 {...props} />,
                h6: (props: ComponentProps) => <h6 {...props} />,
                code: ({ node, inline, className, children, ...props }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <Box className="my-16 rounded-8 overflow-hidden">
                      <pre className={`${className} p-16 overflow-auto`}>
                        <code {...props}>{children}</code>
                      </pre>
                    </Box>
                  ) : (
                    <code className="px-4 py-2 rounded-4 bg-grey-100 text-sm" {...props}>{children}</code>
                  );
                },
                table: (props: ComponentProps) => <table className="border-collapse my-16 w-full" {...props} />,
                th: (props: ComponentProps) => <th className="p-12 bg-grey-100 border text-left" {...props} />,
                td: (props: ComponentProps) => <td className="p-12 border" {...props} />,
              }}
            >
              {apiDocumentation}
            </ReactMarkdown>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ApiDocContent;