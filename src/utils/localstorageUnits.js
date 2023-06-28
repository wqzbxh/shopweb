const USER_KEY = 'user_key'
const PATH_KEY = 'Path'
const TAB_KEY = 'Tab_key'
/*包含 n 个操作 local storage 的工具函数的模块
*/
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    saveUser(user) {
        const userJSON = JSON.stringify(user);
        localStorage.setItem('USER_KEY', userJSON);
    },
    getUser() {
        const userJSON = localStorage.getItem('USER_KEY');
        const user = userJSON ? JSON.parse(userJSON) : {};
        return user;
    },
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        localStorage.removeItem('USER_KEY');
    },
    /**
     * currentActivePath 
     * currentActiveIndex
     * currentChildrenActivePath
     * collapsedMenus
     * @param 
     */
    savePath(pathName){
        //保存路径,用于刷新时网址路径不是菜单栏的时候
       // Save the path to refresh the URL path is not when the menu bar is not the menu bar
        let pathData = {};
        if (localStorage.getItem(PATH_KEY)) {
            pathData = JSON.parse(localStorage.getItem(PATH_KEY));
            pathData = { ...pathData, ...pathName };
        } else {
            pathData = pathName;
        }
          localStorage.setItem(PATH_KEY, JSON.stringify(pathData));
       
    },
    getPath(){
        return JSON.parse(localStorage.getItem(PATH_KEY)) || {};
    },
    //保存选项卡索引，刷新后还停留当前位置
  //保存选项卡索引，刷新后还停留当前位置
    saveTabIndex(classTab){
        let pathData = {};
        if (localStorage.getItem(TAB_KEY)) {
        pathData = JSON.parse(localStorage.getItem(TAB_KEY));
        pathData = { ...pathData, ...classTab };
        } else {
        pathData = classTab;
        }
        localStorage.setItem(TAB_KEY, JSON.stringify(pathData));

    },
    getTabIndex(){
        return JSON.parse(localStorage.getItem(TAB_KEY)) || {};
    },
}
