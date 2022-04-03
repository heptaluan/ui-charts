;
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockHoverDirective } from './hover.directive';
import { ChartDirective } from './chart.directive';
import { ShareModule } from '../share/share.module';
import { ShapeComponent } from './shape/shape.component';
import { TextComponent } from './text/text.component';
import { BlockComponent } from './block.component';
import { ImageComponent } from './image/image.component';
import { ChartMapService } from './chart-map.service';
import { ShapeMapService } from './shape-map.service';
import { ImageMapService } from './image-map.service';
import { AudioMapService } from './audio-map.service';
import { VideoMapService } from './video-map.service';

import { ContextMenuModule } from 'ngx-contextmenu';

import { D3ChartDirective } from './d3/d3-chart.directive';
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
  D3TwoLevelTreemapChartComponent,
  D3OneLevelTreemapChartComponent,
  D3ChordChartComponent,
  D3SunburstChartComponent,
  D3TreeChartComponent,
  D3WeightedTreeChartComponent,
  D3PyramidChartComponent,
  D3StreamgraphChartComponent,
  D3RadarChartComponent,
  D3MultipleBarChartComponent,
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
  D3RainfallVolumeLineChartComponent,       // 雨量流量折线图
  D3RainfallVolumeAreaChartComponent,       // 雨量流量面积图
  D3BulletChartComponent,                   // 子弹图
  D3DeformedBarChartComponent,              // 变形柱状图
  D3MultipleBubbleChartComponent,           // 多轴气泡图
  D3PolarBubbleChartComponent,              // 极坐标气泡图
  D3PunchBubbleChartComponent,              // 打卡气泡图
  
  // ------------------ 动态图表  -------------------------
  D3DynamicBarChartComponent,               // 动态条形图
  D3DynamicLineChartComponent,              // 动态折线图
  D3DynamicRankLineChartComponent,          // 动态排名变化图
  D3PackChartComponent,                     // 圆堆积图

  // ------------------ 2020-06-08 新增图表 -------------------------
  D3HundredPercentBarChartComponent,        // 百分比条形图
  D3PictographBarChartComponent,            // 符号柱状图
  D3ReverseOverlapAreaChartComponent,       // 纵向层叠面积图
  D3ReverseStackedAreaChartComponent,       // 纵向堆叠面积图
  D3ReverseLineChartComponent,              // 纵向折线图

  // ------------------ 2020-06-19 新增图表 -------------------------
  D3TableChartComponent,                    // 表格
  D3BasicScatterChartComponent,             // 散点图
  D3HistogramChartComponent,                // 直方图

  // ------------------ 2020-11-20 新增图表 -------------------------
  D3HundredPercentIconBarChartComponent,    // 百分比符号条形图
  D3LollipopChartComponent,                 // 棒棒糖图
  D3GroupAggregationBubbleChartComponent,   // 分组聚合气泡图
  D3ForceDiagramChartComponent,             // 分组力导图
  D3PolarAreaChartComponent,                // 极化面积图
  D3PolarLineChartComponent,                // 极化折线图
  D3ForceDiagramArrowChartComponent,        // 箭头导向图
  D3VerticalDumbbellChartComponent,         // 纵向哑铃图
  
  // ------------------ 2021-02-22 新增图表 -------------------------
  D3ParallelLineChartComponent,             // 平行线图
  D3ButterflyChartComponent,             // 蝴蝶图
  D3ReverseFunnelChartComponent,             // 金字塔图
  D3SoapBubbleChartComponent,             // 维诺图
  D3PolarBarChartComponent,             // 极坐标柱状图
  D3PolarStackRectangularChartComponent,             // 极坐标堆叠柱状图
  D3DescartesHeatmapChartComponent,             // 笛卡尔热力图
  D3PolarHeatmapChartComponent,             // 极坐标热力图
  D3TernaryChartComponent,             // 三元图
} from './d3';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { GroupComponent } from './group/group.component';
import { GroupMapService } from './group-map.service';

