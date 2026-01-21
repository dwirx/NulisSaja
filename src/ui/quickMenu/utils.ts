import { Platform } from 'obsidian';
import type { QuickMenuCategory, QuickMenuItem } from './types';
import { DEFAULT_CATEGORIES, NOTE_TYPE_TO_CATEGORY } from './types';

export function isMobileDevice(): boolean {
	if (Platform.isMobile) return true;

	return (
		window.innerWidth <= 768 &&
		('ontouchstart' in window || navigator.maxTouchPoints > 0)
	);
}

export function groupItemsByCategory(
	items: QuickMenuItem[],
	categories: QuickMenuCategory[]
): Map<QuickMenuCategory, QuickMenuItem[]> {
	const grouped = new Map<QuickMenuCategory, QuickMenuItem[]>();

	const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

	for (const category of sortedCategories) {
		grouped.set(category, []);
	}

	const visibleItems = items.filter(item => item.visible);
	const sortedItems = [...visibleItems].sort((a, b) => a.order - b.order);

	for (const item of sortedItems) {
		const category = sortedCategories.find(c => c.id === item.categoryId);
		if (category) {
			const categoryItems = grouped.get(category);
			if (categoryItems) {
				categoryItems.push(item);
			}
		}
	}

	for (const [category, categoryItems] of grouped) {
		if (categoryItems.length === 0) {
			grouped.delete(category);
		}
	}

	return grouped;
}

export function filterItems(items: QuickMenuItem[], query: string): QuickMenuItem[] {
	if (!query.trim()) {
		return items.filter(item => item.visible);
	}

	const lowerQuery = query.toLowerCase().trim();

	return items.filter(item => {
		if (!item.visible) return false;

		const labelMatch = item.label.toLowerCase().includes(lowerQuery);
		const descMatch = item.description.toLowerCase().includes(lowerQuery);
		const typeMatch = item.noteType.toLowerCase().includes(lowerQuery);

		return labelMatch || descMatch || typeMatch;
	});
}

export function getCategoryForNoteType(noteType: string): string {
	return NOTE_TYPE_TO_CATEGORY[noteType as keyof typeof NOTE_TYPE_TO_CATEGORY] || 'capture';
}

export function getDefaultCategories(): QuickMenuCategory[] {
	return DEFAULT_CATEGORIES.map(cat => ({ ...cat }));
}
