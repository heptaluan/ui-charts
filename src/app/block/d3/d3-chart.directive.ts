import { Directive, ElementRef, Input, OnInit, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from 'lodash'

@Directive({
  selector: '[dyD3Chart]'
})
export class D3ChartDirective implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() chartOption;
  chartInstance;

  constructor(private el: ElementRef) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.chartOption) {
      this.chartInstance = new this.d3ChartFunc(this.el.nativeElement);
      // this.chartInstance.cloudScale(getPageScale);
      this.chartInstance.setOption(this.chartOption);
      // tooltip 传值 避免缩放比例导致 tooltip 位置不对
      this.chartInstance.tooltip.scale(getPageScale);
      
      this.setFilterStyle()     
    }
  }

  ngOnChanges() {
    if (this.chartInstance) {
      this.chartInstance
        .transition(true)
        .setOption(this.chartOption);

      // tooltip 传值 避免缩放比例导致 tooltip 位置不对
      this.chartInstance.tooltip.scale(getPageScale);

      this.setFilterStyle()
    }
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.el.nativeElement.innerHTML = "";
      this.chartInstance = null;
    }
  }

  resize() {
    if (this.chartInstance) {
      const el = this.el.nativeElement;
      this.chartInstance
        .width(el.offsetWidth)
        .height(el.offsetHeight)
        .transition(false)
        .update()
      this.chartInstance.transition(true);
    }
  }

  /**
   * 
   * @param flag 动画播放/停止
   */
  resizeByChartAnimationSetting(flag = true) {
    if (this.chartInstance) {
      const el = this.el.nativeElement;
      if (flag) {
        this.chartInstance
          .width(el.offsetWidth)
          .height(el.offsetHeight)
          // .transition(false)
          // .update()
          .setOption(this.chartOption)
        // this.chartInstance.transition(true);
      } else if (!flag) {
        this.chartInstance
          .width(el.offsetWidth)
          .height(el.offsetHeight)
          .onInterruptChange()
      }
    }
  }

  dynamicChartStopAnimation(flag: boolean) {
    if (this.chartInstance) {
      const el = this.el.nativeElement;
      if (flag) {
        this.chartInstance
          .width(el.offsetWidth)
          .height(el.offsetHeight)
          .onInterruptChange(false)
      } else {
        this.chartInstance
          .width(el.offsetWidth)
          .height(el.offsetHeight)
          .onInterruptChange(true)
      }
    }
  }

  dynamicChartRenderAnimation(res) {
    if (this.chartInstance && res) {
      const el = this.el.nativeElement;
      this.chartInstance
        .width(el.offsetWidth)
        .height(el.offsetHeight)
        .onTimeChange(res)
    }
  }

  playChartBySpeed(speed: number) {
    if (this.chartInstance) {
      this.chartInstance
        .onDurationChange(speed)
    }
  }

  clearDynamicChartTimer(res) {
    if (this.chartInstance) {
      const el = this.el.nativeElement;
      this.chartInstance
        .width(el.offsetWidth)
        .height(el.offsetHeight)
        .onCleanTimer()
    }
  }

  // 设置图表阴影
  setFilterStyle() {
    if (this.el.nativeElement.querySelector("svg")) {
      this.el.nativeElement.querySelector("svg").style.filter= this.chartOption.props.shadow && this.chartOption.props.shadow.display ? 
                                                                    `drop-shadow(${this.chartOption.props.shadow.shadowColor} 
                                                                    ${Math.round(this.chartOption.props.shadow.shadowRadius * Math.cos(this.chartOption.props.shadow.shadowAngle * Math.PI / 180))}px
                                                                    ${Math.round(this.chartOption.props.shadow.shadowRadius * Math.sin(this.chartOption.props.shadow.shadowAngle * Math.PI / 180))}px 
                                                                    ${this.chartOption.props.shadow.shadowBlur}px)` : ""
    }
  }

  reRender() {
    this.chartInstance.update();
  }

  get d3ChartFunc() {
    const templateId = this.chartOption.templateId;
    
    switch (templateId) {
      case "5544734748594536492":
        return d3Chart.RoundCornerDonutChart;
      case "5544734748594536493":
        return d3Chart.RoundCornerPieChart;
      case "5944734748594536331":
        return d3Chart.RoseChart;
      case "5943734748594536331":
        return d3Chart.QuarterRoseChart;
      case "5544734748594536499":
        return d3Chart.OverlapAreaChart;
      case "5612096174443311134":
        return d3Chart.StepLineChart;
      case "5945734748594536331":
        return d3Chart.RadialBarChart;
      case "5948734748594536332":
        return d3Chart.RadialLineChart;
      case "4447460703254610031":
        return d3Chart.WaveCircleChart;
      case "5544734748594536473":
        return d3Chart.IconBarChart;
      case "5543733748594536505":
        return d3Chart.SimpleSankeyChart;
      case "5543733748594536504":
        return d3Chart.SankeyChart;
      case "5543533748794536504":
        return d3Chart.VerticalSankeyChart;
      case "4447460703254610041":
        return d3Chart.IconPieChart;
      case "5544734748594536494":
        return d3Chart.TwoLevelDonutChart;
      case "5544734748594536500":
        return d3Chart.ChordChart;
      case "5544734748594536503":
        return d3Chart.OneLevelTreemapChart;
      case "5544734748594536502":
        return d3Chart.TwoLevelTreemapChart;
      case "5543734748594537504":
        return d3Chart.SunburstChart;
      case "5543734748595436502":
        return d3Chart.TreeChart;
      case "5543734748594536502":
        return d3Chart.WeightedTreeChart;
      case "5544734748594536478":
        return d3Chart.MultipleBarChart;
      case "5544734748594536487":
        return d3Chart.PyramidChart;
      case "5544734748594536491":
        return d3Chart.RadarChart;
      case "5544734748594536486":
        return d3Chart.StreamgraphChart;
      case "4612096174443311107":
        return d3Chart.GroupingBubbleChart;
      case "5544734748594536484":
        return d3Chart.CalendarHeatmapChart;
      case "5612096174443311145":
        return d3Chart.HollowChart
      case "5544734748594536330":
        return d3Chart.ChangeWaterfallHistogramChart;
      case "5544734748594536326":
        return d3Chart.FormWaterfallHistogramChart;
      case "5544734748594536498":
        return d3Chart.StackedChart;

      // ------------------ 6.2 换库之后新增  -------------------------

      case "444746070325460997":
        return d3Chart.PieChart;

      case "444746070325460998":
        return d3Chart.DonutChart;

      case "444746070325460999":
        return d3Chart.DeformedPieChart;

      case "4544734748594536433":
        return d3Chart.BeeLineChart;

      case "5948734748594536789":
        return d3Chart.SmoothLineChart;

      case "444734748594536323":
        return d3Chart.SimpleBarChart;

      case "154772011302084304":
        return d3Chart.BasicHorizontalBarChart;

      case "3612096174443311105":
        return d3Chart.GroupedBarChart;

      case "3612096174443311107":
        return d3Chart.StackBarChart;

      case "3612096174443311106":
        return d3Chart.NegativeHorizontalBarChart;

      case "3612096174443311110":
        return d3Chart.GroupedHorizontalBarChart;

      case "3612096174443311109":
        return d3Chart.StackHorizontalBarChart;

      case "5544734748594536332":
        return d3Chart.MixLineBarChart;

      case "4544734748594536434":
        return d3Chart.StackedLinearChart;

      case "451905388296536065":
        return d3Chart.PolygonRadarChart;

      case "5544734748594536339":
        return d3Chart.FunnelChart;

      case "154778025133261039":
        return d3Chart.PercentageAreaChart;

      case "154778102528502157":
        return d3Chart.PercentageBarChart;

      case "154777746677828400":
        return d3Chart.HalfPieChart;

      case "154778171740391769":
        return d3Chart.ProgressRoundPieChart;

      case "154778145806026722":
        return d3Chart.BarProgressChart;

      case "154777820323716078":
        return d3Chart.HalfProgressPieChart;

      case "154771854328053247":
        return d3Chart.ArcDiagramChart;

      case "154778232785223023":
        return d3Chart.SlopeChart;

      case "154777693253141239":
        return d3Chart.GanttChart;

      case "154778205305403383":
        return d3Chart.RankingChangeChart;

      case "5544734748594536495":
        return d3Chart.SymmetricChart;

      case "444746070325460995":
        return d3Chart.SimpleLineChart;

      case "7612096173333355101":
        return d3Chart.ContrastiveFunnelChart;

      case "7612096173333355103":
        return d3Chart.RelativeRadarChart;

      case "7612096176663355107":
        return d3Chart.StackCircleChart;

      case "7612096176663355107":
        return d3Chart.StackCircleChart;

      case "7612096176663355103":
        return d3Chart.RangeAreaChart;

      case "7612096176663355104":
        return d3Chart.RangeBarChart;

      case "7612096176663355105":
        return d3Chart.RangeHorizontalBarChart;

      case "7612096174443355101":
        return d3Chart.PolarStackBarChart;

      case "7612096174443355102":
        return d3Chart.PolarStackDonutBarChart;

      case "7612096176663355106":
        return d3Chart.RoseDonutChart;

      case "7612096173333355102":
        return d3Chart.HistogramChart;

      case "114473474859453649":
        return d3Chart.WordCloudChart;

      // ------------------ 20/02/04 换库之后新增  -------------------------
      case "5544734748594536440":      
        return d3Chart.RainfallVolumeLineChart;
      case "5544734748594536441":      
        return d3Chart.RainfallVolumeAreaChart;
      case "111734748594536325":      
        return d3Chart.DeformedBarChart;
      case "3612096174443311122":      
        return d3Chart.PunchBubbleChart;
      case "3612096174443311121":      
        return d3Chart.PolarBubbleChart;
      case "3612096174443311123":      
        return d3Chart.MultipleBubbleChart;
      case "6543210123456536001":      
        return d3Chart.BulletChart;
        
      // ------------------ 动态图表  -------------------------
      case "8000000011111111001":      
        return d3Chart.DynamicBarChart;
      case "8000000011111111002":      
        return d3Chart.DynamicLineChart;
      case "8000000011111111003":      
        return d3Chart.DynamicRankLineChart;
      case "8000000011111111004":      
        return d3Chart.PackChart;

      // ------------------ 2020-06-08 新增图表  -------------------------
      case "7955555555502345001":      
        return d3Chart.HundredPercentBarChart    // 百分比条形图
      case "7955555555502345002":      
        return d3Chart.PictographBarChart;       // 符号柱状图
      case "7955555555502345003":      
        return d3Chart.ReverseOverlapAreaChart;  // 纵向层叠面积图
      case "7955555555502345004":      
        return d3Chart.ReverseStackedAreaChart;  // 纵向堆叠面积图
      case "7955555555502345005":      
        return d3Chart.ReverseLineChart;         // 纵向折线图

      // ------------------ 2020-06-19 新增图表 -------------------------
      case "7955555555502346001":      
        return d3Chart.TableChart                // 表格
      case "7955555555502346002":      
        return d3Chart.BasicScatterChart         // 散点图
      case "7955555555502346003":      
        return d3Chart.HistogramChart            // 直方图

      // ------------------ 2020-11-20 新增图表 -------------------------
      case "7955555666601234501":      
        return d3Chart.HundredPercentIconBarChart      // 百分比符号条形图
      case "7955555666601234502":      
        return d3Chart.LollipopChart                   // 棒棒糖图
      case "7955555666601234503":      
        return d3Chart.GroupAggregationBubbleChart     // 分组聚合气泡图
      case "7955555666601234504":      
        return d3Chart.ForceDiagramChart               // 分组力导图
      case "7955555666601234505":      
        return d3Chart.PolarAreaChart                  // 极化面积图
      case "7955555666601234506":      
        return d3Chart.PolarLineChart                  // 极化折线图
      case "7955555666601234507":      
        return d3Chart.ForceDiagramArrowChart          // 箭头导向图
      case "7955555666601234508":      
        return d3Chart.VerticalDumbbellChart           // 纵向哑铃图

      // ------------------ 2021-02-22 新增图表 -------------------------
      case "7955555777700001203":
        return d3Chart.ParallelLineChart               // 平行线图
      case "7955555777700001204": 
        return d3Chart.ButterflyChart;                 // 蝴蝶图
      case "7955555777700001202": 
        return d3Chart.ReverseFunnelChart;             // 金字塔图
      case "7955555777700001201": 
        return d3Chart.SoapBubbleChart;                // 维诺图
      case "7955555777700001205": 
        return d3Chart.PolarBarChart;                  // 极坐标柱状图
      case "7955555777700001206": 
        return d3Chart.PolarStackRectangularChart;     // 极坐标堆叠柱状图
      case "7955555777700001207": 
        return d3Chart.DescartesHeatmapChart;          // 笛卡尔热力图
      case "7955555777700001208": 
        return d3Chart.PolarHeatmapChart;              // 极坐标热力图
      case "7955555777700001209": 
        return d3Chart.TernaryChart;                   // 三元图
      default:
        return d3Chart.PieChart;
    }
  }
}

// 获取页面的缩放值
function getPageScale() {
  // let page = document.getElementById("page");
  // if (!page) {
  //   page = document.getElementById("focal");
  // };
  // if (!page) {
  //   return;
  // }
  // const matrix = window.getComputedStyle(page, null).transform;
  // console.log(window.getComputedStyle(page, null));
  
  // const scale = (!matrix || matrix === "none") ? 1 : matrix.substring(7).split(",")[0];
  if (document.querySelector('.page-size span')) {
    return Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100;
  } else {
    return 1;
  }
}