const D3_COMPONENTS = [
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
  D3TwoLevelTreemapChartComponent,
  D3OneLevelTreemapChartComponent,
  D3ChordChartComponent,
  D3SunburstChartComponent,
  D3TreeChartComponent,
  D3WeightedTreeChartComponent,
  D3PyramidChartComponent,
  D3StreamgraphChartComponent,
  D3RadarChartComponent,
  D3MultipleBarChartComponent,
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
  D3RainfallVolumeLineChartComponent,       // 雨量流量折线图
  D3RainfallVolumeAreaChartComponent,       // 雨量流量面积图
  D3BulletChartComponent,                   // 子弹图
  D3DeformedBarChartComponent,              // 变形柱状图
  D3MultipleBubbleChartComponent,           // 多轴气泡图
  D3PolarBubbleChartComponent,              // 极坐标气泡图
  D3PunchBubbleChartComponent,              // 打卡气泡图

  // ------------------ 动态图表  -------------------------
  D3DynamicBarChartComponent,               // 动态条形图          
  D3DynamicLineChartComponent,              // 动态折线图
  D3DynamicRankLineChartComponent,          // 动态排名变化图  
  D3PackChartComponent,                     // 圆堆积图

  // ------------------ 2020-06-08 新增图表 -------------------------
  D3HundredPercentBarChartComponent,        // 百分比条形图
  D3PictographBarChartComponent,            // 符号柱状图
  D3ReverseOverlapAreaChartComponent,       // 纵向层叠面积图
  D3ReverseStackedAreaChartComponent,       // 纵向堆叠面积图
  D3ReverseLineChartComponent,              // 纵向折线图

  // ------------------ 2020-06-19 新增图表 -------------------------
  D3TableChartComponent,                    // 表格
  D3BasicScatterChartComponent,             // 散点图
  D3HistogramChartComponent,                // 直方图

  // ------------------ 2020-11-20 新增图表 -------------------------
  D3HundredPercentIconBarChartComponent,    // 百分比符号条形图
  D3LollipopChartComponent,                 // 棒棒糖图
  D3GroupAggregationBubbleChartComponent,   // 分组聚合气泡图
  D3ForceDiagramChartComponent,             // 分组力导图
  D3PolarAreaChartComponent,                // 极化面积图
  D3PolarLineChartComponent,                // 极化折线图
  D3ForceDiagramArrowChartComponent,        // 箭头导向图
  D3VerticalDumbbellChartComponent,         // 纵向哑铃图

  // ------------------ 2021-02-22 新增图表 -------------------------
  D3ParallelLineChartComponent,             // 平行线图
  D3ButterflyChartComponent,             // 蝴蝶图
  D3ReverseFunnelChartComponent,             // 金字塔图
  D3SoapBubbleChartComponent,             // 维诺图
  D3PolarBarChartComponent,             // 极坐标柱状图
  D3PolarStackRectangularChartComponent,             // 极坐标堆叠柱状图
  D3DescartesHeatmapChartComponent,             // 笛卡尔热力图
  D3PolarHeatmapChartComponent,             // 极坐标热力图
  D3TernaryChartComponent,             // 三元图
];

const CHART_DIRECTIVES = [
  D3ChartDirective,
  ChartDirective,
  BlockHoverDirective
];

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    ContextMenuModule.forRoot()
  ],
  exports: [...D3_COMPONENTS, ...CHART_DIRECTIVES],
  declarations: [
    ...CHART_DIRECTIVES,
    ...D3_COMPONENTS,
    TextComponent,
    BlockComponent,
    ShapeComponent,
    ImageComponent,
    AudioComponent,
    VideoComponent,
    GroupComponent
  ],
  entryComponents: [...D3_COMPONENTS, TextComponent, BlockComponent, ShapeComponent, ImageComponent, AudioComponent, VideoComponent, GroupComponent]
})

export class BlockModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: BlockModule,
      providers: [ChartMapService, ShapeMapService, ImageMapService, AudioMapService, VideoMapService, GroupMapService],
    };
  }
}
