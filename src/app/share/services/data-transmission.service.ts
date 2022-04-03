import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class DataTransmissionService {

  private subject = new Subject<any>();

  private scaleSubject = new Subject<any>();

  // 参考线传递数据
  private referSubject = new Subject<any>();

  // 保存 gif 传递数据
  private gifSubject = new Subject<any>();

  // 传递保存到手机进度数据
  private progressSubject = new Subject<any>();

  // 传递重试状态
  private retryDownloadSubject = new Subject<any>();

  // 传递是否需要显示边框
  private borderSubject = new Subject<any>();

  // 传递svg对象
  private svgSubject = new Subject<any>();

  // 传递blockId
  private blockIdSubject = new Subject<any>();

  // 传递logo与水印
  private logoWatermarkSubject = new Subject<any>();

  // 传递加载状态
  private saveLoadingSubject = new Subject<any>();

  // 传递顶部浏览器提示
  private showTipSubject = new Subject<any>();

  // 传递删除参考线 ID （传递参考线选择状态）
  private getReferLineIdSubject = new Subject<any>();

  // 传递组合数据
  private groupSubject = new Subject<any>();

  // 传递路由数据
  private exchangeSubject = new Subject<any>();

  sendExchange(flag) {
    this.exchangeSubject.next(flag);
  }

  getExchange(): Observable<any> {
    return this.exchangeSubject.asObservable();
  }

  sendLogoWatermark(flag) {
    this.logoWatermarkSubject.next(flag);
  }

  getLogoWatermark() {
    return this.logoWatermarkSubject.asObservable();
  }

  clearData() {
    this.subject.next();
  }

  // 表格展开
  sendData(show: any) {
    this.subject.next({ show: show });
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  // block 传递缩放比例
  sendPageZoom(zoom: any) {
    this.subject.next(zoom);
  }

  getPageZoom(): Observable<any> {
    return this.subject.asObservable();
  }

  // 页面 缩放比例传递
  sendPageScaleChange(data: number) {
    this.scaleSubject.next(data);
  }

  getPageScaleChange(): Observable<any> {
    return this.scaleSubject.asObservable();
  }

  // 小工具增加参考线
  changeReferLine(data: string) {
    this.referSubject.next(data);
  }

  getReferLine(): Observable<any> {
    return this.referSubject.asObservable();
  }

  // 传递参考线选中状态
  sendDeleteReferLineId(data: { type: string, id: string | undefined }) {
    this.getReferLineIdSubject.next(data);
  }

  getDeleteReferLineId(): Observable<any> {
    return this.getReferLineIdSubject.asObservable();
  }

  // 保存 gif
  saveGIF(data: string) {
    this.gifSubject.next(data);
  }

  getGIFData(): Observable<any> {
    return this.gifSubject.asObservable();
  }

  // 保存到手机进度
  saveProcess(data: string) {
    this.progressSubject.next(data);
  }

  // 获取手机下载进度
  getProcess() {
    return this.progressSubject.asObservable();
  }

  // 传递重试信息
  sendRetryStatus(data: string) {
    this.retryDownloadSubject.next(data);
  }

  // 获取重试
  getRetryStatus() {
    return this.retryDownloadSubject.asObservable();
  }

  // 获取边框状态
  getIsShowBorder() {
    return this.borderSubject.asObservable();
  }

  // 传送边框状态
  sendBorder(data: boolean = true) {
    this.borderSubject.next(data)
  }

  // 传递svg
  sendSvg(data) {
    this.svgSubject.next(data)
  }

  // 获取svg
  getSvg() {
    return this.svgSubject.asObservable();
  }

  // 传递
  sendBlockId(data) {
    this.blockIdSubject.next(data)
  }

  // 获取svg
  getBlockId() {
    return this.blockIdSubject.asObservable();
  }

  // 传递加载状态
  sendSaveLoading(data) {
    this.saveLoadingSubject.next(data)
  }

  // 获取加载状态
  getSaveLoading() {
    return this.saveLoadingSubject.asObservable();
  }

  // =====================
  // =====================

  // 右键菜单传值
  private contextMenuSubject = new Subject<any>();

  // 传递加载状态
  sendContextMenuData(data: any) {
    this.contextMenuSubject.next(data)
  }

  // 获取加载状态
  getContextMenuData() {
    return this.contextMenuSubject.asObservable();
  }

  // =====================
  // =====================

  // 模板切换
  private templateSwitchingSubject = new Subject<any>();

  // 传递加载状态
  sendTemplateSwitchingData(data: any) {
    this.templateSwitchingSubject.next(data)
  }

  // 获取加载状态
  getTemplateSwitchingData() {
    return this.templateSwitchingSubject.asObservable();
  }

  // 传递顶部浏览器提示
  sendShowTip(data) {
    this.showTipSubject.next(data)
  }

  // 获取顶部浏览器提示
  getShowTip() {
    return this.showTipSubject.asObservable();
  }

  // =====================
  // =====================

  // 多选锁定
  private lockedSubject = new Subject<any>();

  // 传递加载状态
  sendLockedData(data: any) {
    this.lockedSubject.next(data)
  }

  // 获取加载状态
  getLockedData() {
    return this.lockedSubject.asObservable();
  }

  // 发送组合数据 
  sendGroupData(data: any) {
    this.groupSubject.next(data);
  }

  // 获取组合数据
  getGroupData() {
    return this.groupSubject.asObservable();
  }

  // =====================
  // =====================

  // 切换主题
  private toggleThememSubject = new Subject<any>();

  // 传递加载状态
  sendToggleThememData(data: any) {
    this.toggleThememSubject.next(data)
  }

  // 获取加载状态
  getToggleThememData() {
    return this.toggleThememSubject.asObservable();
  }

  // =====================
  // =====================

  // 传递展开状态
  private sendSidebarStateSubject = new Subject<any>();
  private imageSidebarSwitchSubject = new Subject<any>();

  sendSidebarState(data: any) {
    this.sendSidebarStateSubject.next(data)
  }

  getSidebarState() {
    return this.sendSidebarStateSubject.asObservable();
  }

  sendImageSidebarSwitch(data: any) {
    this.imageSidebarSwitchSubject.next(data)
  }

  getImageSidebarSwitch() {
    return this.imageSidebarSwitchSubject.asObservable();
  }

  // =====================
  // =====================

  // 单图发送数据给 TABLE
  private data2TableSubject = new Subject<any>();

  sendData2Table(data: any) {
    this.data2TableSubject.next(data)
  }

  getData2Table() {
    return this.data2TableSubject.asObservable();
  }

  // =====================
  // =====================

  // 另存为单图的通知
  private forkChartSubject = new Subject<any>();

  sendForkChartState(data: any) {
    this.forkChartSubject.next(data)
  }

  getForkChartState() {
    return this.forkChartSubject.asObservable();
  }

  // =====================
  // =====================

  // 扫码通知
  private codeSubject = new Subject<any>();

  sendCodeSubjectState(data: any) {
    this.codeSubject.next(data)
  }

  getCodeSubjectState() {
    return this.codeSubject.asObservable();
  }

  // 上传
  private imageSubject = new Subject<any>();

  sendImageSubjectState(data: any) {
    this.imageSubject.next(data)
  }

  getImageSubjectState() {
    return this.imageSubject.asObservable();
  }

  // =====================
  // =====================

  // 颜色选择器
  private colorListSubject = new Subject<any>();

  sendColorListSubject(data: any) {
    this.colorListSubject.next(data)
  }

  getColorListSubject() {
    return this.colorListSubject.asObservable();
  }

  // 颜色选择器事件通知
  private handleColorChangeSubject = new Subject<any>();

  sendHandleColorChangeSubject(data: any) {
    this.handleColorChangeSubject.next(data)
  }

  getHandleColorChangeSubject() {
    return this.handleColorChangeSubject.asObservable();
  }
}
