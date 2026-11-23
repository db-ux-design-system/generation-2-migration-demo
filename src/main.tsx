import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Generation 3: foundations and component styles with the whitelabel theme ...
import '@db-ux/core-components/build/styles/bundle.css';
// ... overwritten by the DB Theme (fonts, icons, colors of the DB brand).
import '@db-ux/db-theme/build/styles/rollup.css';
import './styles.css';
import { App } from './App';

const root = document.querySelector('#root');
if (!root) {
	throw new Error('Root element #root is missing in index.html');
}

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
