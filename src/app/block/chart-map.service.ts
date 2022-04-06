import { Injectable, ComponentFactoryResolver, ComponentFactory } from '@angular/core'
import { TextComponent } from './text/text.component'
import { ShapeComponent } from './shape/shape.component'
import { ImageComponent } from './image/image.component'
import * as _ from 'lodash'

import { Block, TextBlockProps, ShapeBlockProps } from '../states/models/project.model'

import {
  D3RoseChartComponent,
  D3QuarterRoseChartComponent,
  D3OverlapAreaChartComponent,
  D3StepLineChartComponent,
  D3RoundCornerPieChartComponent,
  D3RoundCornerDonutChartComponent,
  D3WaveCircleChartComponent,
  D3IconBarChartComponent,
  D3RadialBarChartComponent,
  D3RadialLineChartComponent,
  D3SimpleSankeyChartComponent,
  D3HorizontalSankeyChartComponent,
  D3VerticalSankeyChartComponent,
  D3IconPieChartComponent,
  D3TwoLevelDonutChartComponent,
  D3ChordChartComponent,
  D3OneLevelTreemapChartComponent,
  D3TwoLevelTreemapChartComponent,
  D3SunburstChartComponent,
  D3TreeChartComponent,
  D3WeightedTreeChartComponent,
  D3MultipleBarChartComponent,
  D3PyramidChartComponent,
  D3RadarChartComponent,
  D3StreamgraphChartComponent,
  D3GroupingBubbleChartComponent,
  D3CalendarHeatmapChartComponent,
  D3StackedAreaChartComponent,
  D3HollowBarChartComponent,
  D3FormWaterfallChartComponent,
  D3ChangeWaterfallChartComponent,

  // 6.2 换库之后新增
  D3PieChartComponent,
  D3DonutChartComponent,
  D3DeformedPieChartComponent,
  D3BeeLineChartComponent,
  D3SmoothLineChartComponent,
  D3SimpleBarChartComponent,
  D3BasicHorizontalBarChartComponent,
  D3GroupedBarChartComponent,
  D3StackBarChartComponent,
  D3NegativeHorizontalBarChartComponent,
  D3GroupedHorizontalBarChartComponent,
  D3StackHorizontalBarChartComponent,
  D3MixLineBarChartComponent,
  D3StackedLinearChartComponent,
  D3PolygonRadarChartComponent,
  D3FunnelChartComponent,
  D3PercentageAreaChartComponent,
  D3PercentageBarChartComponent,
  D3HalfPieChartComponent,
  D3ProgressRoundPieChartComponent,
  D3BarProgressChartComponent,
  D3HalfProgressPieChartComponent,
  D3ArcDiagramChartComponent,
  D3SlopeChartComponent,
  D3GanttChartComponent,
  D3RankingChangeChartComponent,
  D3SymmetricChartComponent,
  D3SimpleLineChartComponent,
  D3ContrastiveFunnelChartComponent,
  D3RelativeRadarChartComponent,
  D3StackCircleChartComponent,
  D3RangeAreaChartComponent,
  D3RangeBarChartComponent,
  D3RangeHorizontalBarChartComponent,
  D3PolarStackBarChartComponent,
  D3PolarStackDonutBarChartComponent,
  D3RoseDonutChartComponent,
  D3WordCloudChartComponent,

  // ------------------ 20/02/04 换库之后新增  -------------------------
  D3RainfallVolumeLineChartComponent, // 雨量流量折线图
  D3RainfallVolumeAreaChartComponent, // 雨量流量面积图
  D3BulletChartComponent, // 子弹图
  D3DeformedBarChartComponent, // 变形柱状图
  D3MultipleBubbleChartComponent, // 多轴气泡图
  D3PolarBubbleChartComponent, // 极坐标气泡图
  D3PunchBubbleChartComponent, // 打卡气泡图

  // ------------------ 动态图表 -------------------------
  D3DynamicBarChartComponent, // 动态条形图
  D3DynamicLineChartComponent, // 动态折线图
  D3DynamicRankLineChartComponent, // 动态排名变化图
  D3PackChartComponent, // 圆堆积图

  // ------------------ 2020-06-08 新增图表 -------------------------
  D3HundredPercentBarChartComponent, // 百分比条形图
  D3PictographBarChartComponent, // 符号柱状图
  D3ReverseOverlapAreaChartComponent, // 纵向层叠面积图
  D3ReverseStackedAreaChartComponent, // 纵向堆叠面积图
  D3ReverseLineChartComponent, // 纵向折线图

  // ------------------ 2020-06-19 新增图表 -------------------------
  D3TableChartComponent, // 表格
  D3BasicScatterChartComponent, // 散点图
  D3HistogramChartComponent, // 直方图

  // ------------------ 2020-11-20 新增图表 -------------------------
  D3HundredPercentIconBarChartComponent, // 百分比符号条形图
  D3LollipopChartComponent, // 棒棒糖图
  D3GroupAggregationBubbleChartComponent, // 分组聚合气泡图
  D3ForceDiagramChartComponent, // 分组力导图
  D3PolarAreaChartComponent, // 极化面积图
  D3PolarLineChartComponent, // 极化折线图
  D3ForceDiagramArrowChartComponent, // 箭头导向图
  D3VerticalDumbbellChartComponent, // 纵向哑铃图

  // ------------------ 2021-02-22 新增图表 -------------------------
  D3ParallelLineChartComponent, // 平行线图
  D3ButterflyChartComponent, // 蝴蝶图
  D3ReverseFunnelChartComponent, // 金字塔图
  D3SoapBubbleChartComponent, // 维诺图
  D3PolarBarChartComponent, // 极坐标柱状图
  D3PolarStackRectangularChartComponent, // 极坐标堆叠柱状图
  D3DescartesHeatmapChartComponent, // 笛卡尔热力图
  D3PolarHeatmapChartComponent, // 极坐标热力图
  D3TernaryChartComponent, // 三元图
} from './d3'
import { AudioComponent } from './audio/audio.component'
import { VideoComponent } from './video/video.component'
import { GroupComponent } from './group/group.component'

