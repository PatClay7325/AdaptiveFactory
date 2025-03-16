import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.info('✅ Loaded Environment Variables:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || '⚠️ MISSING',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || '⚠️ MISSING',
    VITE_SUPABASE_SERVICE_ROLE_KEY: env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '⚠️ MISSING',
  });

  return {
    plugins: [
      react({ jsxImportSource: '@emotion/react' }),
      tsconfigPaths({ parseNative: false }),
      svgrPlugin(),
      {
        name: 'custom-hmr-control',
        handleHotUpdate({ file, server }) {
          if (file.includes('src/app/configs/')) {
            server.ws.send({ type: 'full-reload' });
            return [];
          }
        },
      },
    ],
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@emotion')) return 'vendor_emotion';
              if (id.includes('@mui')) return 'vendor_ui';
              if (id.includes('lodash')) return 'vendor_lodash';
              if (id.includes('@supabase')) return 'vendor_supabase'; // Add supabase chunk
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1500,
    },
    server: {
      host: '0.0.0.0',
      open: true,
      strictPort: false,
      port: Number(env.VITE_PORT) || 3000,
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(env.VITE_SUPABASE_SERVICE_ROLE_KEY),
      global: 'window',
    },
    resolve: {
      alias: {
        '@': '/src',
        '@fuse': '/src/@fuse',
        '@history': '/src/@history',
        '@lodash': '/src/@lodash',
        '@mock-api': '/src/@mock-api',
        '@schema': '/src/@schema',
        '@supabase/local': '/src/utils/supabase', // Change alias to avoid conflict
        'app/store': '/src/app/store',
        'app/shared-components': '/src/app/shared-components',
        'app/configs': '/src/app/configs',
        'app/theme-layouts': '/src/app/theme-layouts',
        'app/AppContext': '/src/app/AppContext',
      },
      // Add mainFields to prioritize module formats
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext', 'main'],
    },
    optimizeDeps: {
      include: [
        '@emotion/react',
        '@emotion/styled',
        '@mui/icons-material',
        '@mui/material',
        '@mui/base',
        '@mui/styles',
        '@mui/system',
        '@mui/utils',
        'date-fns',
        'lodash',
        '@supabase/supabase-js', // Include supabase
        '@supabase/postgrest-js', // Include the problematic dependency
      ],
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        // Enable proper CommonJS interop
        format: 'esm',
        target: 'es2020',
        resolveExtensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      },
    },
  };
});