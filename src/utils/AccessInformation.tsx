import { apiGoodsCategory, apiGoodsType, apiTimeTracker, apiUserRole } from "../api";
import { ApiResponse } from "../interface/Icommon";

/***
 * 
 */
export const getAllRoleSelect= async (select:any) =>
{
    const RoleSelectResponese = await apiUserRole(select, "GET");
    const RoleSelect = RoleSelectResponese.data as ApiResponse;
    return RoleSelect.data;
}

export const getAllGoodCategory= async (select:any) =>
{
    const goodsCategoryDataResponese = await apiGoodsCategory({}, "GET");
    if(goodsCategoryDataResponese.data.code==200){
        return goodsCategoryDataResponese.data.data;
    }
    return [];
}



export const getAllTimeTracker= async (select:any) =>
{
    const TimeTrackerResponese = await apiTimeTracker(select, "GET");
    if(TimeTrackerResponese.data.code==200){
        const timeTrackProject =  TimeTrackerResponese.data.data.map((item:any,index:any)=>{
            return { value:item.id as string, label:item.name,  }
        })
        return timeTrackProject;
    }
    return [];
}



/**
 * 获取商品规格类型
 */
export const getAllGoodsType= async (select:any) =>
{
    const goodsCategoryDataResponese = await apiGoodsType(select, "GET");
    return goodsCategoryDataResponese.data.data;
}