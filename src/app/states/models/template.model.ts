/*
 * @Description: 模板model
 */

import * as ProjectModels from './project.model'

export interface ProjectTemplate {
  id: string
  title: string
  thumb: string
  pro: boolean
}

export interface ChartTemplate extends ProjectModels.Block {
  title: string
  thumb: string
}

export interface ProjectTemplateList {
  templates: ProjectTemplate[]
}

export interface ChartTemplateList {
  templates: ChartTemplate[]
}

export interface GetTemplate {
  type: string
}
