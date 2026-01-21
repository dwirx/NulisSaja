import type { QuickMenuCategory, QuickMenuItem, QuickMenuOptions } from './types';
import { filterItems, groupItemsByCategory } from './utils';

const MENU_CLASS = 'nulisaja-command-palette';
const OVERLAY_CLASS = 'nulisaja-command-palette-overlay';

interface CommandPaletteState {
	query: string;
	selectedIndex: number;
	filteredItems: QuickMenuItem[];
}

type OverlayElement = HTMLElement & { __nulisajaCleanup?: () => void };

export function showCommandPalette(
	items: QuickMenuItem[],
	categories: QuickMenuCategory[],
	options: QuickMenuOptions = {}
): void {
	const existingMenu = document.querySelector(`.${MENU_CLASS}`);
	if (existingMenu instanceof HTMLElement) {
		closeMenu(existingMenu, options.animations !== false);
		return;
	}

	const state: CommandPaletteState = {
		query: '',
		selectedIndex: 0,
		filteredItems: items.filter(i => i.visible)
	};

	const overlay = document.createElement('div') as OverlayElement;
	overlay.className = OVERLAY_CLASS;

	const menu = document.createElement('div');
	menu.className = MENU_CLASS;
	menu.tabIndex = -1;
	menu.setAttribute('role', 'dialog');
	menu.setAttribute('aria-modal', 'true');
	menu.setAttribute('aria-label', options.title ?? 'Buat Catatan');

	overlay.appendChild(menu);

	// Search input
	const searchContainer = document.createElement('div');
	searchContainer.className = 'nulisaja-cp-search-container';

	const searchIcon = document.createElement('span');
	searchIcon.className = 'nulisaja-cp-search-icon';
	searchIcon.textContent = '🔍';

	const searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.className = 'nulisaja-cp-search-input';
	searchInput.placeholder = 'Ketik untuk mencari...';
	searchInput.setAttribute('aria-label', 'Cari jenis catatan');

	searchContainer.appendChild(searchIcon);
	searchContainer.appendChild(searchInput);
	menu.appendChild(searchContainer);

	// Items container
	const itemsContainer = document.createElement('div');
	itemsContainer.className = 'nulisaja-cp-items';
	itemsContainer.setAttribute('role', 'listbox');
	menu.appendChild(itemsContainer);

	// Render items function
	const renderItems = () => {
		itemsContainer.innerHTML = '';

		if (state.query.trim()) {
			// Filtered view - flat list
			const filtered = filterItems(items, state.query);
			state.filteredItems = filtered;

			if (filtered.length === 0) {
				const emptyState = document.createElement('div');
				emptyState.className = 'nulisaja-cp-empty';
				emptyState.textContent = 'Tidak ada hasil untuk "' + state.query + '"';
				itemsContainer.appendChild(emptyState);
				return;
			}

			filtered.forEach((item, index) => {
				const itemEl = createItemElement(item, index, state, () => {
					executeItem(item, overlay, menu, options);
				});
				itemsContainer.appendChild(itemEl);
			});
		} else {
			// Grouped view
			const grouped = groupItemsByCategory(items, categories);
			state.filteredItems = [];

			let globalIndex = 0;
			for (const [category, categoryItems] of grouped) {
				const categoryEl = document.createElement('div');
				categoryEl.className = 'nulisaja-cp-category';

				const categoryHeader = document.createElement('div');
				categoryHeader.className = 'nulisaja-cp-category-header';
				categoryHeader.innerHTML = `<span class="nulisaja-cp-category-icon">${category.icon}</span> ${category.name}`;
				categoryEl.appendChild(categoryHeader);

				const categoryItemsEl = document.createElement('div');
				categoryItemsEl.className = 'nulisaja-cp-category-items';

				for (const item of categoryItems) {
					state.filteredItems.push(item);
					const itemEl = createItemElement(item, globalIndex, state, () => {
						executeItem(item, overlay, menu, options);
					});
					categoryItemsEl.appendChild(itemEl);
					globalIndex++;
				}

				categoryEl.appendChild(categoryItemsEl);
				itemsContainer.appendChild(categoryEl);
			}
		}

		updateSelection(itemsContainer, state.selectedIndex);
	};

	// Initial render
	renderItems();

	// Event handlers
	const handleInput = () => {
		state.query = searchInput.value;
		state.selectedIndex = 0;
		renderItems();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				state.selectedIndex = Math.min(state.selectedIndex + 1, state.filteredItems.length - 1);
				updateSelection(itemsContainer, state.selectedIndex);
				break;
			case 'ArrowUp':
				e.preventDefault();
				state.selectedIndex = Math.max(state.selectedIndex - 1, 0);
				updateSelection(itemsContainer, state.selectedIndex);
				break;
			case 'Enter':
				e.preventDefault();
				const selectedItem = state.filteredItems[state.selectedIndex];
				if (selectedItem) {
					executeItem(selectedItem, overlay, menu, options);
				}
				break;
			case 'Escape':
				e.preventDefault();
				removeEventListeners();
				closeMenu(menu, options.animations !== false);
				break;
		}
	};

	const handleOutsideClick = (e: PointerEvent) => {
		if (!menu.contains(e.target as Node)) {
			removeEventListeners();
			closeMenu(menu, options.animations !== false);
		}
	};

	const removeEventListeners = () => {
		searchInput.removeEventListener('input', handleInput);
		menu.removeEventListener('keydown', handleKeyDown);
		overlay.removeEventListener('pointerdown', handleOutsideClick);
	};

	overlay.__nulisajaCleanup = removeEventListeners;

	searchInput.addEventListener('input', handleInput);
	menu.addEventListener('keydown', handleKeyDown);

	if (options.animations === false) {
		menu.style.animation = 'none';
		overlay.style.animation = 'none';
	}

	document.body.appendChild(overlay);

	// Focus search input
	requestAnimationFrame(() => {
		searchInput.focus();
		overlay.addEventListener('pointerdown', handleOutsideClick);
	});
}

