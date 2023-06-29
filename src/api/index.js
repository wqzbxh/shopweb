/**
 * 包含应用中所有接口请求函数
 */

// ajax('http://local.fr.com/login',{username:"admin",password:"admin123"},"POST")

import ajax from "./ajax";
const Host = 'api/'

//请求登录接口
//Request login interface
export const apiLogin= (data,method) => ajax(Host+'login',data,method,false);
// 注销接口
export const apiLogout= () => ajax(Host+'logout',{},'POST',false);
// 注册接口
export const apiRegister= (data,method) => ajax(Host+'register',data,method,false)
//请求发送邮箱接口
export const apiSentEmail= (data,method) => ajax(Host+'sent_email',data,method,false)

// 商品分类

// 商品分类
export const apiGoodsCategory= (data,method) => ajax(Host+'goods_category',data,method,false)

// 用户列表
export const apiUserList= (data,method) => ajax(Host+'user',data,method,false)
// 用户列表
export const apiGetMenu= (data,method) => ajax(Host+'get_menu',data,method,false)
// 用户角色
export const apiUserRole= (data,method) => ajax(Host+'user_role',data,method,false)
// 用户列表
export const apiUserRoleList= (data,method) => ajax(Host+'user',data,method,false)

