const STYLE_ID = 'nulisaja-plugin-styles';

const STYLES = `
	/* Ribbon Icon Styling */
	.nulisaja-ribbon-icon {
		transition: transform 0.2s ease, color 0.2s ease;
	}
	
	.nulisaja-ribbon-icon:hover {
		transform: scale(1.1);
		color: var(--interactive-accent);
	}

	/* Quick Menu Styling */
	.nulisaja-quick-menu-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		background: rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(4px);
		z-index: 1000;
		animation: nulisaja-overlay-fade-in 0.2s ease-out;
	}

	.nulisaja-quick-menu {
		width: min(420px, 100%);
		min-width: min(320px, 100%);
		max-width: 520px;
		max-height: min(80vh, 640px);
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: 16px;
		padding: 24px;
		box-sizing: border-box;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
		backdrop-filter: blur(10px);
		animation: nulisaja-fade-in 0.3s ease-out;
	}

	.nulisaja-quick-menu:focus-visible {
		outline: none;
	}

	.nulisaja-quick-menu::-webkit-scrollbar {
		width: 6px;
	}

	.nulisaja-quick-menu::-webkit-scrollbar-thumb {
		background: var(--background-modifier-border);
		border-radius: 999px;
	}

	@keyframes nulisaja-fade-in {
		from {
			opacity: 0;
			transform: translateY(12px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes nulisaja-fade-out {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		to {
			opacity: 0;
			transform: translateY(8px) scale(0.98);
		}
	}

	@keyframes nulisaja-overlay-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes nulisaja-overlay-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	.nulisaja-menu-title {
		margin: 0 0 20px 0;
		text-align: center;
		font-size: 1.2em;
		font-weight: 600;
		color: var(--text-normal);
		background: linear-gradient(135deg, var(--interactive-accent), var(--text-accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.nulisaja-buttons-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 12px;
		margin-bottom: 16px;
	}

	.nulisaja-menu-button {
		padding: 12px 16px;
		border: 1px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9em;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		position: relative;
		overflow: hidden;
	}

	.nulisaja-menu-button:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.nulisaja-close-button {
		width: 100%;
		padding: 10px;
		border: none;
		border-radius: 8px;
		background: var(--background-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9em;
		font-weight: 500;
	}

	.nulisaja-close-button:hover {
		background: var(--background-modifier-error);
		color: var(--text-on-accent);
	}

	/* Modal Styling */
	.nulisaja-modal {
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	.nulisaja-modal-title {
		font-size: 1.3em;
		font-weight: 600;
		margin-bottom: 20px;
		text-align: center;
		color: var(--text-normal);
	}

	.nulisaja-input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-primary);
		color: var(--text-normal);
		font-size: 1em;
		transition: all 0.2s ease;
		margin-bottom: 16px;
	}

	.nulisaja-input:focus {
		outline: none;
		border-color: var(--interactive-accent);
		box-shadow: 0 0 0 3px rgba(var(--interactive-accent-rgb), 0.1);
	}

	.nulisaja-button-group {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.nulisaja-button {
		padding: 10px 20px;
		border: 1px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9em;
		font-weight: 500;
		min-width: 80px;
	}

	.nulisaja-button:hover {
		background: var(--background-modifier-hover);
		transform: translateY(-1px);
	}

	.nulisaja-button-primary {
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border-color: var(--interactive-accent);
	}

	.nulisaja-button-primary:hover {
		background: var(--interactive-accent-hover);
	}

	.nulisaja-button-secondary {
		background: var(--background-secondary);
	}

	.nulisaja-button-secondary:hover {
		background: var(--background-modifier-error);
		color: var(--text-on-accent);
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.nulisaja-quick-menu {
			width: 100%;
			max-width: 480px;
			max-height: 85vh;
			padding: 20px;
		}

		.nulisaja-buttons-container {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
			gap: 10px;
		}
	}

	@media (max-width: 600px) {
		.nulisaja-quick-menu-overlay {
			align-items: flex-end;
		}

		.nulisaja-quick-menu {
			width: 100%;
			max-width: none;
			max-height: 90vh;
			padding: 20px;
			border-radius: 20px 20px 0 0;
		}

		.nulisaja-buttons-container {
			grid-template-columns: 1fr;
			gap: 10px;
		}

		.nulisaja-menu-button {
			min-height: 48px;
			font-size: 1em;
		}

		.nulisaja-button-group {
			flex-direction: column;
		}

		.nulisaja-button {
			width: 100%;
			min-height: 44px;
		}
	}

	@media (max-width: 420px) {
		.nulisaja-menu-title {
			font-size: 1.1em;
		}

		.nulisaja-quick-menu {
			padding: 18px;
		}

		.nulisaja-menu-button {
			font-size: 0.95em;
			padding: 12px;
		}
	}

	/* Dark mode adjustments */
	.theme-dark .nulisaja-quick-menu {
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	/* Loading animation */
	.nulisaja-loading {
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 2px solid var(--background-modifier-border);
		border-radius: 50%;
		border-top-color: var(--interactive-accent);
		animation: nulisaja-spin 1s ease-in-out infinite;
	}

	@keyframes nulisaja-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.nulisaja-template-preview-wrapper {
		margin-top: 10px;
		padding: 12px;
		border: 1px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-secondary);
	}

	.nulisaja-template-preview-title {
		font-size: 0.85em;
		font-weight: 600;
		margin-bottom: 4px;
		color: var(--text-muted);
	}

	.nulisaja-template-preview {
		margin: 0;
		font-family: var(--font-monospace);
		font-size: 0.85em;
		white-space: pre-wrap;
		max-height: 200px;
		overflow: auto;
	}

	/* Success/Error states */
	.nulisaja-success {
		color: var(--text-success);
	}

	.nulisaja-error {
		color: var(--text-error);
	}

	/* ========================================
	   Command Palette Styles (Desktop)
	   ======================================== */
	.nulisaja-command-palette-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 10vh 16px 16px;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 1000;
		animation: nulisaja-overlay-fade-in 0.15s ease-out;
	}

	.nulisaja-command-palette {
		width: 100%;
		max-width: 520px;
		max-height: 70vh;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: 12px;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		animation: nulisaja-cp-fade-in 0.15s ease-out;
	}

	@keyframes nulisaja-cp-fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes nulisaja-cp-fade-out {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		to {
			opacity: 0;
			transform: translateY(-10px) scale(0.98);
		}
	}

	.nulisaja-cp-search-container {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		border-bottom: 1px solid var(--background-modifier-border);
		background: var(--background-secondary);
	}

	.nulisaja-cp-search-icon {
		font-size: 1.1em;
		opacity: 0.6;
	}

	.nulisaja-cp-search-input {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--text-normal);
		font-size: 1em;
		outline: none;
	}

	.nulisaja-cp-search-input::placeholder {
		color: var(--text-muted);
	}

	.nulisaja-cp-items {
		max-height: calc(70vh - 60px);
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 8px 0;
	}

	.nulisaja-cp-items::-webkit-scrollbar {
		width: 6px;
	}

	.nulisaja-cp-items::-webkit-scrollbar-thumb {
		background: var(--background-modifier-border);
		border-radius: 999px;
	}

	.nulisaja-cp-category {
		margin-bottom: 4px;
	}

	.nulisaja-cp-category-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px 6px;
		font-size: 0.75em;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--text-muted);
	}

	.nulisaja-cp-category-icon {
		font-size: 1.2em;
	}

	.nulisaja-cp-category-items {
		display: flex;
		flex-direction: column;
	}

	.nulisaja-cp-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
		cursor: pointer;
		transition: background 0.1s ease;
	}

	.nulisaja-cp-item:hover,
	.nulisaja-cp-item-selected {
		background: var(--background-modifier-hover);
	}

	.nulisaja-cp-item-selected {
		background: var(--background-modifier-active-hover);
	}

	.nulisaja-cp-item-icon {
		font-size: 1.3em;
		width: 28px;
		text-align: center;
	}

	.nulisaja-cp-item-text {
		flex: 1;
		min-width: 0;
	}

	.nulisaja-cp-item-label {
		font-weight: 500;
		color: var(--text-normal);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nulisaja-cp-item-desc {
		font-size: 0.85em;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nulisaja-cp-empty {
		padding: 24px 16px;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.9em;
	}

	/* ========================================
	   Bottom Sheet Styles (Mobile)
	   ======================================== */
	.nulisaja-bottom-sheet-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 1000;
		animation: nulisaja-overlay-fade-in 0.2s ease-out;
	}

	.nulisaja-bottom-sheet {
		width: 100%;
		max-width: 100%;
		max-height: 85vh;
		background: var(--background-primary);
		border-radius: 20px 20px 0 0;
		box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		animation: nulisaja-bs-slide-in 0.3s cubic-bezier(0.32, 0.72, 0, 1);
		touch-action: pan-y;
	}

	@keyframes nulisaja-bs-slide-in {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes nulisaja-bs-slide-out {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(100%);
		}
	}

	.nulisaja-bs-drag-handle {
		display: flex;
		justify-content: center;
		padding: 12px 0 8px;
		cursor: grab;
	}

	.nulisaja-bs-drag-handle:active {
		cursor: grabbing;
	}

	.nulisaja-bs-handle-bar {
		width: 36px;
		height: 4px;
		background: var(--background-modifier-border);
		border-radius: 999px;
	}

	.nulisaja-bs-title {
		margin: 0 0 16px 0;
		padding: 0 20px;
		text-align: center;
		font-size: 1.15em;
		font-weight: 600;
		color: var(--text-normal);
	}

	.nulisaja-bs-items {
		max-height: calc(85vh - 80px);
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 16px 24px;
		-webkit-overflow-scrolling: touch;
	}

	.nulisaja-bs-category {
		margin-bottom: 20px;
	}

	.nulisaja-bs-category-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 4px;
		font-size: 0.85em;
		font-weight: 600;
		color: var(--text-muted);
	}

	.nulisaja-bs-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 10px;
	}

	.nulisaja-bs-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 16px 8px;
		min-height: 80px;
		border: 1px solid var(--background-modifier-border);
		border-radius: 12px;
		background: var(--background-primary);
		cursor: pointer;
		transition: all 0.15s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.nulisaja-bs-card:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
	}

	.nulisaja-bs-card:active {
		transform: scale(0.96);
		background: var(--background-modifier-active-hover);
	}

	.nulisaja-bs-card-icon {
		font-size: 1.8em;
	}

	.nulisaja-bs-card-label {
		font-size: 0.85em;
		font-weight: 500;
		color: var(--text-normal);
		text-align: center;
		line-height: 1.2;
	}

	/* Mobile optimization for bottom sheet */
	@media (max-width: 420px) {
		.nulisaja-bs-cards-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 8px;
		}

		.nulisaja-bs-card {
			padding: 12px 6px;
			min-height: 72px;
		}

		.nulisaja-bs-card-icon {
			font-size: 1.5em;
		}

		.nulisaja-bs-card-label {
			font-size: 0.75em;
		}
	}

	/* Large screen optimization */
	@media (min-width: 600px) {
		.nulisaja-bottom-sheet {
			max-width: 480px;
			border-radius: 20px;
			margin: 0 auto 20px;
		}
	}

	/* Dark mode adjustments */
	.theme-dark .nulisaja-command-palette,
	.theme-dark .nulisaja-bottom-sheet {
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
	}

	/* ========================================
	   Post Status Bar Styles
	   ======================================== */
	.nulisaja-post-status-bar {
		padding: 12px 16px;
		background: var(--background-secondary);
		border-bottom: 1px solid var(--background-modifier-border);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.nulisaja-status-bar-inner {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.nulisaja-status-label {
		font-size: 0.9em;
		font-weight: 600;
		color: var(--text-muted);
	}

	.nulisaja-status-pills {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}

	.nulisaja-status-pill {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px 12px;
		border: 1px solid var(--background-modifier-border);
		border-radius: 20px;
		background: var(--background-primary);
		color: var(--text-muted);
		font-size: 0.85em;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.nulisaja-status-pill:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		color: var(--text-normal);
	}

	.nulisaja-status-pill.active {
		background: var(--interactive-accent);
		border-color: var(--interactive-accent);
		color: var(--text-on-accent);
		cursor: default;
		font-weight: 600;
	}

	.nulisaja-status-pill.past {
		background: var(--background-modifier-success);
		border-color: var(--background-modifier-success);
		color: var(--text-on-accent);
		opacity: 0.7;
	}

	.nulisaja-status-pill .icon {
		font-size: 1em;
	}

	.nulisaja-status-pill .label {
		display: inline;
	}

	.nulisaja-status-arrow {
		color: var(--text-muted);
		font-size: 0.9em;
		margin: 0 2px;
	}

	/* Mobile responsive */
	@media (max-width: 600px) {
		.nulisaja-post-status-bar {
			padding: 10px 12px;
		}

		.nulisaja-status-bar-inner {
			gap: 8px;
		}

		.nulisaja-status-label {
			display: none;
		}

		.nulisaja-status-pill {
			padding: 5px 10px;
			font-size: 0.8em;
		}

		.nulisaja-status-pill .label {
			display: none;
		}

		.nulisaja-status-arrow {
			font-size: 0.8em;
		}
	}

	/* Dark mode */
	.theme-dark .nulisaja-status-pill.past {
		background: rgba(var(--color-green-rgb), 0.3);
	}
`;

export function injectStyles(): void {
	if (document.getElementById(STYLE_ID)) {
		return;
	}

	const styleEl = document.createElement('style');
	styleEl.id = STYLE_ID;
	styleEl.textContent = STYLES;
	document.head.appendChild(styleEl);
}

export function removeStyles(): void {
	const existing = document.getElementById(STYLE_ID);
	if (existing) {
		existing.remove();
	}
}
