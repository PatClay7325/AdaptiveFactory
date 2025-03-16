// src/pages/admin/api-documentation/page.tsx

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { Typography } from '@mui/material';
import ApiDocContent from './ApiDocContent';

function ApiDocumentationPage() {
  const isMobile = useThemeMediaQuery((theme: any) => theme.breakpoints.down('lg'));

  return (
    <FusePageSimple
      header={
        <div className="p-24 sm:p-32 w-full">
          <Typography variant="h4">API Documentation</Typography>
        </div>
      }
      content={
        <div className="p-24 sm:p-32">
          <ApiDocContent />
        </div>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default ApiDocumentationPage;