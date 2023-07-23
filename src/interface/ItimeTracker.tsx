// 定义接口
export interface EventData {
    title: string;
    id: string;
    start: string;
    end: string;
    time:string;
    time_project_id:string,
    sourceResource?: any;
    [key:string]:any
}