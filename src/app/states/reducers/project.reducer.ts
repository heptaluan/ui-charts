/*
 * @Description: Modify Here, Please
 */

import * as ProjectModels from '../models/project.model';
import * as ProjectActions from '../actions/project.action';
import * as _ from 'lodash';
import * as $ from 'jquery';

export interface State {
  recentModify: ProjectModels.ProjectContentObject;     // 最近一次被改变的对象
  currentTheme: ProjectModels.ProjectThemeList;         // 主题
  currentProject: ProjectModels.ProjectBase;            // 正在编辑的项目
  currentArticle: ProjectModels.ProjectArticle;
  projects: ProjectModels.ProjectBase[];                // 历史项目列表
  saving: boolean;                                      // 保存状态 false：正在保存 true: 已保存
  chartProjects: ProjectModels.ProjectBase[];           // 单图列表
  currentChartProject: ProjectModels.ProjectBase;       // 正在编辑的项目
  currentChartArticle: ProjectModels.ProjectArticle;
  forkChartProjectId: string;
  forkInfoProjectId: string;
  forkTemplateProjectId: string;
  allProject: any;
  allArticleRecords: any;                               // 最近十个操作的记录数组
  prevArticle: any[];
  nextArticle: any[];
  redoUndoUpdateType: any;
  redoUndoUpdateData: any;
}

export const initialState: State = {
  currentTheme: undefined,
  recentModify: {
    blockId: '',
    pageId: '',
    type: 'article',
    step: 0
  },
  currentProject: undefined,
  currentArticle: undefined,
  projects: [],
  saving: true,
  chartProjects: [],
  currentChartProject: undefined,
  currentChartArticle: undefined,
  forkChartProjectId: undefined,
  forkInfoProjectId: undefined,
  forkTemplateProjectId: undefined,
  allProject: [],
  allArticleRecords: [],
  prevArticle: [],
  nextArticle: [],
  redoUndoUpdateType: undefined,
  redoUndoUpdateData: undefined
}




function CSVToArray(data) {
  const dataList = data.split('\n');
  const table = _.map(dataList, item => {
    const col = item.split(',');
    return _.map(col, cell => cell.trim());
  });
  return [table];
}

