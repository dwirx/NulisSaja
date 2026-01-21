import { Notice, Plugin } from 'obsidian';
import { NOTE_DEFINITIONS } from './commands/noteDefinitions';
import { createQuickMenuItems, runNoteAction } from './commands/noteRunner';
import { registerNoteCommands } from './commands/registerCommands';
import { NoteService } from './services/noteService';
import { PostWorkflowService } from './services/postWorkflowService';
import { loadSettings, saveSettings } from './settings';
import { NulisajaSettingTab } from './settingsTab';
import { injectStyles, removeStyles } from './styles';
import type { NoteCommandDefinition, NulisajaPluginSettings } from './types';
import type { QuickMenuCategory, QuickMenuItem } from './ui/quickMenu/index';
import { getDefaultCategories, showQuickMenu } from './ui/quickMenu/index';

export default class NulisajaPlugin extends Plugin {
	settings: NulisajaPluginSettings;

	private noteService!: NoteService;
	private postWorkflowService!: PostWorkflowService;
	private quickMenuItems: QuickMenuItem[] = [];
	private quickMenuCategories: QuickMenuCategory[] = [];

	async onload(): Promise<void> {
		console.log('Nulisaja Plugin: Loading...');

		this.settings = await loadSettings(this);
		this.noteService = new NoteService(this);
		this.postWorkflowService = new PostWorkflowService(this);
		this.quickMenuItems = createQuickMenuItems(this, this.noteService, NOTE_DEFINITIONS);
		this.quickMenuCategories = getDefaultCategories();

		injectStyles();

		const ribbonIcon = this.addRibbonIcon('pen-tool', 'Nulisaja - Quick Note Creation', () => {
			this.openQuickMenu();
		});
		ribbonIcon.addClass('nulisaja-ribbon-icon');

		registerNoteCommands(
			this,
			NOTE_DEFINITIONS,
			(definition) => this.executeNoteDefinition(definition),
			() => this.openQuickMenu()
		);

		// Register post workflow commands
		this.registerPostWorkflowCommands();

		this.addSettingTab(new NulisajaSettingTab(this.app, this));

		console.log('Nulisaja Plugin: Successfully loaded');
		new Notice('✨ Nulisaja Plugin loaded successfully!');
	}

	onunload(): void {
		removeStyles();
	}

	async saveSettings(): Promise<void> {
		await saveSettings(this, this.settings);
	}

	private openQuickMenu(): void {
		// Apply visibility settings
		const visibleItems = this.quickMenuItems.map(item => ({
			...item,
			visible: this.settings.quickMenuVisibility?.[item.id] !== false
		}));

		showQuickMenu(visibleItems, this.quickMenuCategories, {
			animations: this.settings.animations,
			mode: this.settings.quickMenuMode
		});
	}

	private executeNoteDefinition(definition: NoteCommandDefinition): Promise<void> {
		return runNoteAction(this, this.noteService, definition);
	}

	private registerPostWorkflowCommands(): void {
		this.addCommand({
			id: 'post-move-to-editing',
			name: '📝 Pindahkan Post ke Editing',
			callback: () => {
				void this.postWorkflowService.moveActivePostToStatus('editing');
			}
		});

		this.addCommand({
			id: 'post-move-to-scheduled',
			name: '📅 Pindahkan Post ke Scheduled',
			callback: () => {
				void this.postWorkflowService.moveActivePostToStatus('scheduled');
			}
		});

		this.addCommand({
			id: 'post-move-to-published',
			name: '✅ Pindahkan Post ke Published',
			callback: () => {
				void this.postWorkflowService.moveActivePostToStatus('published');
			}
		});

		this.addCommand({
			id: 'post-move-to-draft',
			name: '📄 Pindahkan Post ke Draft',
			callback: () => {
				void this.postWorkflowService.moveActivePostToStatus('draft');
			}
		});
	}
}