export interface TemplateComponentMap {
  [id: string]: ComponentFactory<any>
}

@Injectable()
export class ChartMapService {
  componentFactorys = {
    '333333333333333333': TextComponent,
    '666666666666666666': ShapeComponent,
    '222222222222222222': ImageComponent,
    '444444444444444444': AudioComponent,
    '555555555555555555': VideoComponent,
    '777777777777777777': GroupComponent,

    // D3图表
    '5544734748594536499': D3OverlapAreaChartComponent,
    '5612096174443311134': D3StepLineChartComponent,
    '5544734748594536492': D3RoundCornerDonutChartComponent,
    '5544734748594536493': D3RoundCornerPieChartComponent,
    '5945734748594536331': D3RadialBarChartComponent,
    '5948734748594536332': D3RadialLineChartComponent,
    '5944734748594536331': D3RoseChartComponent,
    '5943734748594536331': D3QuarterRoseChartComponent,
    '4447460703254610031': D3WaveCircleChartComponent,
    '5544734748594536473': D3IconBarChartComponent,
    '5543733748594536504': D3HorizontalSankeyChartComponent,
    '5543533748794536504': D3VerticalSankeyChartComponent,
    '5543733748594536505': D3SimpleSankeyChartComponent,
    '4447460703254610041': D3IconPieChartComponent,
    '5544734748594536494': D3TwoLevelDonutChartComponent,
    '5544734748594536500': D3ChordChartComponent,
    '5544734748594536503': D3OneLevelTreemapChartComponent,
    '5544734748594536502': D3TwoLevelTreemapChartComponent,
    '5543734748594537504': D3SunburstChartComponent,
    '5543734748595436502': D3TreeChartComponent,
    '5543734748594536502': D3WeightedTreeChartComponent,
    '5544734748594536478': D3MultipleBarChartComponent,
    '5544734748594536487': D3PyramidChartComponent,
    '5544734748594536491': D3RadarChartComponent,
    '5544734748594536486': D3StreamgraphChartComponent,
    '4612096174443311107': D3GroupingBubbleChartComponent,
    '5544734748594536484': D3CalendarHeatmapChartComponent,
    '5612096174443311145': D3HollowBarChartComponent,
    '5544734748594536330': D3ChangeWaterfallChartComponent,
    '5544734748594536326': D3FormWaterfallChartComponent,
    '5544734748594536498': D3StackedAreaChartComponent,

    // 6.2 换库之后新增
    '444746070325460997': D3PieChartComponent,
    '444746070325460998': D3DonutChartComponent,
    '444746070325460999': D3DeformedPieChartComponent,
    '4544734748594536433': D3BeeLineChartComponent,
    '5948734748594536789': D3SmoothLineChartComponent,
    '444734748594536323': D3SimpleBarChartComponent,
    '154772011302084304': D3BasicHorizontalBarChartComponent,
    '3612096174443311105': D3GroupedBarChartComponent,
    '3612096174443311107': D3StackBarChartComponent,
    '3612096174443311106': D3NegativeHorizontalBarChartComponent,
    '3612096174443311110': D3GroupedHorizontalBarChartComponent,
    '3612096174443311109': D3StackHorizontalBarChartComponent,
    '5544734748594536332': D3MixLineBarChartComponent,
    '4544734748594536434': D3StackedLinearChartComponent,
    '451905388296536065': D3PolygonRadarChartComponent,
    '5544734748594536339': D3FunnelChartComponent,
    '154778025133261039': D3PercentageAreaChartComponent,
    '154778102528502157': D3PercentageBarChartComponent,
    '154777746677828400': D3HalfPieChartComponent,
    '154778171740391769': D3ProgressRoundPieChartComponent,
    '154778145806026722': D3BarProgressChartComponent,
    '154777820323716078': D3HalfProgressPieChartComponent,
    '154771854328053247': D3ArcDiagramChartComponent,
    '154778232785223023': D3SlopeChartComponent,
    '154777693253141239': D3GanttChartComponent,
    '154778205305403383': D3RankingChangeChartComponent,
    '5544734748594536495': D3SymmetricChartComponent,
    '444746070325460995': D3SimpleLineChartComponent,
    '7612096173333355101': D3ContrastiveFunnelChartComponent,
    '7612096173333355103': D3RelativeRadarChartComponent,
    '7612096176663355107': D3StackCircleChartComponent,
    '7612096176663355103': D3RangeAreaChartComponent,
    '7612096176663355104': D3RangeBarChartComponent,
    '7612096176663355105': D3RangeHorizontalBarChartComponent,
    '7612096174443355101': D3PolarStackBarChartComponent,
    '7612096174443355102': D3PolarStackDonutBarChartComponent,
    '7612096176663355106': D3RoseDonutChartComponent,
    // '7612096173333355102': D3HistogramChartComponent,
    '114473474859453649': D3WordCloudChartComponent,

    // ------------------ 20/02/04 换库之后新增  -------------------------
    '5544734748594536440': D3RainfallVolumeLineChartComponent,
    '5544734748594536441': D3RainfallVolumeAreaChartComponent,
    '111734748594536325': D3DeformedBarChartComponent,
    '3612096174443311122': D3PunchBubbleChartComponent,
    '3612096174443311121': D3PolarBubbleChartComponent,
    '3612096174443311123': D3MultipleBubbleChartComponent,
    '6543210123456536001': D3BulletChartComponent,

    // ------------------ 动态图表 -------------------------
    '8000000011111111001': D3DynamicBarChartComponent, // 动态条形图
    '8000000011111111002': D3DynamicLineChartComponent, // 动态折线变化图
    '8000000011111111003': D3DynamicRankLineChartComponent, // 动态折线排名图
    '8000000011111111004': D3PackChartComponent, // 圆堆积图

    // ------------------ 2020-06-08 新增图表 -------------------------
    '7955555555502345001': D3HundredPercentBarChartComponent, // 百分比条形图
    '7955555555502345002': D3PictographBarChartComponent, // 符号柱状图
    '7955555555502345003': D3ReverseOverlapAreaChartComponent, // 纵向层叠面积图
    '7955555555502345004': D3ReverseStackedAreaChartComponent, // 纵向堆叠面积图
    '7955555555502345005': D3ReverseLineChartComponent, // 纵向折线图

    // ------------------ 2020-06-19 新增图表 -------------------------
    '7955555555502346001': D3TableChartComponent, // 表格
    '7955555555502346002': D3BasicScatterChartComponent, // 散点图
    '7955555555502346003': D3HistogramChartComponent, // 直方图

    // ------------------ 2020-11-20 新增图表 -------------------------
    '7955555666601234501': D3HundredPercentIconBarChartComponent, // 百分比符号条形图
    '7955555666601234502': D3LollipopChartComponent, // 棒棒糖图
    '7955555666601234503': D3GroupAggregationBubbleChartComponent, // 分组聚合气泡图
    '7955555666601234504': D3ForceDiagramChartComponent, // 分组力导图
    '7955555666601234505': D3PolarAreaChartComponent, // 极化面积图
    '7955555666601234506': D3PolarLineChartComponent, // 极化折线图
    '7955555666601234507': D3ForceDiagramArrowChartComponent, // 箭头导向图
    '7955555666601234508': D3VerticalDumbbellChartComponent, // 纵向哑铃图

    // ------------------ 2021-02-22 新增图表 -------------------------
    '7955555777700001203': D3ParallelLineChartComponent, // 平行线图
    '7955555777700001204': D3ButterflyChartComponent, // 蝴蝶图
    '7955555777700001202': D3ReverseFunnelChartComponent, // 金字塔图
    '7955555777700001201': D3SoapBubbleChartComponent, // 维诺图
    '7955555777700001205': D3PolarBarChartComponent, // 极坐标柱状图
    '7955555777700001206': D3PolarStackRectangularChartComponent, // 极坐标堆叠柱状图
    '7955555777700001207': D3DescartesHeatmapChartComponent, // 笛卡尔热力图
    '7955555777700001208': D3PolarHeatmapChartComponent, // 极坐标热力图
    '7955555777700001209': D3TernaryChartComponent, // 三元图
  }

  TemplateTextBlockProps: TextBlockProps = {
    size: {
      height: '68',
      width: '260',
      ratio: null,
    },
    opacity: 100,
    fontSize: 14,
    fontFamily: '阿里巴巴普惠体 常规',
    lineHeight: 1,
    letterSpacing: 0,
    color: '#000',
    basic: {
      bold: false,
      underline: false,
      italic: false,
      deleteline: false,
      align: 'left',
    },
    template: 'body',
    content: 'hello world',
  }

  TemplateTextBlock: Block = {
    blockId: 'sdg8659erbgvggsd4yv',
    templateId: '333333333333333333',
    type: 'text',
    position: {
      left: 260,
      top: 200,
    },
    props: this.TemplateTextBlockProps,
  }

  constructor() {}
}
