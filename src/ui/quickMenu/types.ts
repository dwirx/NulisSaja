import type { NoteType } from '../../types';

export interface QuickMenuCategory {
	id: string;
	name: string;
	icon: string;
	order: number;
	collapsed?: boolean;
}

export interface QuickMenuItem {
	id: string;
	noteType: NoteType;
	label: string;
	description: string;
	icon: string;
	categoryId: string;
	visible: boolean;
	order: number;
	handler: () => void;
}

export type QuickMenuMode = 'auto' | 'command-palette' | 'bottom-sheet';

export interface QuickMenuSettings {
	mode: QuickMenuMode;
	categories: QuickMenuCategory[];
	items: QuickMenuItem[];
	animations: boolean;
	showSearch: boolean;
}

export interface QuickMenuOptions {
	title?: string;
	animations?: boolean;
	mode?: QuickMenuMode;
}

export const DEFAULT_CATEGORIES: QuickMenuCategory[] = [
	{ id: 'harian', name: 'Harian', icon: '📆', order: 0 },
	{ id: 'capture', name: 'Capture', icon: '💡', order: 1 },
	{ id: 'knowledge', name: 'Knowledge', icon: '🧠', order: 2 },
	{ id: 'para', name: 'PARA', icon: '📁', order: 3 },
	{ id: 'blog', name: 'Blog', icon: '✍️', order: 4 }
];

export const NOTE_TYPE_TO_CATEGORY: Record<NoteType, string> = {
	daily: 'harian',
	journal: 'harian',
	ide: 'capture',
	notes: 'capture',
	ideas: 'knowledge',
	knowledge: 'knowledge',
	resources: 'para',
	projects: 'para',
	areas: 'para',
	posts: 'blog'
};
