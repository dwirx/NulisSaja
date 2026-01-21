import type { QuickMenuCategory, QuickMenuItem, QuickMenuOptions } from './types';
import { groupItemsByCategory } from './utils';

const SHEET_CLASS = 'nulisaja-bottom-sheet';
const OVERLAY_CLASS = 'nulisaja-bottom-sheet-overlay';

interface TouchState {
	startY: number;
	currentY: number;
	isDragging: boolean;
}

type OverlayElement = HTMLElement & { __nulisajaCleanup?: () => void };

export function showBottomSheet(
	items: QuickMenuItem[],
	categories: QuickMenuCategory[],
	options: QuickMenuOptions = {}
): void {
	const existingSheet = document.querySelector(`.${SHEET_CLASS}`);
	if (existingSheet instanceof HTMLElement) {
		closeSheet(existingSheet, options.animations !== false);
		return;
	}

	const touchState: TouchState = {
		startY: 0,
		currentY: 0,
		isDragging: false
	};

	const overlay = document.createElement('div') as OverlayElement;
	overlay.className = OVERLAY_CLASS;

	const sheet = document.createElement('div');
	sheet.className = SHEET_CLASS;
	sheet.setAttribute('role', 'dialog');
	sheet.setAttribute('aria-modal', 'true');
	sheet.setAttribute('aria-label', options.title ?? 'Buat Catatan');

	overlay.appendChild(sheet);

	// Drag handle
	const dragHandle = document.createElement('div');
	dragHandle.className = 'nulisaja-bs-drag-handle';
	const handleBar = document.createElement('div');
	handleBar.className = 'nulisaja-bs-handle-bar';
	dragHandle.appendChild(handleBar);
	sheet.appendChild(dragHandle);

	// Title
	const title = document.createElement('h3');
	title.className = 'nulisaja-bs-title';
	title.textContent = options.title ?? '✨ Buat Catatan';
	sheet.appendChild(title);

	// Items container
	const itemsContainer = document.createElement('div');
	itemsContainer.className = 'nulisaja-bs-items';
	sheet.appendChild(itemsContainer);

	// Render grouped items
	const grouped = groupItemsByCategory(items, categories);

	for (const [category, categoryItems] of grouped) {
		const categoryEl = document.createElement('div');
		categoryEl.className = 'nulisaja-bs-category';

		const categoryHeader = document.createElement('div');
		categoryHeader.className = 'nulisaja-bs-category-header';
		categoryHeader.innerHTML = `<span>${category.icon}</span> ${category.name}`;
		categoryEl.appendChild(categoryHeader);

		const cardsGrid = document.createElement('div');
		cardsGrid.className = 'nulisaja-bs-cards-grid';

		for (const item of categoryItems) {
			const card = createCardElement(item, () => {
				executeItem(item, overlay, sheet, options);
			});
			cardsGrid.appendChild(card);
		}

		categoryEl.appendChild(cardsGrid);
		itemsContainer.appendChild(categoryEl);
	}

	// Touch handlers for swipe gestures
	const handleTouchStart = (e: TouchEvent) => {
		const touch = e.touches[0];
		touchState.startY = touch.clientY;
		touchState.currentY = touch.clientY;
		touchState.isDragging = true;
		sheet.style.transition = 'none';
	};

	const handleTouchMove = (e: TouchEvent) => {
		if (!touchState.isDragging) return;

		const touch = e.touches[0];
		touchState.currentY = touch.clientY;
		const deltaY = touchState.currentY - touchState.startY;

		// Only allow dragging down
		if (deltaY > 0) {
			sheet.style.transform = `translateY(${deltaY}px)`;
		}
	};

	const handleTouchEnd = () => {
		if (!touchState.isDragging) return;

		touchState.isDragging = false;
		sheet.style.transition = '';

		const deltaY = touchState.currentY - touchState.startY;
		const threshold = 100;

		if (deltaY > threshold) {
			removeEventListeners();
			closeSheet(sheet, options.animations !== false);
		} else {
			sheet.style.transform = '';
		}
	};

	const handleOutsideClick = (e: PointerEvent) => {
		if (!sheet.contains(e.target as Node)) {
			removeEventListeners();
			closeSheet(sheet, options.animations !== false);
		}
	};

	const handleEscapeKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			removeEventListeners();
			closeSheet(sheet, options.animations !== false);
		}
	};

	const removeEventListeners = () => {
		dragHandle.removeEventListener('touchstart', handleTouchStart);
		sheet.removeEventListener('touchmove', handleTouchMove);
		sheet.removeEventListener('touchend', handleTouchEnd);
		overlay.removeEventListener('pointerdown', handleOutsideClick);
		document.removeEventListener('keydown', handleEscapeKey);
	};

	overlay.__nulisajaCleanup = removeEventListeners;

	dragHandle.addEventListener('touchstart', handleTouchStart, { passive: true });
	sheet.addEventListener('touchmove', handleTouchMove, { passive: true });
	sheet.addEventListener('touchend', handleTouchEnd);
	document.addEventListener('keydown', handleEscapeKey);

	if (options.animations === false) {
		sheet.style.animation = 'none';
		overlay.style.animation = 'none';
	}

	document.body.appendChild(overlay);

	requestAnimationFrame(() => {
		overlay.addEventListener('pointerdown', handleOutsideClick);
		sheet.focus();
	});
}

function createCardElement(item: QuickMenuItem, onClick: () => void): HTMLElement {
	const card = document.createElement('button');
	card.className = 'nulisaja-bs-card';
	card.type = 'button';

	const iconEl = document.createElement('span');
	iconEl.className = 'nulisaja-bs-card-icon';
	iconEl.textContent = item.icon;

	const labelEl = document.createElement('span');
	labelEl.className = 'nulisaja-bs-card-label';
	labelEl.textContent = item.label;

	card.appendChild(iconEl);
	card.appendChild(labelEl);

	card.addEventListener('click', onClick);

	return card;
}

function executeItem(
	item: QuickMenuItem,
	overlay: OverlayElement,
	sheet: HTMLElement,
	options: QuickMenuOptions
): void {
	overlay.__nulisajaCleanup?.();
	closeSheet(sheet, options.animations !== false);
	item.handler();
}

function closeSheet(sheet: HTMLElement, animate: boolean): void {
	const overlay = sheet.closest(`.${OVERLAY_CLASS}`) as OverlayElement | null;
	overlay?.__nulisajaCleanup?.();

	if (!sheet.parentElement) {
		overlay?.remove();
		return;
	}

	if (!animate) {
		overlay?.remove();
		return;
	}

	sheet.style.animation = 'nulisaja-bs-slide-out 0.25s ease-in forwards';
	if (overlay) {
		overlay.style.animation = 'nulisaja-overlay-fade-out 0.25s ease-in forwards';
	}

	setTimeout(() => {
		overlay?.remove();
	}, 250);
}
