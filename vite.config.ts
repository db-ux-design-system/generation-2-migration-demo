import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		// @db-ui/core 3.3.7 ships an invalid selector (`:after:after`) that the
		// Lightning CSS minifier rejects. Generation 2 only - drop this after the migration.
		cssMinify: false
	}
});
