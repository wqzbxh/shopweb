import { apiUserRole } from "../api";
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