export function reducer(state = initialState, action: ProjectActions.Actions): State {
  switch (action.type) {

    // 信息图项目列表
    case ProjectActions.GET_PROJECT_LIST_SUCCESS: {
      const newProjects = action.payload;
      return Object.assign({}, state, {
        projects: newProjects
      });
    }

    // 单图项目列表
    case ProjectActions.GET_CHART_LIST_SUCCESS: {
      const newChartProjects = action.payload;
      return Object.assign({}, state, {
        chartProjects: newChartProjects
      });
    }

    // 全部项目列表
    case ProjectActions.GET_ALL_PROJECT_LIST_SUCCESS: {
      const newAllChartProjects = action.payload;
      return Object.assign({}, state, {
        allProject: newAllChartProjects
      });
    }

    // 信息图项目信息
    case ProjectActions.GET_PROEJCT_INFO_SUCCESS: {
      const projectInfo = _.cloneDeep(action.payload);
      _.map(projectInfo.article.contents.pages[0].blocks, block => {
        block.projectId === projectInfo.id;
        if (block.dataSrc) {
          if (typeof (block.dataSrc.data) === 'string') {
            block.dataSrc.data = CSVToArray(block.dataSrc.data);
          }
        }
      });
      const newCurrentArticle = _.cloneDeep(projectInfo.article)
      return Object.assign({}, state, {
        currentProject: _.omit(projectInfo, ['theme', 'article']),
        currentArticle: projectInfo.article,
        currentTheme: projectInfo.theme,
        allArticleRecords: [newCurrentArticle]
      });
    }

    // 单图项目信息
    case ProjectActions.GET_SINGLE_CHART_INFO_SUCCESS: {
      const chartInfo = _.cloneDeep(action.payload);
      if (!chartInfo.article.contents.theme) {
        const newTheme = {
          "_id": 18,
          "axis": { "color": "#a1a1a1 " },
          "backgroundColor": "#FFFFFF",
          "colors": ["#5AAEF3", "#62D9AD", "#5B6E96", "#a8dffa", "#ffdc4c", "#FF974C", "#E65A56", "#6D61E4", "#4A6FE2", "#6D9AE7", "#23C2DB", "#D4EC59", "#FFE88E", "#FEB64D", "#FB6E6C"],
          "fonts": { "accessoryColor": "#878787", "color": "#545454", "fontFamily": "阿里巴巴普惠体 常规", "fontSize": "14" },
          "grid": { "color": "#cccccc" },
          "titleFont": { "fontSize": "36", "color": "#4c4c4c", "fontFamily": "阿里巴巴普惠体 常规" },
          "name": "默认主题",
          "price": "0.0",
          "shapeColor": 1,
          "themeId": "18",
          "thumb": "https://ss1.dydata.io/v2/themes/17.png",
          "id": "17"
        };
        chartInfo.article.contents.theme = newTheme;
        // 避免单图创建空的项目
        if (chartInfo.article.contents.pages[0].blocks[0]) {
          chartInfo.article.contents.pages[0].blocks[0].theme = newTheme;
        }
      }
      const newCurrentArticle = _.cloneDeep(chartInfo.article)
      return Object.assign({}, state, {
        currentChartProject: _.omit(chartInfo, ['theme', 'article']),
        currentChartArticle: chartInfo.article,
        currentTheme: chartInfo.theme,
        allArticleRecords: [newCurrentArticle]
      });
    }

    // 信息图弹窗修改信息
    case ProjectActions.CONFIG_PROJECT_SUCCESS: {
      const updates = _.omit(action.payload, ['action', 'article']);
      const target = action.id;
      const index = _.findIndex(state.projects, { id: target });
      const newState = _.cloneDeep(state);

      const allIndex = _.findIndex(state.allProject, { id: target });
      _.assign(newState.allProject[allIndex], updates);

      _.assign(newState.projects[index], updates);
      _.assign(newState.currentProject, updates);
      return newState;
    }

    // 单图弹窗修改信息
    case ProjectActions.CONFIG_CHART_PROJECT_SUCCESS: {
      const updates = _.omit(action.payload, ['action', 'article']);
      const target = action.id;
      const index = _.findIndex(state.chartProjects, { id: target });
      const newState = _.cloneDeep(state);

      const allIndex = _.findIndex(state.allProject, { id: target });
      _.assign(newState.allProject[allIndex], updates);

      _.assign(newState.chartProjects[index], updates);
      _.assign(newState.currentChartProject, updates);
      return newState;
    }

    // 新建项目（共用接口）
    case ProjectActions.CREATE_PROJECT_SUCCESS: {

      const newProject = action.payload;
      const newProjects = _.cloneDeep(state.projects);
      const newChartProjects = _.cloneDeep(state.chartProjects);

      if (action.payload.type === 'infographic') {
        newProjects.push(<ProjectModels.ProjectBase>_.omit(newProject, ['theme', 'article']));
      } else if (action.payload.type === 'chart') {
        newChartProjects.push(<ProjectModels.ProjectBase>_.omit(newProject, ['theme', 'article']));
      }

      return Object.assign({}, state, {
        currentProject: _.omit(newProject, ['theme', 'article']),
        currentArticle: newProject.article,
        currentTheme: newProject.theme,
        projects: newProjects,
        chartProjects: newChartProjects
      });
    }

    // 模版 fork
    case ProjectActions.CREATE_TEMPLATE_PROJECT_SUCCESS: {
      const id = _.cloneDeep(action.payload).id;
      const newChartProjects = _.cloneDeep(state.chartProjects);
      const newAllProjects = _.cloneDeep(state.allProject);
      newChartProjects.unshift(action.payload);
      newAllProjects.unshift(action.payload);
      return Object.assign({}, state, {
        forkTemplateProjectId: id,
        chartProjects: newChartProjects,
        allProject: newAllProjects
      });
    }

    // 单图 fork
    case ProjectActions.CREATE_CHART_TEMPLATE_PROJECT_SUCCESS: {
      const id = _.cloneDeep(action.payload).id;
      return Object.assign({}, state, {
        forkChartProjectId: id
      });
    }

    // 信息图 fork
    case ProjectActions.CREATE_INFO_TEMPLATE_PROJECT_SUCCESS: {
      const id = _.cloneDeep(action.payload).id;
      const newProjects = _.cloneDeep(state.projects);
      const newAllProjects = _.cloneDeep(state.allProject);
      newProjects.unshift(action.payload);
      newAllProjects.unshift(action.payload);
      return Object.assign({}, state, {
        forkInfoProjectId: id,
        projects: newProjects,
        allProject: newAllProjects
      });
    }

    // 批量删除
    case ProjectActions.DELETE_PROJECT_LIST_SUCCESS: {
      let newInfoProjectList = _.cloneDeep(state.projects);
      let newChartProjectList = _.cloneDeep(state.chartProjects);
      let newAllProjects = _.cloneDeep(state.allProject);
      _.each(action.payload, item => {
        newInfoProjectList = _.filter(newInfoProjectList, project => project.id !== item);
        newChartProjectList = _.filter(newChartProjectList, project => project.id !== item);
        newAllProjects = _.filter(newAllProjects, project => project.id !== item);
      });
      return Object.assign({}, state, {
        projects: newInfoProjectList,
        chartProjects: newChartProjectList,
        allProject: newAllProjects
      });
    }

    // redo/undo（不走 @effect，直接监听）
    case ProjectActions.SET_PROJECT_REDO: {
      const newState = _.cloneDeep(state);
      let allArticleRecords, redoUndoUpdateData, prevArticle, nextArticle, redoUndoUpdateType
      if (newState.nextArticle.length < 1) {
        redoUndoUpdateData = newState.currentArticle
        prevArticle = newState.prevArticle
        nextArticle = []
        allArticleRecords = newState.allArticleRecords
        redoUndoUpdateType = undefined
      } else {
        const newAllArticleRecords = _.cloneDeep(newState.allArticleRecords)
        newAllArticleRecords.push((_.take(newState.nextArticle))[0])
        allArticleRecords = newAllArticleRecords
        redoUndoUpdateData = (_.takeRight([...newAllArticleRecords]))[0]
        prevArticle = _.dropRight([...newAllArticleRecords])
        redoUndoUpdateType = (_.take([...newState.nextArticle]))[0]
        const newNextArticle = [...newState.nextArticle]
        newNextArticle.shift()
        nextArticle = newNextArticle
      }
      return Object.assign({}, state, {
        allArticleRecords: allArticleRecords,
        prevArticle: prevArticle,
        nextArticle: nextArticle,
        redoUndoUpdateData: redoUndoUpdateData,
        redoUndoUpdateType: redoUndoUpdateType
      });
    }

    case ProjectActions.SET_PROJECT_UNDO: {
      const newState = _.cloneDeep(state);
      let allArticleRecords, redoUndoUpdateData, prevArticle, nextArticle, redoUndoUpdateType
      if (newState.allArticleRecords.length <= 1) {
        redoUndoUpdateData = newState.currentArticle ? newState.currentArticle : newState.currentChartArticle
        prevArticle = newState.prevArticle
        nextArticle = newState.nextArticle
        allArticleRecords = newState.allArticleRecords
        redoUndoUpdateType = undefined
      } else {
        allArticleRecords = _.dropRight([...newState.allArticleRecords])
        redoUndoUpdateData = _.cloneDeep(newState.allArticleRecords[newState.allArticleRecords.length - 2])
        prevArticle = _.dropRight([...newState.allArticleRecords])
        redoUndoUpdateType = _.cloneDeep(newState.allArticleRecords[newState.allArticleRecords.length - 1])
        let newNextArticle = _.cloneDeep(newState.nextArticle)
        newNextArticle.unshift((_.takeRight([...newState.allArticleRecords]))[0])
        nextArticle = newNextArticle
      }
      return Object.assign({}, state, {
        allArticleRecords: allArticleRecords,
        prevArticle: prevArticle,
        nextArticle: nextArticle,
        redoUndoUpdateData: redoUndoUpdateData,
        redoUndoUpdateType: redoUndoUpdateType
      });
    }

    // 组合删除
    case ProjectActions.GROUP_DELETE: {
      const updateTarget = _.cloneDeep(action.payload);
      const newState = _.cloneDeep(state);
      const newArticle = newState.currentArticle
      newArticle['groupDeleteData'] = updateTarget.groupList
      newArticle['projectBlockList'] = updateTarget.projectBlockList
      newArticle['type'] = 'group-delete'
      newState.allArticleRecords.push(newArticle)
      return Object.assign({}, state, {
        allArticleRecords: newState.allArticleRecords,
        nextArticle: []
      });
    }

    // 组合移动
    case ProjectActions.GROUP_LOCKED:
    case ProjectActions.GROUP_MOVE: {
      const updateTarget = _.cloneDeep(action.payload);
      const newState = _.cloneDeep(state);
      const newArticle = newState.currentArticle
      newArticle['groupMoveData'] = updateTarget
      newArticle['type'] = 'group-move'
      newState.allArticleRecords.push(newArticle)
      // console.log(newState.allArticleRecords);
      
      return Object.assign({}, state, {
        allArticleRecords: newState.allArticleRecords,
        nextArticle: []
      });
    }

    // 层级调整
    case ProjectActions.SET_BLOCK_INDEX: {
      const updateTarget = _.cloneDeep(action.payload);
      const newState = _.cloneDeep(state);
      const newArticle = newState.currentArticle
      newArticle['indexData'] = updateTarget
      newArticle['type'] = 'set-index'
      newArticle.contents.pages[0].blocks = updateTarget.newList;
      newState.allArticleRecords.push(_.cloneDeep(newArticle))
      return Object.assign({}, state, {
        allArticleRecords: newState.allArticleRecords,
        currentArticle: newArticle,
        nextArticle: []
      });
    }

    // 保存 article 不走 redo / undo
    case ProjectActions.SAVE_ARTICLE_NO_REDO_UNDO: {
      const updateTarget = _.cloneDeep(action.payload);
      const newArticle = updateTarget.article;
      return Object.assign({}, state, {
        currentArticle: newArticle
      }); 
    }

    // 保存 article 不走 redo / undo
    case ProjectActions.SET_PROJECT_REFERLINE: {
      const updateTarget = _.cloneDeep(action.payload);
      const newState = _.cloneDeep(state);
      const newArticle = newState.currentArticle;
      newArticle.contents.pages[0].referLines = _.cloneDeep(updateTarget.referLines);
      return Object.assign({}, state, {
        currentArticle: newArticle
      });
    }

    // 信息图 - article 更新
    case ProjectActions.UPDATE_CURRENT_PROJECT_ARTICLE_SUCCESS: {
      const updateTarget = _.cloneDeep(action.payload.target);
      if (!updateTarget) return;
      const updateData = _.omit(action.payload, ['target', 'method']);
      const newState = _.cloneDeep(state);
      let projectContents = newState.currentArticle.contents;
      let prevBlockList = _.cloneDeep(newState.currentArticle.contents.pages[0].blocks)

      if (newState.currentProject.type === 'infographic') {
        projectContents = <ProjectModels.InfographicProjectContents>projectContents;
        switch (updateTarget.type) {
          case 'article':
            (<ProjectModels.InfographicProjectContents>newState.currentArticle.contents).design = updateData.design;
            break;
          case 'page':
            break;
          default:
            const blockId = updateTarget.blockId;
            const blockData = _.cloneDeep(updateData.block);
            if (!projectContents.pages[0].blocks) {
              projectContents.pages[0].blocks = [];
            }
            // 只做单页面
            const blockIndex = _.findIndex(projectContents.pages[0].blocks, { blockId: blockId }) || 0;
            if (action.payload.method === 'add') {
              const insertAfter = (newNode, referenceNode) => {
                referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
              }
              projectContents.pages[0].blocks.push(blockData);
              // 解决层级调整之后，新插入 block 层级不对bug
              if (!action.payload.target.hasOwnProperty('target')) {
                setTimeout(() => {
                  const blocks = $('.workspace-wrap lx-block');
                  const newIndex = Array.from(blocks).findIndex(item => item['children'][0]['attributes']['chartid'].nodeValue === blockData.blockId);
                  if (newIndex !== blocks.length - 1) {
                    // 插入 层级调整成最高
                    insertAfter(blocks[newIndex], blocks[blocks.length - 1]); // blocks.last().after(blocks.eq(newIndex))
                  }
                }, 10);
              }

            } else if (action.payload.method === 'put') {
              projectContents.pages[0].blocks[blockIndex] = blockData;
              const data = _.cloneDeep(JSON.parse(localStorage.getItem('block')))
              if (data) {
                data.block = blockData
                localStorage.setItem('block', JSON.stringify(data))
              }
            } else if (action.payload.method === 'delete') {
              projectContents.pages[0].blocks.splice(blockIndex, 1);
            }
            break;
        }
      }
      updateTarget.step = state.recentModify.step + 1;

      if (updateTarget.target !== 'redo') {
        const newCurrentArticle = _.cloneDeep(newState.currentArticle)
        if (!newState.allArticleRecords || newState.allArticleRecords.length === 0) newState.allArticleRecords = [newCurrentArticle]
        if (!newState.prevArticle || newState.prevArticle.length === 0) newState.prevArticle = []
        if (!newState.nextArticle || newState.nextArticle.length === 0) newState.nextArticle = []
        if (action.payload.method === 'delete') {
          newState.allArticleRecords.push({
            article: newCurrentArticle,
            type: updateTarget.type,
            data: updateData,
            method: action.payload.method,
            flag: action.payload.target.flag ? action.payload.target.flag : null,
            prevBlockList: prevBlockList
          })
        } else {
          newState.allArticleRecords.push({
            article: newCurrentArticle,
            type: updateTarget.type,
            data: updateData,
            method: action.payload.method,
            flag: action.payload.target.flag ? action.payload.target.flag : null
          })
        }
        if (newState.nextArticle.length > 0) {
          newState.nextArticle = []
        }
        
      }
      if (newState.allArticleRecords.length >= 12) {
        newState.allArticleRecords = [...newState.allArticleRecords.slice(1)]
      }
      let prevArticle;
      if (newState.allArticleRecords.length > 1) {
        prevArticle = _.dropRight([...newState.allArticleRecords])
      } else {
        prevArticle = []
      }
      updateTarget.target = null

      // console.log(`====================================`)
      // console.log(`cur ==>`)
      // console.log(newState.allArticleRecords);
      // console.log(`prev ==>`)
      // console.log(prevArticle);
      // console.log(`next ==>`)
      // console.log(newState.nextArticle);
      // console.log(`====================================`)

      return Object.assign({}, state, {
        recentModify: updateTarget,
        currentArticle: {
          contents: projectContents
        },
        prevArticle: prevArticle,
        nextArticle: newState.nextArticle,
        allArticleRecords: newState.allArticleRecords
      });
    }

    // 单图 - article 更新
    case ProjectActions.UPDATE_CHART_CURRENT_PROJECT_ARTICLE_SUCCESS: {
      const updateTarget = _.cloneDeep(action.payload.target);
      const updateData = _.omit(action.payload, ['target', 'method']);
      const newState = _.cloneDeep(state);
      let projectContents = newState.currentChartArticle.contents;
      if (newState.currentChartProject.type === 'chart') {
        projectContents = <ProjectModels.InfographicProjectContents>projectContents;
        switch (updateTarget.type) {
          case 'article':
            (<ProjectModels.InfographicProjectContents>newState.currentChartArticle.contents).design = updateData.design;
            break;
          default:
            const blockId = updateTarget.blockId;
            const blockData = updateData.block;
            const blockIndex = _.findIndex(projectContents.pages[0].blocks, { blockId: blockId });
            if (action.payload.method === 'add') {
              projectContents.pages[0].blocks[0] = blockData;
            } else if (action.payload.method === 'put') {
              projectContents.pages[0].blocks[blockIndex] = blockData;
            } else if (action.payload.method === 'delete') {
              projectContents.pages[0].blocks.splice(blockIndex, 1);
            }
            break;
        }
      }
      updateTarget.step = state.recentModify.step + 1;

      if (updateTarget.target !== 'redo') {
        const newCurrentArticle = _.cloneDeep(newState.currentChartArticle)
        if (!newState.allArticleRecords || newState.allArticleRecords.length === 0) newState.allArticleRecords = [newCurrentArticle]
        if (!newState.prevArticle || newState.prevArticle.length === 0) newState.prevArticle = []
        if (!newState.nextArticle || newState.nextArticle.length === 0) newState.nextArticle = []
        newState.allArticleRecords.push({
          article: newCurrentArticle,
          type: updateTarget.type,
          data: updateData,
          method: action.payload.method,
          flag: action.payload.target.flag ? action.payload.target.flag : null
        })
        if (newState.nextArticle.length > 0) {
          newState.nextArticle = []
        }
      }

      if (newState.allArticleRecords.length >= 12) {
        newState.allArticleRecords = [...newState.allArticleRecords.slice(1)]
      }
      let prevArticle;
      if (newState.allArticleRecords.length > 1) {
        prevArticle = _.dropRight([...newState.allArticleRecords])
      } else {
        prevArticle = []
      }

      // 单图插入图表过来的
      if (updateTarget.target === 'init') {
        newState.allArticleRecords = [_.cloneDeep(newState.currentChartArticle)]
        prevArticle = []
        newState.nextArticle = []
      }
      updateTarget.target = null

      // console.log(`====================================`)
      // console.log(`cur ==>`)
      // console.log(newState.allArticleRecords);
      // console.log(`prev ==>`)
      // console.log(prevArticle);
      // console.log(`next ==>`)
      // console.log(newState.nextArticle);
      // console.log(`====================================`)

      return Object.assign({}, state, {
        recentModify: updateTarget,
        currentChartArticle: {
          contents: projectContents
        },
        prevArticle: prevArticle,
        nextArticle: newState.nextArticle,
        allArticleRecords: newState.allArticleRecords
      });
    }

    // 设置保存状态
    case ProjectActions.SET_PROJECT_SAVING_STATE: {
      const saving = action.payload;
      return Object.assign({}, state, {
        saving: saving
      });
    }

    case ProjectActions.DELETE_PROJECT_SUCCESS: {
      let newProjects = _.cloneDeep(state.projects);
      newProjects = _.filter(newProjects, project => project.id !== action.projectId);
      return Object.assign({}, state, {
        projects: newProjects
      });
    }

    case ProjectActions.DELETE_CHART_PROJECT_SUCCESS: {
      let newChartProjects = _.cloneDeep(state.chartProjects);
      newChartProjects = _.filter(newChartProjects, project => project.id !== action.projectId);
      return Object.assign({}, state, {
        chartProjects: newChartProjects
      });
    }

    // 信息图 - 保存整个项目
    case ProjectActions.UPDATE_AND_EXIT_CURRENT_PROJECT_SUCCESS: {
      const newProject = action.payload;
      const updateTarget = _.cloneDeep(state.recentModify);
      updateTarget.step = state.recentModify.step + 1;

      let allArticleRecords, prevArticle, nextArticle, redoUndoUpdateData, redoUndoUpdateType
      if (newProject.type && newProject.type === 'fromScene') {
        updateTarget.type = 'template';
        allArticleRecords = [_.cloneDeep(newProject.article)];
        prevArticle = [];
        nextArticle = [];
        redoUndoUpdateData = undefined;
        redoUndoUpdateType = undefined;
      } else {
        allArticleRecords = [];
        prevArticle = [];
        nextArticle = [];
        redoUndoUpdateData = undefined;
        redoUndoUpdateType = undefined;
      }
      return Object.assign({}, state, {
        recentModify: updateTarget,
        currentArticle: newProject.article,
        allArticleRecords: allArticleRecords,
        prevArticle: prevArticle,
        nextArticle: nextArticle,
        redoUndoUpdateData: redoUndoUpdateData,
        redoUndoUpdateType: redoUndoUpdateType,
      });
    }

    // 单图 - 保存整个项目
    case ProjectActions.UPDATE_AND_EXIT_CURRENT_CHART_PROJECT_SUCCESS: {
      const newProject = action.payload;
      return Object.assign({}, state, {
        currentChartArticle: newProject.article
      });
    }

    // 获取项目的主题
    case ProjectActions.GET_PROJECT_THEME_SUCCESS: {
      const projectTheme = [];
      _.each(_.cloneDeep(action.payload).themes, (item) => {
        projectTheme.push(Object.assign({}, item.theme, { price: item.price }, { id: item.id }));
      });
      return Object.assign({}, state, {
        currentTheme: {
          themes: projectTheme
        }
      });
    }
    default:
      return state;
  }
}

export const getProjectList = (state: State) => state.projects;
export const getChartProjectList = (state: State) => state.chartProjects;
export const getAllProjectList = (state: State) => state.allProject;

export const getCurrentProject = (state: State) => state.currentProject;
export const getRecentModify = (state: State) => state.recentModify;
export const getCurrentProjectTheme = (state: State) => state.currentTheme;
export const getCurrentProjectArticle = (state: State) => state.currentArticle;
export const getSavingState = (state: State) => state.saving;

// redo/undo
export const getRedoUndoUpdateType = (state: State) => state.redoUndoUpdateType;
export const getRedoUndoUpdateData = (state: State) => state.redoUndoUpdateData;
export const getAllArticleRecords = (state: State) => state.allArticleRecords;
export const getNextArticle = (state: State) => state.nextArticle;

// 单图
export const getCurrentChartProject = (state: State) => state.currentChartProject;
export const getCurrentChartArticle = (state: State) => state.currentChartArticle;

// 返回 fork id
export const getCurrentTemplateProjectId = (state: State) => state.forkTemplateProjectId;
export const getCurrentChartProjectId = (state: State) => state.forkChartProjectId;
export const getCurrentInfoProjectId = (state: State) => state.forkInfoProjectId;
