import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Generation 2 CSS framework: fonts, icons, color tokens and all elm-*, cmp-*, rea-* classes.
import '@db-ui/core/dist/css/enterprise/db-ui-core.css';
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
