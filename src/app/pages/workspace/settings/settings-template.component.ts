import * as ProjectModels from '../../../states/models/project.model';

export interface SettingsTemplate {
    updateBlock(block: ProjectModels.Block, pageId?: string)
}
