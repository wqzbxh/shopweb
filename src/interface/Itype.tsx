  
export interface Itype {
    id: string,
    name: string,
    is_use: string,
    sort: string,
  }


export interface Item {
    name: string;
    created_at: string;
    id: number;
    filteredAttributesItem: FilteredAttributeItem[];
  }
  
  export interface FilteredAttributeItem {
    id: number;
    attr_name: string;
    attr_val: string;
    cid: number;
    sort: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Data {
    count: number;
    data: Item[];
  }
  
  export interface Response {
    data: Data;
  }
  