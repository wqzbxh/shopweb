export interface ISpecification {
    name: string;
    created_at: string;
    id: number;
    filteredAttributesItem: FilteredAttribute[];
  }
  
  export  interface FilteredAttribute {
    id: number;
    attr_name: string;
    attr_val: string;
    cid: number;
    sort: number;
    created_at: string;
    updated_at: string;
  }


export interface AttributeValue {
    id: number;
    attr_value: string;
}
export interface Attribute {
    id: number;
    attr_name: string;
    attr: AttributeValue[];
}
