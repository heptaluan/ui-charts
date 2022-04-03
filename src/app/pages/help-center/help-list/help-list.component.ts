import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { DataDemandFeedbackComponent, PlayVideoComponent } from '../../../components/modals';
import { Observable } from 'rxjs/Observable';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'lx-help-list',
  templateUrl: './help-list.component.html',
  styleUrls: ['./help-list.component.scss']
})
export class HelpListComponent implements OnInit {
  // 最新 id 67
  @ViewChild('helpList') helpList: ElementRef;

  helpNum: number = 0;
  clickIndex: number = -1;
  clickTitleData: string = '';
  clickId: any = 'title-1-1';
  clickTitleId: string = '';
  isTitle: boolean = false;
  copyItem = [];
  leftDistance: number = 0;
  changeHeight: string;
  menuHeight: number;
  id;
  isShowTip: boolean = false;

  // 对应块的显示数组
  quickStartArr = [1, 2, 3, 58, 'title-1-1'];  // 快速上手
  commonQuestionArr = [4, 5, 6, 7, 'title-1-2'];  // 常见问题

  findDataArr = [9, 10, 11, 12, 13, 14, 15, 16, 17, 'add-1', 'title-2-1', 'title-2']; // 找数据
  title2_2 = [18, 19, 'title-2-2']; // 进入镝数图表
  title2_3 = [20, 21, 'title-2-3']; // 图表模板
  title2_4 = [22, 23, 'title-2-4']; // 数据图文
  title2_5 = [24, 25, 26, 'title-2-5'];   // 我的
  title2_6 = [27, 28, 'title-2-6'];   // 会员特权
  title2_7 = ['title-2-7'];   // 商务合作通道
  title2_8 = [29, 30, 31, 'title-2-8'];   // 账户管理
  learnDydataArr = ['title-0-1', 33, 'title-1', 34, 35, 36, 39, 40];    // 1分钟了解镝数

  aboutUsArr = ['aboutUs'];            // 关于我们
  updateEditionArr = ['title-3-3', 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 65, 66, 67];    // 版本更新
  title3_4 = ['title-3-4', 'title-3-4-1', 'title-3-4-2']; // 浏览器兼容列表
  // 一分钟了解镝数
  teachVideoArr = [
    {
      id: 33,
      url: 'https://ss1.dydata.io/tutorial/%E4%B8%80%E5%88%86%E9%92%9F%E4%BA%86%E8%A7%A3%E9%95%9D%E6%95%B0.mp4',
      bgColor: 'linear-gradient(180deg, #0acffe 0%, #495aff 100%)',
      time: '00:02:33',
      title: '1分钟了解镝数',
      top: false
    },
    // {
    //   id: 34,
    //   url: 'https://ss1.dydata.io/tutorial/%E8%BD%BB%E6%9D%BE%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%E8%B5%84%E6%BA%90.mp4',
    //   bgColor: 'linear-gradient(180deg, #68e0cf 0%, #209cff 100%)',
    //   time: '00:02:07',
    //   title: '轻松获取数据资源',
    //   top: true
    // },
    {
      id: 35,
      url: 'https://ss1.dydata.io/tutorial/%E5%B0%86%E6%95%B0%E6%8D%AE%E5%8F%98%E6%88%90%E5%9B%BE%E8%A1%A8.mp4',
      bgColor: 'linear-gradient(180deg, #ec77ab 0%, #7873f5 100%)',
      time: '00:01:09',
      title: '将数据变成图表',
      top: true
    },
    {
      id: 36,
      url: 'https://ss1.dydata.io/tutorial/%E6%89%93%E7%A3%A8%E5%9B%BE%E8%A1%A8%E7%9A%84%E7%BB%86%E8%8A%82.mp4',
      bgColor: 'linear-gradient(117deg, #fbab7e 0%, #f7ce68 100%)',
      time: '00:02:40',
      title: '打磨图表的细节',
      top: true
    },
    {
      id: 39,
      url: 'https://ss1.dydata.io/tutorial/%E6%B4%BB%E7%94%A8%E6%A8%A1%E6%9D%BF%E6%89%93%E9%80%A0%E7%BE%8E%E5%9B%BE.mp4',
      bgColor: 'linear-gradient(0deg, #00c9ff 0%, #92fe9d 100%)',
      time: '00:01:14',
      title: '活用模板打造美图',
      top: true
    },
    {
      id: 40,
      url: 'https://ss1.dydata.io/tutorial/%E5%9B%BE%E6%96%87%E5%B9%B6%E8%8C%82%E5%B1%95%E7%A4%BA%E6%95%B0%E6%8D%AE.mp4',
      bgColor: 'linear-gradient(180deg, #0acffe 0%, #495aff 100%)',
      time: '00:02:16',
      title: '图文并茂展示数据',
      top: true
    }
  ];

