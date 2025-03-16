// src/pages/admin/api-documentation/TableOfContents.tsx

import React from 'react';
import { Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export interface HeadingInfo {
  id: string;
  element: HTMLElement | null;
  level: number;
  text: string;
}

export interface TableOfContentsProps {
  headings: HeadingInfo[];
  onItemClick: (id: string) => void;
}

function TableOfContents({ headings, onItemClick }: TableOfContentsProps) {
  // Only include headings up to level 3 in TOC
  const tocHeadings = headings.filter(h => h.level <= 3);
  
  return (
    <div>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Contents
      </Typography>
      {tocHeadings.length > 0 ? (
        <List dense sx={{ pl: 0 }}>
          {tocHeadings.map((heading) => (
            <ListItem 
              key={heading.id} 
              disablePadding
              sx={{ pl: (heading.level - 1) * 2 }}
            >
              <ListItemButton
                onClick={() => onItemClick(heading.id)}
                sx={{ 
                  borderRadius: 1,
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemText 
                  primary={heading.text} 
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: {
                      fontWeight: heading.level === 1 ? 'bold' : 'normal',
                      fontSize: heading.level === 3 ? '0.8rem' : undefined
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Loading contents...
        </Typography>
      )}
    </div>
  );
}

export default TableOfContents;