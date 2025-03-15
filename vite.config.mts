import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react'
		}),
		tsconfigPaths({
			parseNative: false
		}),
		svgrPlugin(),
		{
			name: 'custom-hmr-control',
			handleHotUpdate({ file, server }) {
				if (file.includes('src/app/configs/')) {
					server.ws.send({
						type: 'full-reload'
					});
					return [];
				}
			}
		}
	],
	build: {
		outDir: 'build',
		sourcemap: true, // ✅ Enables debugging in production
		rollupOptions: {
			output: {
				manualChunks(id) {
					// ✅ Automatically split large modules
					if (id.includes('node_modules')) {
						if (id.includes('@emotion')) return 'vendor_emotion';
						if (id.includes('@mui')) return 'vendor_ui';
						if (id.includes('lodash')) return 'vendor_lodash';
						return 'vendor';
					}
				}
			}
		},
		chunkSizeWarningLimit: 1500 // ✅ Prevent chunk warnings
	},
	server: {
		host: '0.0.0.0',
		open: true,
		strictPort: false,
		port: 3000
	},
	define: {
		'import.meta.env.VITE_PORT': JSON.stringify(process.env.PORT || 3000),
		global: 'window'
	},
	resolve: {
		alias: {
			'@': '/src',
			'@fuse': '/src/@fuse',
			'@history': '/src/@history',
			'@lodash': '/src/@lodash',
			'@mock-api': '/src/@mock-api',
			'@schema': '/src/@schema',
			'app/store': '/src/app/store',
			'app/shared-components': '/src/app/shared-components',
			'app/configs': '/src/app/configs',
			'app/theme-layouts': '/src/app/theme-layouts',
			'app/AppContext': '/src/app/AppContext'
		}
	},
	optimizeDeps: {
		include: [
			'@emotion/react', // ✅ Ensures Emotion is loaded first
			'@emotion/styled',
			'@mui/icons-material',
			'@mui/material',
			'@mui/base',
			'@mui/styles',
			'@mui/system',
			'@mui/utils',
			'date-fns',
			'lodash'
		],
		exclude: [],
		esbuildOptions: {
			loader: {
				'.js': 'jsx'
			}
		}
	}
});
