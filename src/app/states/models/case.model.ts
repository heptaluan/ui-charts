/*
 * @Description: 案例model
 */
import * as ProjectModels from './project.model'

export interface GetCaseList {
  page_num: number
  page_size: number
  sort: 'hot' | 'time' | 'choice'
  search?: string
}

export interface ToggleLikeCase {
  type: string
  islike: 0 | 1
  caseid: string
}

export interface Case {
  caseid: number
  title: string
  author: string
  watch: number
  like: number
  thumb: string
}

export interface CaseList {
  pagenum: number
  total: number
  list: Case[]
}

export interface CaseDetail {
  title: string
  date: string
  modify_time: string
  watch: number
  view: number
  like: number
  thumb: string
  description: string
  author: string
  user: {
    avatar: string
    nickname: string
    loginname: string
    info: string
  }
  profile: string
  slogan: string
  islike: boolean
  article: ProjectModels.ProjectArticle
}
