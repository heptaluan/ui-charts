﻿﻿export const chartDisplayDicArr = [
  {
    "jsonElement": "lineWidth",
    "dataType": "number",
    "displayTitle": "线宽(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "线宽"
  },
  {
    "jsonElement": "endPointRadius",
    "dataType": "number",
    "displayTitle": "节点半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "节点半径"
  },
  {
    "jsonElement": "endPointBorderWidth",
    "dataType": "number",
    "displayTitle": "节点描边线宽(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "节点描边线宽"
  },
  {
    "jsonElement": "endPointBorderColor",
    "dataType": "hex|null",
    "displayTitle": "节点描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "节点描边颜色,当为null时,颜色将随线条颜色"
  },
  {
    "jsonElement": "endPointFillColor",
    "dataType": "hex|null",
    "displayTitle": "节点填充颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "节点填充色,当为null时,颜色将随线条颜色"
  },
  {
    "jsonElement": "bubbleSizeType",
    "dataType": "multichoices",
    "displayTitle": "绘制基准",
    "control": "dropdown-toggle",
    "dropdownList": ["气泡半径", "气泡面积"],
    "outputList": ["diameter", "area"],
    "desc": "气泡的半径基准"
  },
  {
    "jsonElement": "bubbleBorderWidth",
    "dataType": "number",
    "displayTitle": "气泡描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "气泡描边宽度"
  },
  {
    "jsonElement": "bubbleBorderColor",
    "dataType": "hex|null",
    "displayTitle": "气泡描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "气泡描边色,当为null时,颜色将随线条颜色"
  },
  {
    "jsonElement": "minRadius",
    "dataType": "number",
    "displayTitle": "最小气泡半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 1000],
    "desc": "最小气泡半径"
  },
  {
    "jsonElement": "maxRadius",
    "dataType": "number",
    "displayTitle": "最大气泡半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 1000],
    "desc": "最大气泡半径"
  },
  {
    "jsonElement": "fillOpacity",
    "dataType": "percentage",
    "displayTitle": "不透明度(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "输出值为0-1的小数"
  },
  {
    "jsonElement": "barWidthPercent",
    "dataType": "percentage",
    "displayTitle": "宽度比例(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "矩形占分区的比例,输出值为0-1的小数"
  },
  {
    "jsonElement": "borderWidth",
    "dataType": "number",
    "displayTitle": "描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "描边宽度(px)"
  },
  {
    "jsonElement": "borderColor",
    "dataType": "hex|null",
    "displayTitle": "描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "气泡描边色,当为null时,颜色将随线条颜色"
  },
  {
    "jsonElement": "bar4CornerRadius",
    "dataType": "array",
    "displayTitle": "柱形圆角(px)",
    "control": "corner-array",
    "dropdownList": "",
    "outputList": "",
    "desc": "柱形四角圆角（左上、右上、左下、右下）"
  },
  {
    "jsonElement": "barborderWidth",
    "dataType": "number",
    "displayTitle": "柱形描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "描边宽度"
  },
  {
    "jsonElement": "barborderColor",
    "dataType": "hex|null",
    "displayTitle": "柱形描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "柱形描边颜色,当为null时,颜色将随柱子的颜色"
  },
  {
    "jsonElement": "lineType",
    "dataType": "multichoices",
    "displayTitle": "折线样式",
    "control": "dropdown-toggle",
    "dropdownList": ["直线", "曲线"],
    "outputList": ["straight", "curve"],
    "desc": "折线样式"
  },
  {
    "jsonElement": "cornerRadius",
    "dataType": "number",
    "displayTitle": "圆角半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 1000],
    "desc": "圆角半径"
  },
  {
    "jsonElement": "innerRadiusRatio",
    "dataType": "percentage",
    "displayTitle": "内径占比(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "挖空比例"
  },
  {
    "jsonElement": "smallInnerRadiusRatio",
    "dataType": "percentage",
    "displayTitle": "内径占比(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "挖空比例"
  },
  {
    "jsonElement": "gapPercentage",
    "dataType": "percentage",
    "displayTitle": "间隙(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "环图的间隙角度百分比，100%等于10度"
  },
  {
    "jsonElement": "sectorSizeType",
    "dataType": "multichoices",
    "displayTitle": "绘制基准",
    "control": "dropdown-toggle",
    "dropdownList": ["半径", "面积"],
    "outputList": ["diameter", "area"],
    "desc": "扇形的绘制基准"
  },
  {
    "jsonElement": "barCornerRadius",
    "dataType": "number",
    "displayTitle": "柱形圆角半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 1000],
    "desc": "柱形圆角半径"
  },
  {
    "jsonElement": "countOfBars",
    "dataType": "number",
    "displayTitle": "柱形个数",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "显示的柱形个数"
  },
  {
    "jsonElement": "countOfLines",
    "dataType": "number",
    "displayTitle": "排名数",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "折线图显示的排名个数"
  },
  {
    "jsonElement": "barOrderBy",
    "dataType": "multichoices",
    "displayTitle": "排序方式",
    "control": "dropdown-toggle",
    "dropdownList": ["降序", "升序", "不排序"],
    "outputList": ["desc", "asc", "fix"],
    "desc": "条形图的排序方式"
  },
  {
    "jsonElement": "barBackgroundColor",
    "dataType": "hex|null",
    "displayTitle": "底色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "百分比进度图的底色"
  },
  {
    "jsonElement": "IconsPerRow",
    "dataType": "number",
    "displayTitle": "每行图标数",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [1, 1000],
    "desc": "符号图每行的形状的个数"
  },
  {
    "jsonElement": "countOfRows",
    "dataType": "number",
    "displayTitle": "图标行数",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "符号饼图的行数"
  },
  {
    "jsonElement": "formationType",
    "dataType": "multichoices",
    "displayTitle": "显示顺序",
    "control": "dropdown-toggle",
    "dropdownList": ["整体-部分", "部分-整体"],
    "outputList": ["decrease", "increase"],
    "desc": "组成瀑布的排布方式"
  },
  {
    "jsonElement": "histogramSection",
    "dataType": "multi-key-value",
    "displayTitle": "组数、组距",
    "control": "multichoices-value",
    "dropdownList": ["组数", "组距"],
    "outputList": ["groupNum", "groupDistance"],
    "desc": "用以单选后赋值对象。"
  },
  {
    "jsonElement": "bubbleDiameter",
    "dataType": "number",
    "displayTitle": "气泡半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 1000],
    "desc": "气泡半径"
  },
  {
    "jsonElement": "iconBorderWidth",
    "dataType": "number",
    "displayTitle": "图标描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "符号的描边宽度"
  },
  {
    "jsonElement": "iconBorderColor",
    "dataType": "hex|null",
    "displayTitle": "图标描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "符号的描边颜色"
  },
  {
    "jsonElement": "iconScale",
    "dataType": "percentage",
    "displayTitle": "缩放比例(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "符号相对于栅格系统的比例"
  },
  {
    "jsonElement": "smallInnerRadiusRatio",
    "dataType": "percentage",
    "displayTitle": "内径占比(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "内环内径占比(%)"
  },
  {
    "jsonElement": "gapPercentage",
    "dataType": "percentage",
    "displayTitle": "径向间隙(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "径向间隙（%）。100%时为10度"
  },
  {
    "jsonElement": "areaBorderWidth",
    "dataType": "number",
    "displayTitle": "描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "描边宽度(px)"
  },
  {
    "jsonElement": "areaBorderColor",
    "dataType": "hex|null",
    "displayTitle": "描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": "",
    "desc": "描边颜色"
  },
  {
    "jsonElement": "displayQuadrant",
    "dataType": "multichoices",
    "displayTitle": "显示区域",
    "control": "dropdown-toggle",
    "dropdownList": ["第一象限", "第二象限","第三象限","第四象限"],
    "outputList": ["1st", "2nd","3rd","4th"],
    "desc": "显示扇形所在的象限"
  },
  {
    "jsonElement": "startAngleChoice",
    "dataType": "multichoices",
    "displayTitle": "起始角度",
    "control": "dropdown-toggle",
    "dropdownList": ["0", "90","180","270"],
    "outputList":  ["0", "90","180","270"],
    "desc": "起始角度选项"
  },
  {
    "jsonElement": "totalAngle",
    "dataType": "number",
    "displayTitle": "绘制角度",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 360],
    "desc": "总绘制角度"
  },
  {
    "jsonElement": "totalAngle_demi",
    "dataType": "number",
    "displayTitle": "绘制角度",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [180, 360],
    "desc": "总绘制角度"
  },
  {
    "jsonElement": "rotateDirection",
    "dataType": "multichoices",
    "displayTitle": "绘制方向",
    "control": "dropdown-toggle",
    "dropdownList": ["顺时针", "逆时针"],
    "outputList": ["clockwise", "counterclockwise"],
    "desc": "旋转方向"
  },
  {
    "jsonElement": "maxRadius",
    "dataType": "number",
    "displayTitle": "最大节点半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "树图的最大节点半径(px)"
  },
  {
    "jsonElement": "linkColor",
    "dataType": "hex|null",
    "displayTitle": "线颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "关联线颜色模式"
  },
  {
    "jsonElement": "nodeColor",
    "dataType": "hex|null",
    "displayTitle": "节点填充颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "节点颜色模式"
  },
  {
    "jsonElement": "nodeBorderWidth",
    "dataType": "number",
    "displayTitle": "节点描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "节点描边宽度(px)"
  },
  {
    "jsonElement": "nodeBorderColor",
    "dataType": "hex|null",
    "displayTitle": "节点描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "节点描边颜色"
  },
  {
    "jsonElement": "nodeWidth",
    "dataType": "number",
    "displayTitle": "节点总宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "节点描边(px)"
  },
  {
    "jsonElement": "nodeGap",
    "dataType": "number",
    "displayTitle": "节点间距(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "节点间距(px)"
  },
  {
    "jsonElement": "processGapPercentage",
    "dataType": "percentage",
    "displayTitle": "嵌套间隙(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "进度条和背景色块直接的整体四周的间隙"
  },
  {
    "jsonElement": "processCornerRadius",
    "dataType": "number",
    "displayTitle": "进度圆角半径(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "进度条圆角，仅结束处的两个圆角"
  },
  {
    "jsonElement": "bgBorderWidth",
    "dataType": "number",
    "displayTitle": "背景描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "背景描边宽度(px)"
  },
  {
    "jsonElement": "bgBorderColor",
    "dataType": "hex|null",
    "displayTitle": "背景描边颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "背景描边颜色"
  },
  {
    "jsonElement": "processStartAngle",
    "dataType": "number",
    "displayTitle": "起始角度",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 360],
    "desc": "进度条起始角度"
  },
  {
    "jsonElement": "bgColor",
    "dataType": "hex|null",
    "displayTitle": "背景填充颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "背景颜色"
  },
  {
    "jsonElement": "bubbleFillColor",
    "dataType": "hex|null",
    "displayTitle": "气泡填充颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "气泡填充色"
  },
  {
    "jsonElement": "circleGapRange",
    "dataType": "array",
    "displayTitle": "间隙范围(%)",
    "control": "range-number-input",
    "dropdownList": "",
    "outputList": "",
    "desc":"间隙的起始点相对位置"
  },
  {
    "jsonElement": "linkWidth",
    "dataType": "number|null",
    "displayTitle": "线宽(px)",
    "control": "dropdown-toggle&number-input",
    "dropdownList": ["自动", "固定值"],
    "outputList": [0, 100],
    "desc": "关联线宽度(px)"
  },
  {
    "jsonElement": "gapDistance",
    "dataType": "number",
    "displayTitle": "间隙(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "间隙"
  },
  {
    "jsonElement": "linkWidth_static",
    "dataType": "number",
    "displayTitle": "线宽(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "树图固定线宽(px)"
  },
  {
    "jsonElement": "linkOpacity",
    "dataType": "percentage",
    "displayTitle": "线不透明度(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "桑吉图的线不透明度输出值为0-1的小数"
  },
  {
    "jsonElement": "bgOpacity",
    "dataType": "percentage",
    "displayTitle": "底色不透明度(%)",
    "control": "number-input-percentage",
    "dropdownList": "",
    "outputList": "",
    "desc": "进度图底色为0-1的小数"
  },
  {
    "jsonElement": "arrangement",
    "dataType": "multichoices",
    "displayTitle": "排列方式",
    "control": "dropdown-toggle",
    "dropdownList": ["分组", "聚合"],
    "outputList": ["grouping", "polymerization"],
    "desc": "聚合图的聚合方式"
  },
  {
    "jsonElement": "iconBgColor",
    "dataType": "hex|null",
    "displayTitle": "符号背景色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "符号条形图的符号底色"
  },
  {
    "jsonElement": "triangleHeight",
    "dataType": "number",
    "displayTitle": "箭头高度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "箭头向导图三角形的高度(px)"
  },
  {
    "jsonElement": "triangleBtWidth",
    "dataType": "number",
    "displayTitle": "箭头宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "箭头向导图三角形的底边宽度(px)"
  },
  {
    "jsonElement": "centralAxisWidth",
    "dataType": "number",
    "displayTitle": "中轴线线宽(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "李克特量表图中轴线宽度(px)"
  },
  {
    "jsonElement": "centralAxisColor",
    "dataType": "hex",
    "displayTitle": "中轴线颜色",
    "control": "color-picker",
    "dropdownList": "",
    "outputList":"",
    "desc": "李克特量表图中轴线色"
  },
  {
    "jsonElement": "lineColor",
    "dataType": "hex",
    "displayTitle": "线颜色",
    "control": "dropdown-toggle&color-picker",
    "dropdownList": ["自动", "固定色"],
    "outputList": ["null", "#hex#"],
    "desc": "杠铃图中的线颜色"
  },
  {
    "jsonElement": "lineColor_static",
    "dataType": "hex",
    "displayTitle": "线颜色",
    "control": "color-picker",
    "dropdownList": "",
    "outputList": "",
    "desc": "杠铃图中的线颜色"
  },
  {
    "jsonElement": "endPointBorderColor_static",
    "dataType": "hex",
    "displayTitle": "节点描边颜色",
    "control": "color-picker",
    "dropdownList": "",
    "outputList": "",
    "desc": "固定色"
  },
  {
    "jsonElement": "endPointFillColor_static",
    "dataType": "hex",
    "displayTitle": "节点填充颜色",
    "control": "color-picker",
    "dropdownList": "",
    "outputList": "",
    "desc": "固定颜色"
  },
  {
    "jsonElement": "firstLevelBorderWidth",
    "dataType": "number",
    "displayTitle": "一级描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "维诺图第一层边线的宽度(px)"
  },
  {
    "jsonElement": "secondLevelBorderWidth",
    "dataType": "number",
    "displayTitle": "二级描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "维诺图第二层边线的宽度(px)"
  },
  {
    "jsonElement": "outerCircleBorderWidth",
    "dataType": "number",
    "displayTitle": "外圆描边宽度(px)",
    "control": "number-input",
    "dropdownList": "",
    "outputList": [0, 100],
    "desc": "维诺图最外层边线的宽度(px)"
  },
  {
    "jsonElement": "outerShape_v",
    "dataType": "multichoices",
    "displayTitle": "形状",
    "control": "dropdown-toggle",
    "dropdownList": ["椭圆形","三角形","矩形","菱形","五边形","六边形","八边形"],
    "outputList": ["oval","triangle","rectangle","diamond","pentagon","hexagon","octagon"],
    "desc": "维诺图的外部形状"
  },
  {
    "jsonElement": "scaleType",
    "dataType": "multichoices",
    "displayTitle": "绘制方式",
    "control": "dropdown-toggle",
    "dropdownList": ["固定比例","自由比例"],
    "outputList": ["fixed","auto"],
    "desc": "维诺图的缩放比例方式"
  },
];