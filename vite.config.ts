import * as path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// The DB Theme CSS references fonts and icons as `@db-ux/...` module paths.
			// Without this alias Vite leaves them unresolved and the browser gets a 404.
			'@db-ux': path.resolve('node_modules/@db-ux')
		}
	}
});
