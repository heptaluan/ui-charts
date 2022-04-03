import { Injectable } from '@angular/core';

@Injectable()
export class API {

  // 测试机地址
  private prefix = 'http://39.105.112.224/vis';
  private dataStoreUrl = 'http://39.105.112.224';
  private oldUrl = 'http://39.105.112.224';

  // 正式机地址
  // private prefix = 'https://dycharts.com/vis';
  // private dataStoreUrl = 'https://dycharts.com';
  // private oldUrl = 'https://dycharts.com';


  constructor() { }

  // 分享地址域名
  getShareUrl() {
    return `${this.dataStoreUrl}/xshow/index.html?id=`
  }

  // 获取当前客户端域名
  getHost() {
    return this.prefix;
  }

  // 获取老地址
  getOldUrl() {
    return this.oldUrl;
  }

  // 获取/新建 信息图
  getProject(id?: string): string {
    if (id) {
      return `${this.prefix}/dychart/project/${id}`;
    } else {
      return `${this.prefix}/dychart/project`;
    }
  }

  // 获取信息图详情
  getInfographicProject(id) {
    return `${this.prefix}/dychart/project/infographic/${id}`;
  }

  // 获取全部项目信息
  getAllProjectList(): string {
    return `${this.prefix}/dychart/projects`;
  }

  // 模版 fork
  getForkTemplateProject(id) {
    return `${this.prefix}/dychart/fork/chart/${id}`;
  }

  // fork 单图
  getForkChartProject(id) {
    return `${this.prefix}/dychart/fork/template/${id}`;
  }

  // fork 信息图
  getForkInfoProject(id) {
    return `${this.prefix}/dychart/fork/infographic/${id}`;
  }

  // 批量删除
  getDeleteProjectList() {
    return `${this.prefix}/dychart/chartinstant_or_infographic_bulk_del`;
  }

  // 获取全部单图和信息图列表
  getAllProjects() {
    return `${this.prefix}/dychart/projects`;
  }

  // 获取单图列表（id 存在则获取项目信息）
  getSingleChartProject(projectId?: string): string {
    if (projectId) {
      return `${this.prefix}/dychart/chart/${projectId}`;
    } else {
      return `${this.prefix}/dychart/chart`;
    }
  }

  // 获取信息图项目信息
  getInfographic(projectId?: string, pageId?: string, blockId?: string): string {
    if (!projectId) {
      return `${this.getProject()}/infographic`;
    } else {
      if (!pageId) {
        return `${this.getProject()}/infographic/${projectId}`;
      } else {
        if (!blockId) {
          return `${this.getProject()}/infographic/${projectId}/${pageId}`;
        } else {
          return `${this.getProject()}/infographic/${projectId}/${pageId}/${blockId}`;
        }
      }
    }
  }

  // 获取单图项目信息
  getChartInfo(projectId?: string, pageId?: string, blockId?: string): string {
    if (!projectId) {
      return `${this.getProject()}/chart`;
    } else {
      if (!pageId) {
        return `${this.getProject()}/chart/${projectId}`;
      } else {
        if (!blockId) {
          return `${this.getProject()}/chart/${projectId}/${pageId}`;
        } else {
          return `${this.getProject()}/chart/${projectId}/${pageId}/${blockId}`;
        }
      }
    }
  }

  // 获取图标列表
  getProjectTemplate(): string {
    return `${this.prefix}/dychart/template/project`;
  }

  getChartTemplate(): string {
    return `${this.prefix}/dychart/template/chart`;
    // return `${this.prefix}/dychart/v2/template/chart?title=${title}`;
  }

  userInfo(): string {
    return `${this.prefix}/auth/users/me/`;
  }

  userBill(): string {
    return `${this.prefix}/alipay/myorder`;
  }

  resetPwdSendSmsCode(): string {
    return `${this.prefix}/auth/reset_password_send_sms_code`;
  }

  resetPwdSendEmailCode(): string {
    return `${this.prefix}/auth/reset_password_send_email_code`;
  }

  resetPwdVerify(): string {
    return `${this.prefix}/auth/reset_password`;
  }

  resetPwdSetPwd(): string {
    return `${this.prefix}/auth/set_password`;
  }

  resetPhoneSendSmsCode(): string {
    return `${this.prefix}/auth/reset_phone_send_sms_code`;
  }

  resetPhoneVerify(): string {
    return `${this.prefix}/auth/reset_phone`;
  }

  resetEmailVerifyPwd(): string {
    return `${this.prefix}/auth/check_password`;
  }

  resetEmailVerifyOld(): string {
    return `${this.prefix}/auth/check_email`;
  }

  resetEmailSetNew(): string {
    return `${this.prefix}/auth/bind_email`;
  }

  // 获取喜欢数据列表
  getFavoriteCaseList(type): string {
    return `${this.dataStoreUrl}/datastore/userfav/?type=${type}`;
  }

  // 删除喜欢列表数据
  deleteFavoriteCaseList(): string {
    return `${this.dataStoreUrl}/datastore/userfav/`;
  }

  // 获取我的喜欢数据的列表
  getFavoriteList() {
    return `${this.dataStoreUrl}/datastore/userfav/`;
  }

  // 获取我的下载数据列表
  getDownloadList(): string {
    return `${this.dataStoreUrl}/datastore/user_download_log/`;
  }

  // 获取我的上传数据列表
  getUploadList(): string {
    return `${this.dataStoreUrl}/datastore/user_upload_data/`;
  }

