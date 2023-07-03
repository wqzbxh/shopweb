export interface ApiResponseGoodsCategory {
    code: number;
    msg: string;
    data: ApiDataGoodsCategory[];
  }
  
  export interface ApiDataGoodsCategory {
    id: string;
    type: string;
    category_name: string;
    category_desc: string;
    order:string|number
  }
  