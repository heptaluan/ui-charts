/*
 * @Description: 个人项目modal
 */

export interface FontTheme {
    fontSize: number;
    fontFamily?: string;
    fontWeight?: number;
    leterSpace?: number;
    lineSpace?: number;
    color: string;
}

// export interface ProjectTheme {
//     title: string;
//     colors: string[];
//     fontFamily: string;
//     texts: {
//         header1: FontTheme;
//         header2: FontTheme;
//         body: FontTheme;
//     };
//     charts: {
//         animation: number;
//         fonts: FontTheme;
//         legend: 0 | 1;
//         toolTips: 0 | 1;
//     };
// }

export interface ColDef {
    name: string;
    index: number;
    allowType: string;
    isLegend: boolean;
}

export interface Legend {
    show: boolean;
    xPosition: 'left' | 'center' | 'right';
    yPosition: 'top' | 'bottom';
}

export interface AxisLine {
    labelShow: boolean;
    name: string;
    range?: any[];
}

export interface Axis {
    grid: {
        show: 'x' | 'y' | 'all' | null;
        color: string | number;
    };
    color: string | number;
    x: AxisLine;
    y: AxisLine;
}

export interface ChartBlockProps {
    size: {
        height: any;
        width: any;
        ratio: number;
        rotate: number;
    };
    map: ColDef[];
    legend: Legend;
    axis: Axis;
    font: FontTheme;
    tooltip: boolean;
    colors: {
        type: 'single' | 'multiple' | 'linear';
        list: any[];
    };
    titleDisplay: any;
    animation: any;
}

export interface TextBlockProps {
    size: {
        height: string;
        width: string;
        rotate?: number;
        ratio: number;
    };
    opacity: number;
    fontFamily: string;
    color: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    basic: {
        bold: boolean;
        underline: boolean;
        italic: boolean;
        deleteline: boolean;
        align: string;
    };
    template: string;
    content: string;
}
export interface ShapeBlockProps {
    size: {
        height: string;
        width: string;
        rotate?: number;
        ratio: number;
    };
    specified: {
        rx: number;
        ry: number;
    };
    fill: {
        fillColor: string;
    };
    opacity: number;
    strokeColor: string;
    strokeType: string;
    strokeWidth: number;
    tooltip: true;
    tooltipText: string;
    shadowColor: string;
    shadowRadius: number;
    shadowAngle: number;
    shadowBlur: number;
}

export interface Block {
    projectId?: string;
    blockId: string;
    type: 'chart' | 'text' | 'shape' | 'audio' | 'group' | 'video';
    path?: string;
    shapeType?: 'line' | 'rectangle' | 'oval' | 'round-rectangle' | 'triangle' | 'pentagon';
    position?: {
        left: number;
        top: number;
        rotate?: number;
    };
    dataSrc?: {
        srcType: 'local' | 'remote';
        dataType: 'cross-table' | 'object-table';
        data?: any[] | string;
        url?: string;
        download: boolean;
    };
    templateId?: string;
    label?: string;
    templateSwitch?: string;
    theme?: ProjectTheme;
    content?: string;
    props: ChartBlockProps | TextBlockProps | ShapeBlockProps;
}



export interface Page {
    pageId: string;
    design: {
        background: string;
    };
    blocks: Array<Block>;
}

export interface ProjectDesign {
    backgroundColor?: string;
    height?: any;
    width?: any;
    sizeType?: string;
    ratio: number | null;
}

export interface ChartProjectContents {
    design?: ProjectDesign;
    blocks: Array<Block>;
}

export interface InfographicProjectContents {
    design: ProjectDesign;
    pages: Page[];
}

export interface ProjectContentObject {
    blockId?: string;
    pageId?: string;
    type: 'chart' | 'text' | 'page' | 'article' | 'shape' | 'image' | 'template' | 'audio' | 'video' | 'group' | 'multiple';
    step?: number;
    target?: string;
    flag?: any;
    index?: number;
}

export interface UpdateProjectContent {
    target: ProjectContentObject;
    method: 'add' | 'put' | 'delete';
    block?: Block;
    page?: Page;
    design?: ProjectDesign;
}

export interface ProjectBase {
    id: string;
    pro: boolean;
    user_id: string;
    title: string;
    thumb: string;
    description: string;
    tags: string;
    private: boolean;
    public_url: string;
    private_url: string;
    password: string;
    enable_private_link: boolean;
    create_time: string;
    modify_time: string;
    version: number;
    type: string;
    theme_id: string;
    price?: number;
    editable?: string;
    dynamic?: string;
}

export interface ProjectArticle {
    contents: any;
    hash: string;
}

export interface ProjectInfo extends ProjectBase {
    theme: ProjectTheme;
    article: ProjectArticle;
}

export interface ChartProjectInfo extends ProjectInfo {
    article: {
        contents: ChartProjectContents;
        hash: string;
    };
}

export interface ChartsProjectInfo extends ProjectInfo {
    article: {
        contents: ChartProjectContents;
        hash: string;
    };
}

export interface InfograhicProjectInfo extends ProjectInfo {
    article: {
        contents: InfographicProjectContents;
        hash: string;
    };
}

// 信息图项目列表
export interface ProjectList {
    projects: ProjectBase[];
}

// 单图项目列表
export interface ChartList {
    charts: ProjectBase[];
}

// 新建信息图
export interface CreateProjectInfo {
    title: string;
    description: string;
    public: boolean;
    type: string;
    templateId?: string;
    infoType?: string;
}

export interface ConfigProject {
    action: 'rename' | 'set_description' | 'set_privilege' | 'publish' | 'save_project' | 'save_blocks';
    title?: string;
    description?: string;
    private?: boolean;
    enable_private_link?: boolean;
    password?: string;
    article?: ProjectArticle;
    type?: string;
    isNoToastrTip?: boolean;
}

export interface ProjectThemeList {
    themes: ProjectTheme[];
}

export interface ProjectTheme {
    id: string | number;
    price: number;
    theme: PageTheme;
}

export interface PageTheme {
    _id?: number;
    name: string;
    thumb: string;
    colors: any[];
    fonts: {
        fontSize: string,
        color: string,
        fontFamily: string
    };
    grid: {
        color: string
    };
    backgroundColor: string;
    axis: {
        color: string
    };
    shapeColor: number;
    price: number;
}