  // 信息图 - 我的喜欢
  getFavorite(): string {
    return `${this.prefix}/dychart/favorite`;
  }

  getFavoriteCaseDetail(): string {
    return `${this.getFavorite()}/case`;
  }

  caseLike(): string {
    return `${this.getFavorite()}/like`;
  }

  // 获取我喜欢的信息图模板(要加type,step,pagenum)
  getFavTemplates() {
    return `${this.prefix}/dychart/favorite/cases`;
  }

  deleteFavTemplates() {
    return `${this.prefix}/dychart/fav_template/`;
  }

  getCaseDetail(id: string): string {
    return `${this.prefix}/dychart/case/${id}`;
  }

  getChartCaseDetail(id: string): string {
    return `${this.prefix}/dychart/case_chart/${id}`;
  }

  // chart v1
  getChart(): string {
    return `${this.prefix}/dychart/project/152490449771507822`;
  }

  // theme
  getTheme(): string {
    return `${this.prefix}/dychart/themes?type=chart`;
  }

  // 更新用户版本号
  getUserInfoVer(): string {
    return `${this.prefix}/auth/user_version`;
  }

  /**
   *
   *  data store
   *
  */

  // 获取 data store 列表
  getDataStoreList(): string {
    return `${this.dataStoreUrl}/datastore/tree/v2`;
  }

  // 获取 data store 年份和国家
  getDataStoreYearAndCity(): string {
    return `${this.dataStoreUrl}/datastore/get_area_and_year_dropdown_list`;
  }

  // 获取 data store 详情
  getDataStoreDetail(id): string {
    return `${this.dataStoreUrl}/datastore/detail/${id}/`;
  }

  // 获取 pdf 小数据
  getPdfOtherData(id): string {
    return `${this.dataStoreUrl}/datastore/get_ref_xlsxs_of_pdf/${id}`;
  }

  // 获取 data store 更多相关数据详情
  postMoreDataList(): string {
    return `${this.dataStoreUrl}/datastore/get_datas_of_recommender/`;
  }

  // 提交数据需求
  postDataRequirements() {
    return `${this.dataStoreUrl}/vis/biz/datastore/demand`;
  }

  // 提交意见反馈
  postRequestRequirements() {
    return `${this.dataStoreUrl}/vis/biz/suggestion`;
  }

  // 提交模板反馈
  postTemplateRequirements() {
    return `${this.dataStoreUrl}/vis/biz/chart_scene/demand`;
  }

  // 提交纠错反馈
  postFixRequirements() {
    return `${this.dataStoreUrl}/datastore/data_error_report/`;
  }

  // 喜欢
  postDataDetailLike() {
    return `${this.dataStoreUrl}/datastore/userfav/`;
  }

  // 不喜欢
  postDataDetailDisLike(id) {
    return `${this.dataStoreUrl}/datastore/userfav/${id}/`;
  }

  // 获取下载链接
  getDataDownloadUrl(id) {
    return `${this.dataStoreUrl}/datastore/download_uri/${id}`;
  }

  // 调整至下载
  jumpToDataDownload(url) {
    return `${this.dataStoreUrl}/datastore/download/${url}`;
  }

  // 更新下载次数
  updateDataDownloadCount() {
    return `${this.dataStoreUrl}/datastore/update`;
  }

  // 获取热门搜索词汇
  getHotSearchWords() {
    return `${this.dataStoreUrl}/datastore/hotsearch/`;
  }

  /**
   *
   *  选模板 template
   *
  */
  gotTemplateHotSearchWords(type = 'p') {
    // return `${this.prefix}/dychart/chartscenetopsearch/`;
    return `${this.prefix}/dychart/v2/chartscenetopsearch/?type=${type}`
  }

  // 获取选模板首页展示图片
  getTemplateShowlist() {
    return `${this.prefix}/dychart/scene/show_list`;
  }

  // 获取 选模板 详情
  getTemplateDetail(id): string {
    return `${this.prefix}/dychart/project/${id}`;
  }

  // 获取首页 展示轮播
  gotSiteSliderBanner() {
    return `${this.prefix}/dychart/get_site_banner_slide_list`;
  }

  /**
   *
   *  编辑区 workspace
   *
  */

  // 获取图片->我的上传接口
  getUserUploadImg() {
    return `${this.prefix}/dychart/upload/file`;
  }

  /**
   *
   *  运营 workspace
   *
  */

  // 获取用户邀请成功的的用户信息
  getUserInvited() {
    return `${this.prefix}/auth/user_invite_log`;
  }

  // 获取用户邀请码
  getUserInviteCode() {
    return `${this.prefix}/auth/user_invite_code`;
  }

  // 通过用户邀请码，获取用户的手机号
  getUserPhoneByCode() {
    return `${this.prefix}/auth/phoneno_with_invite_code`;
  }

  // 获取促销信息
  getOnSaleMessage() {
    return `${this.prefix}/alipay/promotions`;
  }

  // 获取权限消耗量
  getUserPermissionConsume() {
    return `${this.prefix}/auth/equities_dashboard`;
  }

  // 上传地址 后端生成
  getMp4ByUrl() {
    return `${this.oldUrl}/srv-export/video-export`;
  }

  // 上传图片得到 mp4 前端生成 zip 包发给后端
  postImages() {
    return `${this.oldUrl}/srv-export/zip-video-export`;
  }

  // 获取视频
  getVideo(id) {
    return `${this.oldUrl}/srv-export/video-download/${id}`;
  }
}