function createItemElement(
	item: QuickMenuItem,
	index: number,
	state: CommandPaletteState,
	onClick: () => void
): HTMLElement {
	const itemEl = document.createElement('div');
	itemEl.className = 'nulisaja-cp-item';
	itemEl.setAttribute('role', 'option');
	itemEl.setAttribute('data-index', String(index));

	if (index === state.selectedIndex) {
		itemEl.classList.add('nulisaja-cp-item-selected');
		itemEl.setAttribute('aria-selected', 'true');
	}

	const iconEl = document.createElement('span');
	iconEl.className = 'nulisaja-cp-item-icon';
	iconEl.textContent = item.icon;

	const textEl = document.createElement('div');
	textEl.className = 'nulisaja-cp-item-text';

	const labelEl = document.createElement('div');
	labelEl.className = 'nulisaja-cp-item-label';
	labelEl.textContent = item.label;

	const descEl = document.createElement('div');
	descEl.className = 'nulisaja-cp-item-desc';
	descEl.textContent = item.description;

	textEl.appendChild(labelEl);
	textEl.appendChild(descEl);

	itemEl.appendChild(iconEl);
	itemEl.appendChild(textEl);

	itemEl.addEventListener('click', onClick);
	itemEl.addEventListener('mouseenter', () => {
		state.selectedIndex = index;
		updateSelection(itemEl.parentElement?.parentElement ?? itemEl.parentElement!, index);
	});

	return itemEl;
}

function updateSelection(container: HTMLElement, selectedIndex: number): void {
	const items = container.querySelectorAll('.nulisaja-cp-item');
	items.forEach((item, i) => {
		if (i === selectedIndex) {
			item.classList.add('nulisaja-cp-item-selected');
			item.setAttribute('aria-selected', 'true');
			item.scrollIntoView({ block: 'nearest' });
		} else {
			item.classList.remove('nulisaja-cp-item-selected');
			item.removeAttribute('aria-selected');
		}
	});
}

function executeItem(
	item: QuickMenuItem,
	overlay: OverlayElement,
	menu: HTMLElement,
	options: QuickMenuOptions
): void {
	overlay.__nulisajaCleanup?.();
	closeMenu(menu, options.animations !== false);
	item.handler();
}

function closeMenu(menu: HTMLElement, animate: boolean): void {
	const overlay = menu.closest(`.${OVERLAY_CLASS}`) as OverlayElement | null;
	overlay?.__nulisajaCleanup?.();

	if (!menu.parentElement) {
		overlay?.remove();
		return;
	}

	if (!animate) {
		overlay?.remove();
		return;
	}

	menu.style.animation = 'nulisaja-cp-fade-out 0.15s ease-in forwards';
	if (overlay) {
		overlay.style.animation = 'nulisaja-overlay-fade-out 0.15s ease-in forwards';
	}

	setTimeout(() => {
		overlay?.remove();
	}, 150);
}
