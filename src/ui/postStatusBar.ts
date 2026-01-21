import { MarkdownView, TFile, TFolder, Plugin } from 'obsidian';
import type { PostStatus, NulisajaPluginSettings } from '../types';

export interface PostStatusBarPlugin extends Plugin {
	settings: NulisajaPluginSettings;
	saveSettings: () => Promise<void>;
}

interface StatusConfig {
	key: PostStatus;
	label: string;
	icon: string;
}

const STATUS_ORDER: StatusConfig[] = [
	{ key: 'draft', label: 'Draft', icon: '📝' },
	{ key: 'editing', label: 'Editing', icon: '✏️' },
	{ key: 'scheduled', label: 'Scheduled', icon: '📅' },
	{ key: 'published', label: 'Published', icon: '✅' }
];

export class PostStatusBar {
	private plugin: PostStatusBarPlugin;
	private containerEl: HTMLElement | null = null;
	private currentFile: TFile | null = null;

	constructor(plugin: PostStatusBarPlugin) {
		this.plugin = plugin;
	}

	register(): void {
		// Listen for active leaf changes
		this.plugin.registerEvent(
			this.plugin.app.workspace.on('active-leaf-change', () => {
				this.updateStatusBar();
			})
		);

		// Listen for layout changes
		this.plugin.registerEvent(
			this.plugin.app.workspace.on('layout-change', () => {
				this.updateStatusBar();
			})
		);

		// Initial render
		this.updateStatusBar();
	}

	unregister(): void {
		this.removeStatusBar();
	}

	private async updateStatusBar(): Promise<void> {
		const view = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			this.removeStatusBar();
			return;
		}

		const file = view.file;
		if (!file) {
			this.removeStatusBar();
			return;
		}

		// Check if this is a post file (has status in frontmatter or is in Posts folder)
		const isPostFile = await this.isPostFile(file);
		if (!isPostFile) {
			this.removeStatusBar();
			return;
		}

		this.currentFile = file;
		const currentStatus = await this.getCurrentStatus(file);
		this.renderStatusBar(view, currentStatus);
	}

	private async isPostFile(file: TFile): Promise<boolean> {
		// Check if file is in any of the post workflow folders
		const folders = this.plugin.settings.postWorkflowFolders;
		const postFolders = [folders.drafts, folders.editing, folders.scheduled, folders.published];

		for (const folder of postFolders) {
			if (file.path.startsWith(folder + '/') || file.path.startsWith(folder)) {
				return true;
			}
		}

		// Also check posts folder from settings
		const postsFolder = this.plugin.settings.folders.posts;
		if (file.path.startsWith(postsFolder + '/') || file.path.startsWith(postsFolder)) {
			return true;
		}

		// Check frontmatter for status field
		return new Promise((resolve) => {
			this.plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
				resolve(frontmatter.status !== undefined);
			}).catch(() => resolve(false));
		});
	}

	private async getCurrentStatus(file: TFile): Promise<PostStatus> {
		return new Promise((resolve) => {
			this.plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
				const status = frontmatter.status as PostStatus;
				if (STATUS_ORDER.some(s => s.key === status)) {
					resolve(status);
				} else {
					resolve('draft');
				}
			}).catch(() => resolve('draft'));
		});
	}

	private renderStatusBar(view: MarkdownView, currentStatus: PostStatus): void {
		// Remove existing status bar
		this.removeStatusBar();

		// Get the content container
		const contentEl = view.contentEl;
		const editorEl = contentEl.querySelector('.cm-editor') || contentEl.querySelector('.markdown-preview-view');

		if (!editorEl) return;

		// Create status bar container
		this.containerEl = document.createElement('div');
		this.containerEl.className = 'nulisaja-post-status-bar';
		this.containerEl.innerHTML = this.createStatusBarHTML(currentStatus);

		// Insert before editor
		editorEl.parentElement?.insertBefore(this.containerEl, editorEl);

		// Add click handlers
		this.containerEl.querySelectorAll('.nulisaja-status-pill').forEach((pill) => {
			pill.addEventListener('click', (e) => {
				const target = e.currentTarget as HTMLElement;
				const status = target.dataset.status as PostStatus;
				if (status && status !== currentStatus) {
					void this.changeStatus(status);
				}
			});
		});
	}

	private createStatusBarHTML(currentStatus: PostStatus): string {
		const pills = STATUS_ORDER.map((status, index) => {
			const isActive = status.key === currentStatus;
			const isPast = STATUS_ORDER.findIndex(s => s.key === currentStatus) > index;
			const classes = [
				'nulisaja-status-pill',
				isActive ? 'active' : '',
				isPast ? 'past' : ''
			].filter(Boolean).join(' ');

			return `<button class="${classes}" data-status="${status.key}" title="Move to ${status.label}">
				<span class="icon">${status.icon}</span>
				<span class="label">${status.label}</span>
			</button>`;
		});

		const arrows = pills.slice(0, -1).map(() => '<span class="nulisaja-status-arrow">→</span>');

		// Interleave pills and arrows
		const elements: string[] = [];
		pills.forEach((pill, i) => {
			elements.push(pill);
			if (arrows[i]) {
				elements.push(arrows[i]);
			}
		});

		return `
			<div class="nulisaja-status-bar-inner">
				<span class="nulisaja-status-label">✍️ Status:</span>
				<div class="nulisaja-status-pills">
					${elements.join('')}
				</div>
			</div>
		`;
	}

	private getCurrentDateISO(): string {
		return new Date().toISOString().split('T')[0];
	}

	private async changeStatus(newStatus: PostStatus): Promise<void> {
		if (!this.currentFile) return;

		const file = this.currentFile;
		const folders = this.plugin.settings.postWorkflowFolders;

		// Get target folder
		const targetFolder = this.getFolderForStatus(newStatus, folders);

		const currentDate = this.getCurrentDateISO();

		// Update frontmatter with status and dates
		await this.plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
			frontmatter.status = newStatus;
			frontmatter.modified = currentDate;

			// Set scheduled_date when moving to scheduled
			if (newStatus === 'scheduled' && !frontmatter.scheduled_date) {
				frontmatter.scheduled_date = currentDate;
			}

			// Set published_date when moving to published
			if (newStatus === 'published' && !frontmatter.published_date) {
				frontmatter.published_date = currentDate;
			}
		});

		// Move file to new folder if needed
		const newPath = `${targetFolder}/${file.name}`;
		if (file.path !== newPath) {
			// Ensure folder exists
			await this.ensureFolderExists(targetFolder);
			await this.plugin.app.vault.rename(file, newPath);
		}

		// Update the status bar
		this.updateStatusBar();
	}

	private getFolderForStatus(status: PostStatus, folders: NulisajaPluginSettings['postWorkflowFolders']): string {
		switch (status) {
			case 'draft': return folders.drafts;
			case 'editing': return folders.editing;
			case 'scheduled': return folders.scheduled;
			case 'published': return folders.published;
		}
	}

	private async ensureFolderExists(folderPath: string): Promise<void> {
		const parts = folderPath.split('/');
		let currentPath = '';

		for (const part of parts) {
			currentPath = currentPath ? `${currentPath}/${part}` : part;
			const existing = this.plugin.app.vault.getAbstractFileByPath(currentPath);
			if (!existing) {
				await this.plugin.app.vault.createFolder(currentPath);
			}
		}
	}

	private removeStatusBar(): void {
		if (this.containerEl) {
			this.containerEl.remove();
			this.containerEl = null;
		}
		// Also remove any orphaned status bars
		document.querySelectorAll('.nulisaja-post-status-bar').forEach(el => el.remove());
	}
}