  // 版本更新
  versionUpdateLog = [
    {
      id: '67',
      time: '2021-03-04',
      textArr: [
        '新增蝴蝶图、平行线图、维诺图、三元图、笛卡尔热力图、极坐标热力图、极坐标柱状图、极坐标堆叠柱状图8个图表模板。',
      ]
    },
    {
      id: '66',
      time: '2021-01-28',
      textArr: [
        '1、提升会员「每日导出次数」上限至30次；',
        '2、数据图文编辑页面增加「手机上传图片」功能；',
        '3、图表模板页面增加「搜索」功能；',
        '4、「表格」模板优化换行策略及滚动条显示规则；',
        '5、「桑基图」模板增加「标签位置」配置项。',
      ]
    },
    {
      id: '65',
      time: '2021-01-15',
      textArr: [
        '1、新增在编辑界面中excel、csv文件「拖拽上传」直接生成图表功能；',
        '2、新增在编辑界面中PNG、JPG、GIF图片「拖拽上传」功能；',
        '3、玉玦图、线性玉玦图增加「轴标签」「轴线」配置项；',
        '4、极坐标气泡图、打卡气泡图、多轴气泡图、分组气泡图「标签」增加「单位」配置项；',
        '5、「标题」字号范围最大值调整至300，「画布高度」最大值调整至20000；',
        '6、修复了动态条形图「图片描边颜色」和「标签颜色」设置为自动时无效的问题；',
        '7、修复了动态圆堆积图标签中「层级2」与「时间」出现联动的问题；',
        '8、修复了百分比堆叠面积图、百分比条形图、人口金字塔图等图表的标签显示问题。',
      ]
    },
    {
      id: '64',
      time: '2020-12-31',
      textArr: [
        '1、编辑页面「图表样式」配置项新增线条的「渐变色」功能；',
        '2、编辑页面图表新增「数据格式」配置项；',
        '3、分组气泡图、极坐标气泡图、打卡气泡图、多轴气泡图新增「数值标签」配置项；',
        '4、修复元素选中状态下无法使用键盘调整位置的问题；',
        '5、修复部分浏览器数据图文项目下载失败的问题。',
      ]
    },
    {
      id: '63',
      time: '2020-12-04',
      textArr: [
        '1、新增极化面积图、极化折线图、分组力导图、箭头导向图、百分比符号条形图、棒棒糖图、纵向哑铃图、分组聚合气泡图8个图表模板；',
        '2、字体列表新增16个英文字体；',
        '3、新增手机端导出预览的功能；',
        '4、新增多个元素的图层调整功能；',
        '5、轴、网格线面板新增轴刻度间隔调整功能。',
      ]
    },
    {
      id: '62',
      time: '2020-11-13',
      textArr: [
        '1、新增元素的图层调整功能；',
        '2、新增元素的锁定/解锁功能；',
        '3、新增画布参考线功能；',
        '4、水波图新增icon替换功能以及数值、文字标签位置的调整功能；',
        '5、图表导出新增MP4、透明底MOV两种格式；',
        '6、优化了元素的操作体验。',
      ]
    },
    {
      id: '61',
      time: '2020-10-30',
      textArr: [
        '1、新增单个/多个元素的对齐功能；',
        '2、新增Shift配合缩放和移动的快捷键功能；',
        '3、新增框选多选功能，支持Ctrl/Command快捷键辅助多选；',
        '4、优化Mac操作系统下Delete快捷键功能；',
        '5、折柱混合图，新增多线多柱的自由设置功能；',
        '6、图形/图标新增阴影和渐变色功能；',
        '7、编辑数据面板，新增恢复样例数据功能。'
      ]
    },
    {
      id: '60',
      time: '2020-10-16',
      textArr: [
        '1、扩充了28个图表的样式模块；',
        '2、扩充了33个图表的单色、多色或渐变色的颜色模式；',
        '3、图表颜色模块下的单色、多色模式色板增加渐变色调色功能；',
        '4、图表标签模块增加单位功能；',
        '5、图表轴、网格线模块增加轴标签方向、轴位置、轴单位功能；',
        '6、优化编辑页面保存机制为“自动间隔保存+手动保存”模式。'
      ]
    },
    {
      id: '59',
      time: '2020-07-06',
      textArr: [
        '1、数据图文新增音视频插入功能；',
        '2、新增符号柱状图、纵向折线图、百分比条形图、纵向堆叠面积图、纵向层叠面积图、散点图、直方图7个图表模板；',
        '3、符号饼图、符号条形图新增图标替换功能；',
        '4、水波图新增样式配置项；',
        '5、项目分享后的展示页面增加全屏及缩放功能。'
      ]
    },
    {
      id: '57',
      time: '2020-06-12',
      textArr: [
        '1、百分比堆叠面积图、堆叠面积图、河流图、堆叠面积图（平滑）、层叠面积图（平滑）、区间面积图、百分比堆叠柱状图、堆叠柱状图、堆叠条形图、李克特量表图、描边条形图11个图表新增样式配置项；',
        '2、组成瀑布图样式配置项中增加显示顺序的调整项；',
        '3、水波图标签配置项中增加数值文字的相关配置项；',
        '4、李克特量表图轴线颜色配置项无效问题修复。'
      ]
    },
    {
      id: '56',
      time: '2020-06-05',
      textArr: [
        '1、编辑页面中增加图表数据的文件上传入口；',
        '2、信息图中的图表增加“另存为图表项目”的功能；',
        '3、项目管理中增加对项目的锁定和解锁功能；',
        '4、首页增加手机端适配页面。'
      ]
    },
    {
      id: '55',
      time: '2020-05-15',
      textArr: [
        '1、新增动态圆堆积图、动态条形图、动态折线变化图、动态排名变化图4个动态图表模板；',
        '2、图表列表页面增加图表的定义及使用场景说明；',
        '3、新增媒体合作通道，供媒体合作伙伴申请使用。'
      ]
    },
    {
      id: '54',
      time: '2020-03-14',
      textArr: [
        '1、人口金字塔、变化瀑布图、组成瀑布图、区间柱状图、区间条形图、分面柱图、甘特图增加“样式”配置项；',
        '2、变化瀑布图、组成瀑布图、区间柱状图、区间条形图“轴、网格线”配置项优化；',
        '3、词云图动画时间问题修复；',
        '4、部分图表下载后出现重影的问题修复。'
      ]
    },
    {
      id: '53',
      time: '2020-03-07',
      textArr: [
        '1、基础柱状图、基础条形图、半圆环图、基础饼图、基础环形图、变形饼图、基础环形图（圆角）、基础饼图（圆角）、分组柱状图、正负分组条形图、分组条形图、折柱混合图新增样式配置项；',
        '2、分组柱状图、正负分组条形图、分组条形图的“轴、网格线”配置项优化；',
        '3、分组气泡图描边颜色问题修复；',
        '4、基础折线图、阶梯折线图、折线图、曲线折线图等图表的轴范围功能修复。'
      ]
    },
    {
      id: '52',
      time: '2020-02-29',
      textArr: [
        '1、极坐标气泡图、打卡气泡图、多轴气泡图、分组气泡图、堆叠韦恩图新增样式配置项；',
        '2、颜色面板增加透明度调节功能；',
        '3、部分图表的轴线配置项功能优化；',
        '4、Chrome浏览器80以上版本兼容性问题修复；',
        '5、变形饼图等图表数值显示顺序问题修复。'
      ]
    },
    {
      id: '51',
      time: '2020-02-22',
      textArr: [
        // '1、颜色面板增加透明度调节功能；',
        '1、基础折线图、折线图、阶梯折线图、曲线折线图、排名变化图增加样式配置面板；',
        '2、斜率图增加轴标签字体、字号、颜色配置项；',
        '3、水波图、桑基图、弦图、树图等文字标签调节无效的bug修复；',
        '4、基础柱状图的轴范围bug修复。'
      ]
    },
    {
      id: '50',
      time: '2020-02-15',
      textArr: [
        '1、颜色面板增加14种预设颜色和7个最近使用颜色；',
        '2、折柱混合新增X轴标题配置项；',
        '3、双层环图、符号饼图、符号条形图的bug优化。',
      ]
    },
    {
      id: '49',
      time: '2020-02-11',
      textArr: [
        '1、新增子弹图模板；',
        '2、信息图编辑页面增加画布拖拽功能；',
        '3、曲线折线图新增Y轴取值范围配置项；',
        '4、雨量流量折线图、雨量流量面积图、变形柱图、打卡气泡图、极坐标气泡图、多轴气泡图增加标签和动画配置项；',
        '5、雨量流量折线图、雨量流量面积图Y轴标题配置项优化。'
      ]
    },
    {
      id: '48',
      time: '2020-02-01',
      textArr: [
        '1、优化了信息图中文字元素的内部边距；',
        '2、文字默认字体调整为阿里巴巴普惠体；',
        '3、修复了ios端空格宽度显示异常的问题。'
      ]
    },
    {
      id: '47',
      time: '2020-01-19',
      textArr: [
        '1、找数据版块上新复合型小数据；',
        '2、找数据板块新增按年份、国家筛选功能；',
        '3、编辑页面优化调整部分面板UI；',
        '4、部分图表模板数值标签小数点最多保留位数调整为2位；',
        '5、分组气泡图中的分类及对象列修改为非必选列；',
        '6、优化了水波图6%以下水位线不显示的问题；',
        '7、优化了符号条形图中的图标横列间距问题；',
        '8、编辑页面及图表其他bug修复。'
      ]
    },
    {
      id: '46',
      time: '2019-12-20',
      textArr: [
        '1、图表新增动画配置项及GIF导出功能；',
        '2、图表全新版面设计，新增单位、数据来源、出品方、版权信息等元素及配置项；',
        '3、新增下载图表或信息图到手机的功能；',
        '4、新增思源黑体、思源宋体、阿里巴巴普惠体等字体；',
        '5、优化注册/登录界面及流程；',
        '6、「词云图」新增标题配置项。'
      ]
    },
    {
      id: '45',
      time: '2019-11-15',
      textArr: [
        '1、「堆叠韦恩图」标签内容增加配置项；',
        '2、优化「桑基图」中数据显示顺序；',
        '3、优化「曲线折线图」显示效果；',
        '4、修复部分图表X轴标签斜体后超界的bug；',
        '5、修复「人口金字塔」左侧坐标轴标签显示为负值的bug；',
        '6、优化单图/信息图预览界面；',
        '7、优化数据/数据报告展示条目信息；',
        '8、优化搜索、浏览及数据反馈流程。'
      ]
    },
    {
      id: '44',
      time: '2019-10-31',
      textArr: [
        '1、新增甘特图、区间柱状图、堆叠玫瑰图、对比漏斗图、堆叠韦恩图等11个新图表模板；',
        '2、更新词云图模板并修复形状不明显的问题；',
        '3、优化项目在iOS端预览区域的显示效果。']
    },
    {
      id: '43',
      time: '2019-10-18',
      textArr: [
        '1、优化Safari浏览器适配问题；',
        '2、数据编辑弹窗增加排序功能；',
        '3、增加画布边界线功能；',
        '4、项目分享弹窗中增加项目分享名称的修改功能；',
        '5、个人中心「我的会员」版块增加会员权限消耗看板；',
        '6、个人中心「我的账单」增加数据交易账单类型。',]
    },
    {
      id: '42',
      time: '2019-08-23',
      textArr: [
        '1、手机端新增注册成功后的引导提示页；',
        '2、帮助按钮优化为悬浮菜单；',
        '3、帮助中心更新了对开发票的说明；',
        '4、修复了部分D3图表的bug。']
    },
    {
      id: '41',
      time: '2019-08-09',
      textArr: [
        '1、编辑页面：新增「撤销/重做」功能；',
        '2、编辑页面：支持「图片多张上传」功能；',
        '3、编辑页面-数据编辑弹窗：新增「转置」功能；',
        '4、找数据版块：新增「第三方渠道」数据类型；',
        '5、找数据版块：新增「数据单独购买」功能；',
        '6、会员权限体系调整；',
        '7、部分图表模板优化。']
    },
    {
      id: '38',
      time: '2019-07-12',
      textArr: [
        '1、新增图表模板李克特量表图；',
        '2、饼图数据显示调整；',
        '3、文字调整配置项新增“两端对齐”功能；',
        '4、图表字号调整的最大值开放到76px；',
        '5、修复大尺寸项目导出失败问题；',
        '6、修复快捷键Delete的问题；',
        '7、修复超大图片上传出错问题。']
    },
    {
      id: '37',
      time: '2019-07-04',
      textArr: [
        '1、43个图表模板新增数据标签功能，控制图表信息展示；',
        '2、新增半圆环图、进度图、斜率图等14个实用新图表模板；',
        '3、所有图表的样式与显示细节更加美观、规范、可操控；',
        '4、基本柱状图、玉玦图、玉玦图（线性），玫瑰图、玫瑰图（扇形）调色方式扩充为单色、多色和渐变色三种；',
        '5、帮助中心新上线3个教学视频帮助大家快速上手；',
        '6、网站页面新增“回到顶部”的快捷按钮。']
    }
  ];

