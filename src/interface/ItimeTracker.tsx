// 定义接口
export interface EventData {
    title: string;
    id: string;
    start: string;
    end: string;
    time:string;
    time_mark:string;
    time_project_id:string,
    sourceResource?: any;
    [key:string]:any
}


// 定义一个接口描述单个行数据
export interface RowData {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    time: string;
  }
  
  // 定义一个接口描述整个数据结构
  export interface Data {
    rows: RowData[];
    total_time: string;
  }
  
  