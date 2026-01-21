import { Notice, TAbstractFile, TFile, TFolder } from 'obsidian';
import type { PostStatus, NulisajaPluginSettings } from '../types';

export interface PostWorkflowPlugin {
	app: {
		vault: {
			getAbstractFileByPath: (path: string) => TAbstractFile | null;
			rename: (file: TFile, newPath: string) => Promise<void>;
			createFolder: (path: string) => Promise<TFolder>;
		};
		workspace: {
			getActiveFile: () => TFile | null;
		};
		fileManager: {
			processFrontMatter: (file: TFile, fn: (frontmatter: Record<string, unknown>) => void) => Promise<void>;
		};
	};
	settings: NulisajaPluginSettings;
}

export class PostWorkflowService {
	private plugin: PostWorkflowPlugin;

	constructor(plugin: PostWorkflowPlugin) {
		this.plugin = plugin;
	}

	private getFolderForStatus(status: PostStatus): string {
		const folders = this.plugin.settings.postWorkflowFolders;
		switch (status) {
			case 'draft':
				return folders.drafts;
			case 'editing':
				return folders.editing;
			case 'scheduled':
				return folders.scheduled;
			case 'published':
				return folders.published;
		}
	}

	private async ensureFolderExists(folderPath: string): Promise<void> {
		const existing = this.plugin.app.vault.getAbstractFileByPath(folderPath);
		if (!existing || !(existing instanceof TFolder)) {
			await this.plugin.app.vault.createFolder(folderPath);
		}
	}

	private getCurrentDateISO(): string {
		return new Date().toISOString().split('T')[0];
	}

	async movePostToStatus(file: TFile, newStatus: PostStatus): Promise<void> {
		const targetFolder = this.getFolderForStatus(newStatus);
		await this.ensureFolderExists(targetFolder);

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

		// Move file to new folder
		const newPath = `${targetFolder}/${file.name}`;
		if (file.path !== newPath) {
			await this.plugin.app.vault.rename(file, newPath);
		}

		const statusLabels: Record<PostStatus, string> = {
			draft: 'Draft',
			editing: 'Editing',
			scheduled: 'Scheduled',
			published: 'Published'
		};

		new Notice(`✅ Post moved to ${statusLabels[newStatus]}`);
	}

	async moveActivePostToStatus(status: PostStatus): Promise<void> {
		const activeFile = this.plugin.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('❌ No active file');
			return;
		}

		if (activeFile.extension !== 'md') {
			new Notice('❌ Active file is not a markdown file');
			return;
		}

		await this.movePostToStatus(activeFile, status);
	}
}