  // 帮助菜单
  helpMenuList = [
    {
      id: 'title-1',
      title: '欢迎使用镝数',
      content: [
        // {
        //   id: 'title-0-1',
        //   title: '教学视频',
        //   content: [
        //     {
        //       id: 33,
        //       subTitle: '1分钟了解镝数'
        //     },
        //     // {
        //     //   id: 34,
        //     //   subTitle: '轻松获取数据资源'
        //     // },
        //     {
        //       id: 35,
        //       subTitle: '将数据变成图表'
        //     },
        //     {
        //       id: 36,
        //       subTitle: '打磨图表细节'
        //     },
        //     {
        //       id: 39,
        //       subTitle: '活用模板打造美图'
        //     },
        //     {
        //       id: 40,
        //       subTitle: '图文并茂展示数据'
        //     },
        //   ],
        //   flag: true
        // },
        {
          id: 'title-1-1',
          title: '快速上手',
          content: [
            {
              id: 1,
              subTitle: '快速创建项目'
            },
            {
              id: 2,
              subTitle: '编辑项目—单个图表'
            },
            {
              id: 3,
              subTitle: '编辑项目—数据图文'
            },
            {
              id: 58,
              subTitle: '导出与分享'
            }
          ],
          flag: false
        },
        {
          id: 'title-1-2',
          title: '常见问题',
          content: [
            {
              id: 4,
              subTitle: '功能相关'
            },
            {
              id: 5,
              subTitle: '图表相关'
            },
            {
              id: 6,
              subTitle: '账户相关'
            },
            {
              id: 7,
              subTitle: '其他'
            }
          ],
          flag: false
        },
      ],
    },
    {
      id: 'title-2',
      title: '用户手册',
      content: [
        // {
        //   id: 'title-2-1',
        //   title: '找数据',
        //   content: [
        //     {
        //       id: 9,
        //       subTitle: '搜索数据'
        //     },
        //     {
        //       id: 10,
        //       subTitle: '筛选数据'
        //     },
        //     {
        //       id: 11,
        //       subTitle: '预览数据'
        //     },
        //     {
        //       id: 12,
        //       subTitle: '分享数据'
        //     },
        //     {
        //       id: 13,
        //       subTitle: '喜欢数据'
        //     },
        //     {
        //       id: 'add-1',
        //       subTitle: '数据纠错'
        //     },
        //     {
        //       id: 14,
        //       subTitle: '下载数据'
        //     },
        //     {
        //       id: 15,
        //       subTitle: '下载数据报告'
        //     },
        //     {
        //       id: 16,
        //       subTitle: '制作图表'
        //     },
        //     {
        //       id: 17,
        //       subTitle: '数据需求反馈'
        //     }
        //   ],
        //   flag: false,
        // },
        {
          id: 'title-2-2',
          title: '进入镝数图表',
          content: [
            {
              id: 18,
              subTitle: '首页概况'
            },
            {
              id: 19,
              subTitle: '网站功能区域介绍'
            }
          ],
          flag: false,
        },
        {
          id: 'title-2-3',
          title: '图表模板',
          content: [
            {
              id: 20,
              subTitle: '创建图表'
            },
            {
              id: 21,
              subTitle: '图表编辑页面'
            }
          ],
          flag: false,
        },
        {
          id: 'title-2-4',
          title: '数据图文',
          content: [
            {
              id: 22,
              subTitle: '创建数据图文'
            },
            {
              id: 23,
              subTitle: '数据图文编辑页面'
            },
          ],
          flag: false,
        },
        {
          id: 'title-2-5',
          title: '我的',
          content: [
            {
              id: 24,
              subTitle: '我的项目'
            },
            {
              id: 25,
              subTitle: '我的收藏'
            },
            {
              id: 26,
              subTitle: '我的数据'
            }
          ],
          flag: false,
        },
        {
          id: 'title-2-6',
          title: '会员特权',
          content: [
            {
              id: 27,
              subTitle: '会员特权'
            },
            {
              id: 28,
              subTitle: '企业定制服务'
            }
          ],
          flag: false,
        },
        {
          id: 'title-2-8',
          title: '账户管理',
          content: [
            {
              id: 29,
              subTitle: '我的账户'
            },
            {
              id: 30,
              subTitle: '会员/账单'
            },
            {
              id: 31,
              subTitle: '邀请有礼'
            }
          ],
          flag: false,
        },
        {
          id: 'title-2-7',
          title: '商务合作通道',
          content: [
          ],
          flag: false,
        },
      ],
    },
    {
      title: '其他',
      // top: '467px',
      content: [
        {
          title: '意见反馈',
          content: [],
          flag: false,
        },
        {
          title: '关于我们',
          content: [],
          flag: false,
          id: 'aboutUs'
        },
        {
          title: '版本更新',
          content: [
            {
              id: 67,
              subTitle: '2021-03-04'
            },
            {
              id: 66,
              subTitle: '2021-01-28'
            },
            {
              id: 65,
              subTitle: '2021-01-15'
            },
            {
              id: 64,
              subTitle: '2020-12-31'
            },
            {
              id: 63,
              subTitle: '2020-12-04'
            },
            {
              id: 62,
              subTitle: '2020-11-13'
            },
            {
              id: 61,
              subTitle: '2020-10-30'
            },
            {
              id: 60,
              subTitle: '2020-10-16'
            },
            {
              id: 59,
              subTitle: '2020-07-06'
            },
            {
              id: 57,
              subTitle: '2020-06-12'
            },
            {
              id: 56,
              subTitle: '2020-06-05'
            },
            {
              id: 55,
              subTitle: '2020-05-15'
            },
            {
              id: 54,
              subTitle: '2020-03-14'
            },
            {
              id: 53,
              subTitle: '2020-03-07'
            },
            {
              id: 52,
              subTitle: '2020-02-29'
            },
            {
              id: 51,
              subTitle: '2020-02-22'
            },
            {
              id: 50,
              subTitle: '2020-02-15'
            },
            {
              id: 49,
              subTitle: '2020-02-11'
            },
            {
              id: 48,
              subTitle: '2020-02-01'
            },
            {
              id: 47,
              subTitle: '2020-01-19'
            },
            {
              id: 46,
              subTitle: '2019-12-20'
            },
            {
              id: 45,
              subTitle: '2019-11-15'
            },
            {
              id: 44,
              subTitle: '2019-10-31'
            },
            {
              id: 43,
              subTitle: '2019-10-18'
            },
            {
              id: 42,
              subTitle: '2019-08-23'
            },
            {
              id: 41,
              subTitle: '2019-08-09'
            },
            {
              id: 38,
              subTitle: '2019-07-12'
            },
            {
              id: 37,
              subTitle: '2019-07-04'
            }
          ],
          flag: false,
          id: 'title-3-3'
        },
        {
          title: '浏览器兼容列表',
          content: [
            {
              id: "title-3-4-1",
              subTitle: 'Windows'
            },
            {
              id: "title-3-4-2",
              subTitle: 'MacOS'
            },
          ],
          flag: false,
          id: 'title-3-4'
        }
      ],
    }
  ];
  constructor(
    private _el: ElementRef,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    // 百度统计
    // window['_hmt'].push(['_trackPageview', '/appv2/#/pages/help/list']);
    let updateTip = localStorage.getItem("updateTip");

    if (updateTip) {
      let clickTime = localStorage.getItem("click-helper-time");
      if (clickTime){
        if(updateTip.length === 4) {
          updateTip = "2020" + updateTip;
        }
        let updateTipTime = new Date(updateTip.slice(0,4) + "/" + updateTip.slice(4,6) + "/" + updateTip.slice(6,8)).getTime();      
        this.isShowTip = Number(clickTime) < updateTipTime;
      } else {
        this.isShowTip = true;
      }   
    } 
    // 控制悬浮菜单的高度
    this.resetWidth();

    Observable.fromEvent(window, 'resize')
      .pipe(
          debounceTime(100), // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe((event) => {
        this.resetWidth();
      });
    if (location.href.indexOf('?') > -1) {
      this.id = location.href.split('?id=')[1];
      location.href = location.href.split('?id=')[0];
    }
    if (this.id) {
      this.clickId = this.id;
      if (this.id === 'title-3-3') {
        this.helpMenuList[2].content[2].flag = true;
        this.isShowTip = false;
        localStorage.setItem("click-helper-time","" + new Date().getTime());  
      } else if(this.id === 'title-3-4') {
        this.helpMenuList[2].content[3].flag = true;
      }
    }
   
  }
  
  resetWidth() {
    const nowWidth = document.documentElement.clientWidth;
    const nowHeight = document.documentElement.clientHeight;
    this.menuHeight = nowHeight - 140;
    if ( nowWidth > 1280) {
      this.leftDistance = Math.round((nowWidth - 1280) / 2 + 90);
    } else {
      this.leftDistance = 90;
    }
    this.changeHeight = nowHeight - 60 + 'px';
  }

  // 处理标题点击事件
  handleTitleClick(item) {
    if (item.title === "版本更新") {
      localStorage.setItem("click-helper-time","" + new Date().getTime());
      this.isShowTip = false;
    }
    
    item.flag = !item.flag;
    if (item.title === '意见反馈') {
      this.modalService.show(DataDemandFeedbackComponent, {
        initialState: {
          title: '意见反馈',
          type: 'request',
          yourRequest: '告诉我们你的建议或遇到的问题'
        }
      });
    } else {
      this.handleClick(item);
    }

  }

  // 点击图标出现的事件
  handleIconClick(item, ev) {
    // ev.preventDefault();
    ev.stopPropagation();
    item.flag = !item.flag;
  }

  // 处理子标题点击事件
  handleClick(data) {
    if (data.title === '其他') {
      return;
    }
    if (data.parentId) {
      // 跳转 打磨图表细节，目前只有这一个特殊处理
      this.helpMenuList[1].content[1].flag = true;
      this.clickId = Number(data.id.split('-')[0]);
    } else {
      this.clickId = data.id;
    }
    // console.log(this.clickId);
    this.clickTitleData = '';
    setTimeout(() => {
      const anchorElement = document.getElementById(data.id);
      if (anchorElement) {
        let total = anchorElement.offsetTop;
        if (data.parentId) {
          this.helpList.nativeElement.scrollTop = total -8;
        } else {
          this.helpList.nativeElement.scrollTop = total - 45;
        }
      }
    }, 0);
  }

  // 处理打开视频
  handleOpenVideo(item) {
    this.modalService.show(PlayVideoComponent, {
      initialState: {
        url: item
      }
    });
  }

  // 处理点赞
  handleGood() {
    this.helpNum = 1;
  }

}
