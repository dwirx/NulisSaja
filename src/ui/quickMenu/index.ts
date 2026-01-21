import { showBottomSheet } from './bottomSheet';
import { showCommandPalette } from './commandPalette';
import type { QuickMenuCategory, QuickMenuItem, QuickMenuMode, QuickMenuOptions } from './types';
import { DEFAULT_CATEGORIES, NOTE_TYPE_TO_CATEGORY } from './types';
import { getDefaultCategories, isMobileDevice } from './utils';

export type { QuickMenuCategory, QuickMenuItem, QuickMenuMode, QuickMenuOptions };
export { DEFAULT_CATEGORIES, NOTE_TYPE_TO_CATEGORY, getDefaultCategories };

export interface LegacyQuickMenuAction {
	icon: string;
	label: string;
	description: string;
	handler: () => void;
}

export function showQuickMenu(
	items: QuickMenuItem[],
	categories: QuickMenuCategory[],
	options: QuickMenuOptions = {}
): void {
	const mode = options.mode ?? 'auto';
	const useMobile = mode === 'bottom-sheet' || (mode === 'auto' && isMobileDevice());

	if (useMobile) {
		showBottomSheet(items, categories, options);
	} else {
		showCommandPalette(items, categories, options);
	}
}

/**
 * Convert legacy QuickMenuAction array to new QuickMenuItem array
 */
export function convertLegacyActions(actions: LegacyQuickMenuAction[]): QuickMenuItem[] {
	return actions.map((action, index) => {
		const noteType = inferNoteType(action.label);
		return {
			id: `action-${index}`,
			noteType,
			label: action.label,
			description: action.description,
			icon: action.icon,
			categoryId: NOTE_TYPE_TO_CATEGORY[noteType] || 'capture',
			visible: true,
			order: index,
			handler: action.handler
		};
	});
}

function inferNoteType(label: string): import('../../types').NoteType {
	const lowerLabel = label.toLowerCase();

	if (lowerLabel.includes('daily') || lowerLabel.includes('harian')) return 'daily';
	if (lowerLabel.includes('journal') || lowerLabel.includes('jurnal')) return 'journal';
	if (lowerLabel.includes('knowledge') || lowerLabel.includes('pengetahuan')) return 'knowledge';
	if (lowerLabel.includes('brainstorm') || lowerLabel.includes('ide')) return 'ide';
	if (lowerLabel.includes('project') || lowerLabel.includes('proyek')) return 'projects';
	if (lowerLabel.includes('area')) return 'areas';
	if (lowerLabel.includes('resource') || lowerLabel.includes('sumber')) return 'resources';
	if (lowerLabel.includes('zettelkasten') || lowerLabel.includes('atomic')) return 'ideas';

	return 'notes';
}

/**
 * Legacy compatibility - show quick menu with old action format
 */
export function showQuickMenuLegacy(
	actions: LegacyQuickMenuAction[],
	options: { title?: string; animations?: boolean } = {}
): void {
	const items = convertLegacyActions(actions);
	const categories = getDefaultCategories();

	showQuickMenu(items, categories, options);
}
