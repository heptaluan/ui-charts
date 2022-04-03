/*
 * @Description: v1.0版本chart Model
 */

 export interface ChartBase {
     id: number;
     chart_type: string;
     html_src: string;
     setting: any;
     cols_describe: any;
     data: any;
 }
